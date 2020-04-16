/* eslint no-extend-native: 0 */
jest.mock('./assessment')
jest.mock('./attempt-start')
jest.mock('obojobo-express/server/models/draft')
jest.mock('./util')
jest.mock('obojobo-express/server/logger')

const attemptStart = require('./attempt-start')
const Assessment = require('./assessment')
const DraftModel = require('obojobo-express/server/models/draft')
const util = require('./util')
const logger = require('obojobo-express/server/logger')

describe('attempt review', () => {
	let mockAttempt
	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		mockAttempt = {
			id: 'mockAttemptId',
			number: 'mockAttemptNumber',
			user_id: 'mockUserId',
			draft_id: 'mockDraftId',
			assessment_id: 'mockAssessmentId',
			state: {
				chosen: []
			}
		}
	})

	test('reviewAttempt handles no attempt ids', async () => {
		const { reviewAttempt } = require('./attempt-review')

		DraftModel.mockGetChildNodeById.mockReturnValue({
			node: {
				content: {
					review: 'always'
				}
			}
		})
		util.getFullQuestionsFromDraftTree.mockReturnValue([
			{
				id: 'mockId'
			}
		])
		const questionModels = await reviewAttempt([])

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(0)
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(0)
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(0)
			expect(logger.error).toHaveBeenCalledTimes(0)
			expect(questionModels).toMatchInlineSnapshot(`Object {}`)
		})
	})

	test('reviewAttempt for 2 attempts with review always', async () => {
		const { reviewAttempt } = require('./attempt-review')
		DraftModel.mockGetChildNodeById.mockReturnValue({
			node: {
				content: {
					review: 'always'
				}
			}
		})
		util.getFullQuestionsFromDraftTree.mockReturnValue([
			{
				id: 'mockId'
			}
		])

		Assessment.fetchAttemptByIdAndUserId
			.mockResolvedValueOnce(mockAttempt)
			.mockResolvedValueOnce(mockAttempt)

		const questionModels = await reviewAttempt([1, 2], 10)

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(2)
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(2)
			expect(logger.error).toHaveBeenCalledTimes(0)
			expect(questionModels).toMatchInlineSnapshot(`
									Object {
									  "1": Object {
									    "mockId": Object {
									      "id": "mockId",
									    },
									  },
									  "2": Object {
									    "mockId": Object {
									      "id": "mockId",
									    },
									  },
									}
						`)
		})
	})

	test('reviewAttempt for one attempt without review always', async () => {
		const { reviewAttempt } = require('./attempt-review')
		Assessment.fetchAttemptByIdAndUserId.mockResolvedValueOnce(mockAttempt)
		DraftModel.mockGetChildNodeById.mockReturnValue({
			node: {
				content: {
					review: 'not-always'
				}
			}
		})
		util.getFullQuestionsFromDraftTree.mockReturnValue([
			{
				id: 'mockId'
			}
		])
		attemptStart.getSendToClientPromises.mockReturnValue([Promise.resolve()])

		const questionModels = await reviewAttempt([1])

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(1)
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(1)
			expect(logger.error).toHaveBeenCalledTimes(0)
			expect(questionModels).toMatchInlineSnapshot(`
			Object {
			  "1": Object {
			    "mockId": Object {
			      "id": "mockId",
			    },
			  },
			}
		`)
		})
	})

	test('reviewAttempt handles one of two fetchAttemptByIdAndUserId rejecting', async () => {
		const { reviewAttempt } = require('./attempt-review')
		Assessment.fetchAttemptByIdAndUserId
			.mockRejectedValueOnce('mock-error')
			.mockResolvedValueOnce(mockAttempt)

		DraftModel.fetchDraftByVersion.mockResolvedValueOnce({})

		DraftModel.mockGetChildNodeById.mockReturnValue({
			node: {
				content: {
					review: 'not-always'
				}
			}
		})

		util.getFullQuestionsFromDraftTree.mockReturnValue([
			{
				id: 'mockId'
			}
		])
		attemptStart.getSendToClientPromises.mockReturnValue([Promise.resolve()])

		const questionModels = await reviewAttempt([1, 2], 10)

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(1)
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(1)
			expect(logger.error).toHaveBeenCalledTimes(2)
			expect(questionModels).toEqual({
				'1': {},
				'2': {
					mockId: {
						id: 'mockId'
					}
				}
			})
		})
	})

	test('reviewAttempt handles one of two fetchAttemptByIdAndUserId returning null', async () => {
		const { reviewAttempt } = require('./attempt-review')
		Assessment.fetchAttemptByIdAndUserId
			.mockResolvedValueOnce(mockAttempt)
			.mockResolvedValueOnce(null) // mock oneOrNone not finding anything

		DraftModel.fetchDraftByVersion.mockResolvedValueOnce({})

		DraftModel.mockGetChildNodeById.mockReturnValue({
			node: {
				content: {
					review: 'not-always'
				}
			}
		})

		util.getFullQuestionsFromDraftTree.mockReturnValue([
			{
				id: 'mockId'
			}
		])
		attemptStart.getSendToClientPromises.mockReturnValue([Promise.resolve()])

		const questionModels = await reviewAttempt([1, 2], 10)

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(1)
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(1)
			expect(logger.error).toHaveBeenCalledTimes(2)
			expect(questionModels).toEqual({
				'1': {
					mockId: {
						id: 'mockId'
					}
				},
				'2': {}
			})
		})
	})
})
