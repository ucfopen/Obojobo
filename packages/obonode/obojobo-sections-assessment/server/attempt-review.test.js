/* eslint no-extend-native: 0 */
jest.mock('./models/assessment')
jest.mock('./attempt-start')
jest.mock('obojobo-express/server/models/draft')
jest.mock('./util')
jest.mock('obojobo-express/server/logger')

const attemptStart = require('./attempt-start')
const DraftModel = require('obojobo-express/server/models/draft')
const AssessmentModel = require('./models/assessment')
const util = require('./util')
const logger = require('obojobo-express/server/logger')

describe('attempt review', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
	})

	test('attemptReview handles no attempt ids', async () => {
		const attemptReview = require('./attempt-review')

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
		const questionModels = await attemptReview([])

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			expect(DraftModel.mockGetChildNodeById).toHaveBeenCalledTimes(0)
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(0)
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(0)
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(0)
			expect(logger.error).toHaveBeenCalledTimes(0)
			expect(questionModels).toMatchInlineSnapshot(`Object {}`)
		})
	})

	test('attemptReview for 2 attempts with review always', async () => {
		const attemptReview = require('./attempt-review')

		AssessmentModel.fetchAttemptByID.mockReturnValueOnce({
			draftId: 'mock-draft-id',
			assessmentId: 'mock-assessment-id',
			draftContentId: 'mock-content-id',
			state: {
				chosen: [{id: 'mock-chosen-id'}]
			}
		})

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
		const questionModels = await attemptReview([1, 2])

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			expect(DraftModel.mockGetChildNodeById).toHaveBeenCalledTimes(2)
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(2)
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(0)
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

	test('attemptReview for one attempt without review always', async () => {
		const attemptReview = require('./attempt-review')

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

		const questionModels = await attemptReview([1])

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			expect(DraftModel.mockGetChildNodeById).toHaveBeenCalledTimes(1)
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(1)
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(1)
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

	test('attemptReview loggs errors', async () => {
		const attemptReview = require('./attempt-review')

		DraftModel.fetchDraftByVersion.mockRejectedValue('mockError')
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

		const questionModels = await attemptReview([1])

		// eslint-disable-next-line no-undef
		return flushPromises().then(() => {
			expect(DraftModel.mockGetChildNodeById).toHaveBeenCalledTimes(0)
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(1)
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(0)
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(0)
			expect(logger.error).toHaveBeenCalledTimes(2)
			expect(questionModels).toBe(undefined) //eslint-disable-line no-undefined
		})
	})
})
