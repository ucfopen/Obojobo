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
				extensions.push({
					name: NODE_NAME,
					attemptHistory
				})

				// if there's no attempt history
				// find the highest importable score
				if(attemptHistory.length === 0){
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
