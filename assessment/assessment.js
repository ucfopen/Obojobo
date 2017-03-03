let AssessmentRouter = require('./router.js')
let Util = require('./util.js')

// events: [
// 	'ObojoboDraft.Sections.Assessment:startAttempt'
// ],

let registration = {
	title: 'ObojoboDraft.Sections.Assessment',
	static: {
		init: (app, db, router) => {
			let assessmentRouter = new AssessmentRouter(router, db)
			app.use('/api/assessments', assessmentRouter)
		},
		listeners: {
			'internal:getDraft': (req, res, draftTree) => {
				return
				let assessments = draftTree.findNodesWithType('ObojoboDraft.Sections.Assessment')
				for(let i in assessments)
				{
					assessments[i].children[1].children = []
				}
			},
			'client:question:recordResponse': (event, req, db) => {
				let eventRecordResponse = 'client:question:recordResponse'

				// check perms
				// check input
				if(!event.payload.attemptId)   return app.logError(eventRecordResponse, 'Missing Attempt ID', req, event)
				if(!event.payload.questionId)  return app.logError(eventRecordResponse, 'Missing Question ID', req, event)
				if(!event.payload.responderId) return app.logError(eventRecordResponse, 'Missing Responder ID', req, event)
				if(!event.payload.response)    return app.logError(eventRecordResponse, 'Missing Response', req, event)

				db
					.none(`
						INSERT INTO attempts_question_responses (attempt_id, question_id, responder_id, response)
						VALUES($1, $2, $3, $4)
						ON CONFLICT (attempt_id, question_id) DO
						UPDATE
						SET
							responder_id = $3,
							response = $4,
							updated_at = now()
						WHERE attempts_question_responses.attempt_id = $1
						AND attempts_question_responses.question_id = $2`
					, [event.payload.attemptId, event.payload.questionId, event.payload.responderId, event.payload.response])
					.catch( error => {
						app.logError(eventRecordResponse, 'DB UNEXPECTED', req, error, error.toString());
					})
			}
		}
	}
}

module.exports = registration