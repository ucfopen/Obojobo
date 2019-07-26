// Global for loading specialized Obojobo stuff
// use oboRequire('models/draft') to load draft models from any context
global.oboRequire = name => {
	return require(`obojobo-express/${name}`)
}

jest.setMock('obojobo-express/logger', require('obojobo-express/__mocks__/logger'))
jest.setMock('obojobo-express/db', require('obojobo-express/__mocks__/db'))
jest.mock('obojobo-express/obo_events')
jest.mock('obojobo-express/db')
jest.mock('./assessment')
jest.mock('obojobo-express/lti')
jest.mock('obojobo-express/logger')
jest.mock('./attempt-start')
jest.mock('./attempt-resume')
jest.mock('./attempt-end/attempt-end')
jest.mock('./attempt-review')
jest.mock('./util')
jest.mock('obojobo-express/express_validators')

describe('server/express', () => {
	const mockCurrentUser = { id: 'mockCurrentUserId' }
	const mockCurrentDocument = {draftId: 'mockDraftId'}
	const mockCurrentVisit = {resource_link_id: 'mockResourceLinkId', is_preview: 'mockIsPreview'}
	const bodyParser = require('body-parser')
	const request = require('supertest')
	let db
	let logger
	let Assessment
	let startAttempt
	let resumeAttempt
	let endAttempt
	let lti
	let checkValidationRules
	let requireCurrentDocument
	let requireCurrentVisit
	let requireAttemptId
	let requireCurrentUser
	let requireAssessmentId
	let oboEvents
	let app

	// this function makes a method that works like middleware
	// optionally sets a variable on res
	// optionally returns a value
	const mockMiddleware = (fn, {resVarName, resVarObject, returnResult} = {}) => {
		return fn.mockImplementation((req, res, next) => {
			if(resVarName) req[resVarName] = resVarObject
			next()
			if(returnResult) return returnResult
		})
	}

	beforeEach(() => {
		// reset!
		jest.resetModules()
		jest.restoreAllMocks()
		jest.clearAllMocks()

		db = jest.requireMock('obojobo-express/db')
		logger = jest.requireMock('obojobo-express/logger')
		Assessment = jest.requireMock('./assessment')
		startAttempt = jest.requireMock('./attempt-start').startAttempt
		resumeAttempt = jest.requireMock('./attempt-resume')
		endAttempt = jest.requireMock('./attempt-end/attempt-end')
		lti = jest.requireMock('obojobo-express/lti')
		let f = jest.requireMock('obojobo-express/express_validators')

		mockMiddleware(startAttempt)
		checkValidationRules = mockMiddleware(f.checkValidationRules)
		requireCurrentDocument = mockMiddleware(f.requireCurrentDocument, {resVarName:'currentDocument', resVarObject: mockCurrentDocument})
		requireCurrentVisit = mockMiddleware(f.requireCurrentVisit, {resVarName:'currentVisit', resVarObject: mockCurrentVisit})
		requireAttemptId = mockMiddleware(f.requireAttemptId)
		requireCurrentUser = mockMiddleware(f.requireCurrentUser, {resVarName: 'currentUser', resVarObject: mockCurrentUser})
		requireAssessmentId = mockMiddleware(f.requireAssessmentId)
		oboEvents = jest.requireMock('obojobo-express/obo_events')
		// re-init the server
		app = require('express')()
		app.use(bodyParser.json())
		app.use(bodyParser.text())
		app.use(require('obojobo-express/express_response_decorator'))
		app.use(require('./express'))
	})


	test('GET /api/lti/state/draft/mock-draft-id', () => {
		expect.hasAssertions()
		const mockReturnValue = { mockReturn: 'mockReturn'}
		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce(mockReturnValue)

		return request(app)
			.get('/api/lti/state/draft/mock-draft-id')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireCurrentDocument).toHaveBeenCalled()
				expect(requireCurrentVisit).toHaveBeenCalled()
				expect(requireCurrentUser).toHaveBeenCalled()
				expect(lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId)
					.toHaveBeenCalledWith(
						mockCurrentUser.id,
						mockCurrentDocument.draftId,
						mockCurrentVisit.resource_link_id
					)
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})


	test('POST /api/lti/sendAssessmentScore', () => {
		expect.hasAssertions()
		const mockReturnValue = {
			scoreSent: 'mockReturn',
			status: 'mockStatus',
			statusDetails: 'mockStatusDetails',
			dbStatus: 'mockDbStatus',
			gradebookStatus: 'mockGradeBookStatus'
		}
		lti.sendHighestAssessmentScore.mockResolvedValueOnce(mockReturnValue)

		return request(app)
			.post('/api/lti/sendAssessmentScore')
			.type('application/json')
			.send('{"assessmentId":"mockAssessmentId"}')
			.then(response => {
				expect(response.statusCode).toBe(200)
				// verify validations ran
				expect(requireCurrentDocument).toHaveBeenCalled()
				expect(requireCurrentVisit).toHaveBeenCalled()
				expect(requireCurrentUser).toHaveBeenCalled()
				expect(requireAssessmentId).toHaveBeenCalled()
				// verify external libs were called with correct args
				expect(lti.sendHighestAssessmentScore)
					.toHaveBeenCalledWith(
						mockCurrentUser.id,
						mockCurrentDocument,
						"mockAssessmentId",
						mockCurrentVisit.is_preview,
						mockCurrentVisit.resource_link_id
					)
				// verify the response body
				expect(response.body).toEqual({
					status: 'ok',
					value: {
						score: mockReturnValue.scoreSent,
						status: mockReturnValue.status,
						statusDetails: mockReturnValue.statusDetails,
						dbStatus: mockReturnValue.dbStatus,
						gradebookStatus: mockReturnValue.gradebookStatus

					}
				})
			})
	})

	test('POST /api/assessments/attempt/start', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		startAttempt.mockImplementationOnce((req, res, next) => {
			res.success(mockReturnValue)
		})

		return request(app)
			.post('/api/assessments/attempt/start')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				// verify validations ran
				expect(requireCurrentDocument).toHaveBeenCalled()
				expect(requireCurrentVisit).toHaveBeenCalled()
				expect(requireCurrentUser).toHaveBeenCalled()
				expect(requireAssessmentId).toHaveBeenCalled()

				expect(startAttempt).toHaveBeenCalled()
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('POST /api/assessments/attempt/mock-attempt-id/resume', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		requireAttemptId.mockImplementationOnce((req, res, next) => {
			return Promise.resolve()
				.then(() => {
					res.success(mockReturnValue)
				})
		})

		return request(app)
			.post('/api/assessments/attempt/mock-attempt-id/resume')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireAttemptId).toHaveBeenCalled()
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('POST /api/assessments/attempt/mock-attempt-id/end', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		endAttempt.mockResolvedValueOnce(mockReturnValue)

		return request(app)
			.post('/api/assessments/attempt/mock-attempt-id/end')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireCurrentVisit).toHaveBeenCalled()
				expect(requireCurrentUser).toHaveBeenCalled()
				expect(requireCurrentDocument).toHaveBeenCalled()
				expect(requireAttemptId).toHaveBeenCalled()
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('POST /api/assessments/clear-preview-scores', () => {
		expect.hasAssertions()
		db.manyOrNone
			.mockResolvedValueOnce([{id: 1}, {id: 2}])
			.mockResolvedValueOnce([{id: 99}, {id: 77}])

		return request(app)
			.post('/api/assessments/clear-preview-scores')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireCurrentVisit).toHaveBeenCalled()
				expect(requireCurrentUser).toHaveBeenCalled()
				expect(requireCurrentDocument).toHaveBeenCalled()
				expect(db.tx).toHaveBeenCalledTimes(1)
				expect(db.none).toHaveBeenCalledTimes(4)
				expect(db.batch).toHaveBeenCalledTimes(1)
				expect(response.body).toEqual({
					status: 'ok'
				})
			})
	})

	test('GET /api/assessments/:draftId/mock-assessment-id/attempt/mock-attempt-id', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		Assessment.getAttempt.mockResolvedValueOnce(mockReturnValue)

		return request(app)
			.get('/api/assessments/:draftId/mock-assessment-id/attempt/mock-attempt-id')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireCurrentUser).toHaveBeenCalled()
				expect(requireCurrentDocument).toHaveBeenCalled()
				expect(requireAssessmentId).toHaveBeenCalled()
				expect(Assessment.getAttempt).toHaveBeenCalledWith(
					mockCurrentUser.id,
					mockCurrentDocument.draftId,
					'mock-assessment-id',
					'mock-attempt-id'
				)
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('GET /api/assessments/:draftId/attempts', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		Assessment.getAttempts.mockResolvedValueOnce(mockReturnValue)

		return request(app)
			.get('/api/assessments/:draftId/attempts')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireCurrentUser).toHaveBeenCalled()
				expect(requireCurrentDocument).toHaveBeenCalled()
				expect(requireCurrentVisit).toHaveBeenCalled()
				expect(Assessment.getAttempts).toHaveBeenCalledWith(
					mockCurrentUser.id,
					mockCurrentDocument.draftId,
					mockCurrentVisit.is_preview,
					mockCurrentVisit.resource_link_id
				)
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('GET /api/assessment/:draftId/mock-assesment-id/attempts', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		Assessment.getAttempts.mockResolvedValueOnce(mockReturnValue)

		return request(app)
			.get('/api/assessment/:draftId/mock-assesment-id/attempts')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireCurrentUser).toHaveBeenCalled()
				expect(requireCurrentDocument).toHaveBeenCalled()
				expect(requireCurrentVisit).toHaveBeenCalled()
				expect(requireAssessmentId).toHaveBeenCalled()
				expect(Assessment.getAttempts).toHaveBeenCalledWith(
					mockCurrentUser.id,
					mockCurrentDocument.draftId,
					mockCurrentVisit.is_preview,
					mockCurrentVisit.resource_link_id,
					'mock-assesment-id'
				)
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('GET /api/assessment/:draftId/mock-assesment-id/attempts', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		Assessment.getAttempts.mockResolvedValueOnce(mockReturnValue)

		return request(app)
			.get('/api/assessment/:draftId/mock-assesment-id/attempts')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireCurrentUser).toHaveBeenCalled()
				expect(requireCurrentDocument).toHaveBeenCalled()
				expect(requireCurrentVisit).toHaveBeenCalled()
				expect(requireAssessmentId).toHaveBeenCalled()
				expect(Assessment.getAttempts).toHaveBeenCalledWith(
					mockCurrentUser.id,
					mockCurrentDocument.draftId,
					mockCurrentVisit.is_preview,
					mockCurrentVisit.resource_link_id,
					'mock-assesment-id'
				)
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('client:question:setResponse halts execution if no attemptId', () => {
		expect.assertions(4)

		const mockReq = {}
		const mockEvent = {
			payload: {
				questionId: 3,
				response: 'what'
			}
		}

		expect(oboEvents.on).toHaveBeenCalledTimes(1)
		expect(oboEvents.on).toHaveBeenCalledWith('client:question:setResponse', expect.any(Function))
		const internalCallback = oboEvents.on.mock.calls[0][1]

		return internalCallback(mockEvent, mockReq)
			.then(() => {
				expect(db.none).not.toHaveBeenCalled()
				expect(logger.error).not.toHaveBeenCalled()
			})
	})

	test('client:question:setResponse expects questionId', () => {
		expect.assertions(4)

		const mockReq = {}
		const mockEvent = {
			payload: {
				attemptId: 4,
				response: 'what'
			}
		}

		expect(oboEvents.on).toHaveBeenCalledTimes(1)
		expect(oboEvents.on).toHaveBeenCalledWith('client:question:setResponse', expect.any(Function))
		const internalCallback = oboEvents.on.mock.calls[0][1]

		return internalCallback(mockEvent, mockReq)
			.then(() => {
				expect(db.none).not.toHaveBeenCalled()
				expect(logger.error.mock.calls[0][4]).toBe('Missing Question ID')
			})

	})

	test('client:question:setResponse expects response', () => {
		expect.assertions(4)

		const mockReq = {}
		const mockEvent = {
			payload: {
				attemptId: 4,
				questionId: 3
			}
		}

		expect(oboEvents.on).toHaveBeenCalledTimes(1)
		expect(oboEvents.on).toHaveBeenCalledWith('client:question:setResponse', expect.any(Function))
		const internalCallback = oboEvents.on.mock.calls[0][1]

		return internalCallback(mockEvent, mockReq).then(() => {
			expect(db.none).not.toHaveBeenCalled()
			expect(logger.error.mock.calls[0][4]).toBe('Missing Response')
		})
	})

	test('client:question:setResponse inserts into attempts_question_responses', () => {
		expect.assertions(3)

		const mockReq = {}
		const mockEvent = {
			payload: {
				attemptId: 4,
				questionId: 3,
				response: 'what'
			}
		}

		expect(oboEvents.on).toHaveBeenCalledTimes(1)
		expect(oboEvents.on).toHaveBeenCalledWith('client:question:setResponse', expect.any(Function))
		const internalCallback = oboEvents.on.mock.calls[0][1]

		return internalCallback(mockEvent, mockReq).then(() => {
			expect(db.none).toHaveBeenCalledWith(
				expect.stringContaining('INSERT INTO attempts_question_responses'),
				expect.anything()
			)
		})
	})
})
