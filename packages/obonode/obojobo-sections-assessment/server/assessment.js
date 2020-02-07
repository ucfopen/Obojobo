const DraftNode = require('obojobo-express/server/models/draft_node')
const AssessmentScore = require('./models/assessment-score')
const AssessmentModel = require('./models/assessment')
const NODE_NAME = 'ObojoboDraft.Sections.Assessment'
const Visit = require('obojobo-express/server/models/visit')
const db = require('obojobo-express/server/db')
const lti = require('obojobo-express/server/lti')
const logger = require('obojobo-express/server/logger')

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

	// visitStartExtensions is an array of extensions
	// that get returned to the client
	onStartVisit(req, res, visitStartExtensions) {
		return req
			.requireCurrentUser()
			.then(() => AssessmentModel.fetchAttemptHistory(
				req.currentUser.id,
				req.currentDocument.draftId,
				req.currentVisit.is_preview,
				req.currentVisit.resource_link_id
			))
			.then(attemptHistory => {
				// @TODO: I'd be happier changing fetchAttemptHistory to return this exact object
				// IF we can create a more efficient query to get this data
				const assessmentSummary = new Map()
				attemptHistory.forEach(i => {
					// create new object for each assessment id
					if(!assessmentSummary.has(i.assessmentId)) {
						assessmentSummary.set(i.assessmentId, {
							assessmentId: i.assessmentId,
							scores: [],
							unfinishedAttemptId: null,
							importUsed: false
						})
					}

					const current = assessmentSummary.get(i.assessmentId)

					i.attempts.forEach(a => {
						current.scores.push(a.assessmentScore)
						if(a.isFinished === false) current.unfinishedAttemptId = a.id
						if(a.isImported === true) current.importUsed = true
					})
				})

				// only add extension if summary isn't empty
				if(assessmentSummary.size){
					visitStartExtensions.push({
						name: NODE_NAME,
						assessmentSummary: Array.from(assessmentSummary.values())
					})
				}

				// if there's no attempt history
				// find the highest importable score
				if(req.currentVisit.score_importable === true && attemptHistory.length === 0){
					return AssessmentScore.getImportableScore(
						req.currentUser.id,
						req.currentVisit.draft_content_id,
						req.currentVisit.is_preview
					)
					.then(importableScore => {
						if(importableScore){
							visitStartExtensions.push({
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
