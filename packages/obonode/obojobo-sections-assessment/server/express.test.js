jest.mock('./models/assessment')
jest.mock('obojobo-express/server/lti')
jest.mock('./attempt-start')
jest.mock('./attempt-resume')
jest.mock('./attempt-end/attempt-end')
jest.mock('./attempt-review')
jest.mock('obojobo-express/server/express_validators')
jest.mock('./events')

const mockCurrentUser = { id: 'mockCurrentUserId' }
const mockCurrentDocument = { draftId: 'mockDraftId' }
const mockCurrentVisit = { resource_link_id: 'mockResourceLinkId', is_preview: 'mockIsPreview' }
const bodyParser = require('body-parser')
const request = require('supertest')
const reviewAttempt = require('./attempt-review')
const AssessmentModel = require('./models/assessment')
const { startAttempt } = require('./attempt-start')
const resumeAttempt = require('./attempt-resume')
const endAttempt = require('./attempt-end/attempt-end')
const lti = require('obojobo-express/server/lti')
const {
	requireCurrentDocument,
	requireCurrentVisit,
	requireAttemptId,
	requireCurrentUser,
	requireAssessmentId
} = require('obojobo-express/server/express_validators')
const assessmentExpress = require('./express')
const express_response_decorator = require('obojobo-express/server/express_response_decorator')
const express = require('express')
let app

