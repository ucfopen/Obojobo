const oboEvents = require('obojobo-express/server/obo_events')
const logger = require('obojobo-express/server/logger')
const db = require('obojobo-express/server/db')
const assessment = require('./assessment')
const eventRecordResponse = 'client:question:setResponse'

oboEvents.on(eventRecordResponse, async (event, req) => {
	try {
		if (!event.payload.attemptId) return // assume we're in practice
		if (!event.payload.assessmentId) throw Error('Missing Assessment Id')
		if (!event.payload.questionId) throw Error('Missing Question Id')
		if (!event.payload.response) throw Error('Missing Response')

		const attemptData = await assessment.getAttempt(event.payload.attemptId)

		if (!attemptData) {
			throw Error('Invalid Attempt Id')
		}

		if (attemptData.completed_at !== null) {
			throw Error('Attempt is closed')
		}

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
