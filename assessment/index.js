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
			'client:question:setResponse': (event, req, db) => {
				let eventSetResponse = 'client:question:setResponse'

				// check perms
				// check input
				if(!event.payload.attemptId)  return app.logError(eventSetResponse, 'Missing Attempt ID', req, event)
				if(!event.payload.questionId) return app.logError(eventSetResponse, 'Missing Question ID', req, event)
				if(!event.payload.response)   return app.logError(eventSetResponse, 'Missing Response', req, event)

				// insert
				db
					.none(`
						INSERT INTO attempt_question_responses (attempt_id, question_id, response)
						VALUES($1, $2, $3)
						ON CONFLICT (attempt_id, question_id) DO
						UPDATE
						SET response = $3, updated_at = now()
						WHERE attempt_question_responses.attempt_id = $1
						AND attempt_question_responses.question_id = $2`
					, [event.payload.attemptId, event.payload.questionId, event.payload.response])
					.catch( error => {
						app.logError(eventSetResponse, 'DB UNEXPECTED', req, error, error.toString());
					})
			}
		}
	}
}

module.exports = registration