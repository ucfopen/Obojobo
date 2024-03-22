jest.mock('./models/assessment')

const AssessmentModel = require('./models/assessment')

const saveAttempt = require('./attempt-save.js')

describe('save attempt route', () => {
	let mockRes
	let mockReq

	beforeEach(() => {
		jest.resetAllMocks()

		mockReq = {
			body: {
				draftId: 'mockDraftId',
				draftContentId: 'mockDraftContentId',
				assessmentId: 'mockAssessmentId',
				state: {
					currentQuestion: 0,
					chosen: []
				}
			},
			params: {
				attemptId: 'mockAttemptId'
			},
			currentUser: { id: 4 }
		}

		mockRes = {
			success: jest.fn(),
			unexpected: jest.fn()
		}
	})

	test('saveAttempt calls AssessmentModel.saveAttempt, no errors', () => {
		AssessmentModel.saveAttempt.mockResolvedValueOnce(true)

		return saveAttempt(mockReq, mockRes).then(() => {
			expect(AssessmentModel.saveAttempt).toHaveBeenCalled()
			expect(mockRes.success).toHaveBeenCalled()
			expect(mockRes.unexpected).not.toHaveBeenCalled()
		})
	})

	test('saveAttempt calls AssessmentModel.saveAttempt, errors', async () => {
		AssessmentModel.saveAttempt.mockRejectedValueOnce('error')

		return await saveAttempt(mockReq, mockRes).then(() => {
			expect(AssessmentModel.saveAttempt).toHaveBeenCalled()
			expect(mockRes.success).not.toHaveBeenCalled()
			expect(mockRes.unexpected).toHaveBeenCalled()
		})
	})
})
