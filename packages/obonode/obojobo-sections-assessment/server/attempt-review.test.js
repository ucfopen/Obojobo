/* eslint no-extend-native: 0 */
jest.mock('./assessment')
jest.mock('./attempt-start')
jest.mock('obojobo-express/models/draft')
jest.mock('./util')
jest.mock('obojobo-express/logger')

const attemptStart = require('./attempt-start')
const DraftModel = require('obojobo-express/models/draft')
const util = require('./util')
const logger = require('obojobo-express/logger')

// attemptStart.getSendToClientPromises = jest.fn(() => [])

describe('attempt review', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
	})

	test('reviewAttempt handles no attempt ids', async () => {
		const { reviewAttempt } = require('./attempt-review')

		// DraftModel.fetchDraftByVersion.mockResolvedValue()
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
			expect(DraftModel.mockGetChildNodeById).toHaveBeenCalledTimes(0)
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(0)
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(0)
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(0)
			expect(logger.error).toHaveBeenCalledTimes(0)
			expect(questionModels).toMatchInlineSnapshot(`Object {}`)
		})
	})

	test('reviewAttempt for 2 attempts with review always', async () => {
		const { reviewAttempt } = require('./attempt-review')

		// DraftModel.fetchDraftByVersion.mockResolvedValue()
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
		const questionModels = await reviewAttempt([1, 2])

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

	test('reviewAttempt for one attempt without review always', async () => {
		const { reviewAttempt } = require('./attempt-review')

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

	test('reviewAttempt loggs errors', async () => {
		const { reviewAttempt } = require('./attempt-review')

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

		const questionModels = await reviewAttempt([1])

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
