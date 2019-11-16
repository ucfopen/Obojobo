const DraftNode = require('obojobo-express/models/draft_node')
const AssessmentScore = require('./models/assessment-score')
const AssessmentModel = require('./models/assessment')
const Visit = require('obojobo-express/models/visit')
const NODE_NAME = 'ObojoboDraft.Sections.Assessment'

class Assessment extends DraftNode {
	static get nodeName() {
		return NODE_NAME
	}

	constructor(draftTree, node, initFn) {
		super(draftTree, node, initFn)
		this.registerEvents({
			'internal:sendToClient': this.onSendToClient,
			'internal:startVisit': this.onStartVisit
		})
	}

	onSendToClient(req, res) {
		return this.yell(`${NODE_NAME}:sendToClient`, req, res)
	}

	onStartVisit(req, res, draftId, visitId, extensions) {
		let visit
		let canImport = true // @TODO ask the visit if importing is enabled
		return req
			.requireCurrentUser()
			.then(() => Visit.fetchById(visitId))
			.then(currentVisit => {
				visit = currentVisit
			})
			.then(() => AssessmentModel.fetchAttemptHistory(
				req.currentUser.id,
				draftId,
				visit.is_preview,
				visit.resource_link_id
			))
			.then(attemptHistory => {
				// @TODO: I'd be happier changing fetchAttemptHistory to return this exact object
				// IF we can create a more efficient query to get this data
				console.log(attemptHistory)
				console.log('-----------------------------------')
				const map = new Map()
				attemptHistory.forEach(i => {
					// create new object for each assessment id
					if(!map.has(i.assessmentId)) {
						map.set(i.assessmentId, {
							assessmentId: i.assessmentId,
							scores: [],
							unfinishedAttemptId: null,
							importUsed: false
						})
					}

					const current = map.get(i.assessmentId)

					i.attempts.forEach(a => {
						console.log(a)
						current.scores.push(a.assessmentScore)
						if(a.isFinished === false) current.unfinishedAttemptId = a.id
						if(a.isImported === true) current.importUsed = true
					})
				})

				const assessmentSummary = Array.from(map.values())

				// only add extension if summary isn't empty
				if(assessmentSummary.length){
					extensions.push({
						name: NODE_NAME,
						assessmentSummary
					})
				}

				// if there's no attempt history
				// find the highest importable score
				if(canImport && attemptHistory.length === 0){
					return AssessmentScore.getImportableScore(
						req.currentUser.id,
						visit.draft_content_id,
						visit.is_preview
					)
					.then(importableScore => {
						if(importableScore){
							extensions.push({
								name: NODE_NAME,
								importableScore: {
									highestScore: importableScore.score,
									assessmentDate: importableScore.createdAt,
									assessmentId: importableScore.assessmentId,
									attemptId: importableScore.attemptId,
									assessmentScoreId: importableScore.id
								}
							})
						}
					})
				}
			})
	}
}

module.exports = Assessment