describe('server/express', () => {
	beforeEach(() => {
		jest.resetAllMocks()

		// mock all the validators
		requireCurrentDocument.mockImplementation((req, res, next) => {
			req.currentDocument = mockCurrentDocument
			next()
		})

		requireCurrentVisit.mockImplementation((req, res, next) => {
			req.currentVisit = mockCurrentVisit
			next()
		})

		requireCurrentUser.mockImplementation((req, res, next) => {
			req.currentUser = mockCurrentUser
			next()
		})

		requireAssessmentId.mockImplementation((req, res, next) => {
			next()
		})

		requireAttemptId.mockImplementation((req, res, next) => {
			next()
		})

		// init the server
		app = express()
		app.use(bodyParser.json())
		app.use(express_response_decorator)
		app.use(assessmentExpress)
	})

	test('POST /api/lti/send-assessment-score', () => {
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
			.post('/api/lti/send-assessment-score')
			.type('application/json')
			.send('{"assessmentId":"mockAssessmentId"}')
			.then(response => {
				expect(response.statusCode).toBe(200)
				// verify validations ran
				expect(requireCurrentDocument).toHaveBeenCalledTimes(1)
				expect(requireCurrentVisit).toHaveBeenCalledTimes(1)
				expect(requireCurrentUser).toHaveBeenCalledTimes(1)
				expect(requireAssessmentId).toHaveBeenCalledTimes(1)
				// verify external libs were called with correct args
				expect(lti.sendHighestAssessmentScore).toHaveBeenCalledWith(
					mockCurrentUser.id,
					mockCurrentDocument,
					'mockAssessmentId',
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

	test('POST /api/lti/send-assessment-score logs errors', () => {
		expect.hasAssertions()
		lti.sendHighestAssessmentScore.mockRejectedValueOnce('mock-error')

		return request(app)
			.post('/api/lti/send-assessment-score')
			.type('application/json')
			.send('{"assessmentId":"mockAssessmentId"}')
			.then(response => {
				expect(response.statusCode).toBe(500)
				expect(response.body).toEqual({
					status: 'error',
					value: {
						message: expect.any(String),
						type: 'unexpected'
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
				expect(requireCurrentDocument).toHaveBeenCalledTimes(1)
				expect(requireCurrentVisit).toHaveBeenCalledTimes(1)
				expect(requireCurrentUser).toHaveBeenCalledTimes(1)
				expect(requireAssessmentId).toHaveBeenCalledTimes(1)

				expect(startAttempt).toHaveBeenCalledTimes(1)
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('POST /api/assessments/attempt/mock-attempt-id/resume', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		resumeAttempt.mockReturnValueOnce(mockReturnValue)

		return request(app)
			.post('/api/assessments/attempt/mock-attempt-id/resume')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				// verify validations ran
				expect(requireCurrentVisit).toHaveBeenCalledTimes(1)
				expect(requireCurrentUser).toHaveBeenCalledTimes(1)
				expect(requireCurrentDocument).toHaveBeenCalledTimes(1)
				expect(requireAttemptId).toHaveBeenCalledTimes(1)
				expect(resumeAttempt).toHaveBeenCalledWith(
					mockCurrentUser,
					mockCurrentVisit,
					mockCurrentDocument,
					'mock-attempt-id',
					expect.any(String),
					expect.any(String)
				)
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('POST /api/assessments/attempt/mock-attempt-id/resume errors', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		resumeAttempt.mockRejectedValueOnce(mockReturnValue)

		return request(app)
			.post('/api/assessments/attempt/mock-attempt-id/resume')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(500)
				expect(response.body).toEqual({
					status: 'error',
					value: {
						message: expect.any(String),
						type: 'unexpected'
					}
				})
			})
	})

	test('POST /api/assessments/attempt/mock-attempt-id/resume', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		requireAttemptId.mockImplementationOnce((req, res, next) => {
			return Promise.resolve().then(() => {
				res.success(mockReturnValue)
			})
		})

		return request(app)
			.post('/api/assessments/attempt/mock-attempt-id/resume')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireAttemptId).toHaveBeenCalledTimes(1)
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
				expect(requireCurrentVisit).toHaveBeenCalledTimes(1)
				expect(requireCurrentUser).toHaveBeenCalledTimes(1)
				expect(requireCurrentDocument).toHaveBeenCalledTimes(1)
				expect(requireAttemptId).toHaveBeenCalledTimes(1)
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('POST /api/assessments/attempt/mock-attempt-id/end fails', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		endAttempt.mockRejectedValueOnce(mockReturnValue)

		return request(app)
			.post('/api/assessments/attempt/mock-attempt-id/end')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(500)
				expect(response.body).toEqual({
					status: 'error',
					value: {
						message: expect.any(String),
						type: 'unexpected'
					}
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
				expect(requireCurrentVisit).toHaveBeenCalledTimes(1)
				expect(requireCurrentUser).toHaveBeenCalledTimes(1)
				expect(requireCurrentDocument).toHaveBeenCalledTimes(1)
				expect(requireAttemptId).toHaveBeenCalledTimes(1)
				expect(response.body).toEqual({
					status: 'ok',
					value: mockReturnValue
				})
			})
	})

	test('POST /api/assessments/attempt/review', () => {
		expect.hasAssertions()
		const returnValue = {}
		reviewAttempt.mockResolvedValueOnce(returnValue)

		return request(app)
			.post('/api/assessments/attempt/review')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireCurrentUser).toHaveBeenCalledTimes(1)
				expect(requireAttemptId).toHaveBeenCalledTimes(1)
				expect(response.body).toEqual(returnValue)
			})
	})

	test('POST /api/assessments/clear-preview-scores', () => {
		expect.hasAssertions()
		AssessmentModel.deletePreviewAttemptsAndScores.mockResolvedValueOnce()

		return request(app)
			.post('/api/assessments/clear-preview-scores')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireCurrentVisit).toHaveBeenCalledTimes(1)
				expect(requireCurrentUser).toHaveBeenCalledTimes(1)
				expect(requireCurrentDocument).toHaveBeenCalledTimes(1)
				expect(AssessmentModel.deletePreviewAttemptsAndScores).toHaveBeenCalledTimes(1)
				expect(AssessmentModel.deletePreviewAttemptsAndScores).toHaveBeenCalledWith(
					'mockCurrentUserId',
					'mockDraftId',
					'mockResourceLinkId'
				)
				expect(response.body).toEqual({
					status: 'ok'
				})
			})
	})

	test('POST /api/assessments/clear-preview-scores fails when not preview', () => {
		expect.hasAssertions()
		requireCurrentVisit.mockImplementationOnce((req, res, next) => {
			req.currentVisit = { is_preview: false }
			next()
		})

		return request(app)
			.post('/api/assessments/clear-preview-scores')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(401)
				expect(response.body).toEqual({
					status: 'error',
					value: {
						message: 'Not in preview mode',
						type: 'notAuthorized'
					}
				})
			})
	})

	test('POST /api/assessments/clear-preview-scores fails on errors', () => {
		expect.hasAssertions()
		AssessmentModel.deletePreviewAttemptsAndScores.mockRejectedValueOnce('mock-error')

		return request(app)
			.post('/api/assessments/clear-preview-scores')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(500)
				expect(response.body).toEqual({
					status: 'error',
					value: {
						message: expect.any(String),
						type: 'unexpected'
					}
				})
			})
	})

	test('GET /api/assessments/:draftId/attempts', () => {
		expect.hasAssertions()
		const mockReturnValue = {}
		AssessmentModel.fetchAttemptHistory.mockResolvedValueOnce(mockReturnValue)

		return request(app)
			.get('/api/assessments/:draftId/attempts')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(200)
				expect(requireCurrentUser).toHaveBeenCalledTimes(1)
				expect(requireCurrentDocument).toHaveBeenCalledTimes(1)
				expect(requireCurrentVisit).toHaveBeenCalledTimes(1)
				expect(AssessmentModel.fetchAttemptHistory).toHaveBeenCalledWith(
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

	test('GET /api/assessments/:draftId/attempts fails', () => {
		expect.hasAssertions()
		AssessmentModel.fetchAttemptHistory.mockRejectedValueOnce()

		return request(app)
			.get('/api/assessments/:draftId/attempts')
			.type('application/json')
			.then(response => {
				expect(response.statusCode).toBe(500)
				expect(response.body).toEqual({
					status: 'error',
					value: {
						message: expect.any(String),
						type: 'unexpected'
					}
				})
			})
	})

})
