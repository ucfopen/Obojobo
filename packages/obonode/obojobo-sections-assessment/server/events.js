const oboEvents = require('obojobo-express/obo_events')
const logger = require('obojobo-express/logger')
const db = require('obojobo-express/db')
const eventRecordResponse = 'client:question:setResponse'

oboEvents.on(eventRecordResponse, async (event, req) => {
	try {
		if (!event.payload.attemptId) return // assume we're in practice
		if (!event.payload.assessmentId) throw Error('Missing Assessment Id')
		if (!event.payload.questionId) throw Error('Missing Question ID')
		if (!event.payload.response) throw Error('Missing Response')

		await db.none(
			`
		INSERT INTO attempts_question_responses
		(attempt_id, question_id, response, assessment_id)
		VALUES($[attemptId], $[questionId], $[response], $[assessmentId])
		ON CONFLICT (attempt_id, question_id) DO
			UPDATE
			SET
				response = $[response],
				updated_at = now()
			WHERE attempts_question_responses.attempt_id = $[attemptId]
				AND attempts_question_responses.question_id = $[questionId]`,
			{
				assessmentId: event.payload.assessmentId,
				attemptId: event.payload.attemptId,
				questionId: event.payload.questionId,
				response: event.payload.response
			}
		)
	} catch (error) {
		logger.error(eventRecordResponse, req, event, error, error.toString())
	}
})
