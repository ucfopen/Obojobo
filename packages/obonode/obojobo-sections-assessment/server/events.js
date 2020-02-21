const oboEvents = require('obojobo-express/server/obo_events')
const config = require('obojobo-express/server/config')
const Visit = require('obojobo-express/server/models/visit')
const logger = require('obojobo-express/server/logger')
const db = require('obojobo-express/server/db')
const eventRecordResponse = 'client:question:setResponse'

const paramToBool = param => {
	return param && (param === true || param === 'true' || param === 1 || param === '1')
}

// Store question responces
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

// when a new draft is created make sure we create an ownership association
oboEvents.on(Visit.EVENT_BEFORE_NEW_VISIT, ({ req }) => {
	const scoreImport =
		req.body.score_import || req.params.score_import || config.general.allowImportDefault

	req.visitOptions = req.visitOptions ? req.visitOptions : {}
	req.visitOptions.isScoreImportable = paramToBool(scoreImport)
})
