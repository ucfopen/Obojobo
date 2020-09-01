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
		const { attemptReview } = require('./attempt-review')

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

		return global.flushPromises().then(() => {
			expect(DraftModel.mockGetChildNodeById).toHaveBeenCalledTimes(0)
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(0)
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(0)
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(0)
			expect(logger.error).toHaveBeenCalledTimes(0)
			expect(questionModels).toMatchInlineSnapshot(`Object {}`)
		})
	})

	test('attemptReview for 2 attempts with review = always', async () => {
		const { attemptReview } = require('./attempt-review')

		AssessmentModel.fetchAttemptById.mockReturnValue({
			draftId: 'mock-draft-id',
			assessmentId: 'mock-assessment-id',
			draftContentId: 'mock-content-id',
			state: {
				chosen: [{ id: 'mock-chosen-id' }]
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

		return global
			.flushPromises()
			.then(global.flushPromises)
			.then(() => {
				expect(DraftModel.mockGetChildNodeById).toHaveBeenCalledTimes(2)
				expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(1) // uses cache!
				// only called when review !== always
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
		const { attemptReview } = require('./attempt-review')

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

		return global.flushPromises().then(() => {
			expect(DraftModel.mockGetChildNodeById).toHaveBeenCalledTimes(1)
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(1)
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(0)
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

	test('attemptReview with review=no-attempts-remaining removes scores when all attempts not used', async () => {
		// setup
		const { attemptReview } = require('./attempt-review')

		DraftModel.mockGetChildNodeById.mockReturnValue({
			node: {
				content: {
					review: 'no-attempts-remaining',
					attempts: '2'
				}
			}
		})

		util.getFullQuestionsFromDraftTree.mockReturnValue([
			{
				id: 'mockId'
			}
		])

		AssessmentModel.fetchAttemptById.mockResolvedValueOnce({
			draftId: 'mockDID',
			draftContentId: 'mockDCID',
			userId: 'mockUID',
			assessmentId: 'mockAID',
			isPreview: false,
			resourceLinkId: 'mockRLID',
			state: {
				chosen: 'mockChosen'
			}
		})

		AssessmentModel.getCompletedAssessmentAttemptHistory.mockReturnValue([
			{ result: { attemptScore: 100 } }
		])

		attemptStart.getSendToClientPromises.mockReturnValue([Promise.resolve()])

		// execute
		await attemptReview([1])

		// assert
		return global.flushPromises().then(() => {
			// this getting called indicates that the question score info is being removed!
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(1)
			// just to make sure we get past getSendToClientPromises
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(1)
		})
	})

	test('attemptReview with review=no-attempts-remaining reveals scores when all attempts ARE used', async () => {
		// setup
		const { attemptReview } = require('./attempt-review')

		DraftModel.mockGetChildNodeById.mockReturnValue({
			node: {
				content: {
					review: 'no-attempts-remaining',
					attempts: '2'
				}
			}
		})

		util.getFullQuestionsFromDraftTree.mockReturnValue([
			{
				id: 'mockId'
			}
		])

		AssessmentModel.fetchAttemptById.mockResolvedValueOnce({
			draftId: 'mockDID',
			draftContentId: 'mockDCID',
			userId: 'mockUID',
			assessmentId: 'mockAID',
			isPreview: false,
			resourceLinkId: 'mockRLID',
			state: {
				chosen: 'mockChosen'
			}
		})

		AssessmentModel.getCompletedAssessmentAttemptHistory.mockReturnValue([
			{ result: { attemptScore: 100 } },
			{ result: { attemptScore: 20 } }
		])

		attemptStart.getSendToClientPromises.mockReturnValue([Promise.resolve()])

		// execute
		await attemptReview([1])

		// assert
		return global.flushPromises().then(() => {
			// this getting called indicates that the question score info is being removed!
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(0)
			// just to make sure we get past getSendToClientPromises
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(1)
		})
	})

	test('attemptReview with review=never hides scores when all attempts ARE used', async () => {
		// setup
		const { attemptReview } = require('./attempt-review')

		DraftModel.mockGetChildNodeById.mockReturnValue({
			node: {
				content: {
					review: 'never',
					attempts: '2'
				}
			}
		})

		util.getFullQuestionsFromDraftTree.mockReturnValue([
			{
				id: 'mockId'
			}
		])

		AssessmentModel.fetchAttemptById.mockResolvedValueOnce({
			draftId: 'mockDID',
			draftContentId: 'mockDCID',
			userId: 'mockUID',
			assessmentId: 'mockAID',
			isPreview: false,
			resourceLinkId: 'mockRLID',
			state: {
				chosen: 'mockChosen'
			}
		})

		AssessmentModel.getCompletedAssessmentAttemptHistory.mockReturnValue([
			{ result: { attemptScore: 100 } },
			{ result: { attemptScore: 100 } }
		])

		attemptStart.getSendToClientPromises.mockReturnValue([Promise.resolve()])

		// execute
		await attemptReview([1])

		// assert
		return global.flushPromises().then(() => {
			// this getting called indicates that the question score info is being removed!
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(1)
			// just to make sure we get past getSendToClientPromises
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(1)
		})
	})

	test('attemptReview logs errors', async () => {
		const { attemptReview } = require('./attempt-review')

		DraftModel.fetchDraftByVersion.mockRejectedValueOnce('mockError')
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
		attemptStart.getSendToClientPromises.mockReturnValueOnce([Promise.resolve()])

		const questionModels = await attemptReview([1])

		return global.flushPromises().then(() => {
			expect(DraftModel.mockGetChildNodeById).toHaveBeenCalledTimes(0)
			expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(1)
			expect(attemptStart.getSendToClientPromises).toHaveBeenCalledTimes(0)
			expect(util.getFullQuestionsFromDraftTree).toHaveBeenCalledTimes(0)
			expect(logger.error).toHaveBeenCalledTimes(2)
			expect(questionModels).toBe(undefined) //eslint-disable-line no-undefined
		})
	})

	test('memoGetDraftByVersion caches subsequent calls', async () => {
		const { memoGetDraftByVersion } = require('./attempt-review')

		const fn = memoGetDraftByVersion()

		const result = await fn('mockDID', 'mockDCID')
		const result2 = await fn('mockDID', 'mockDCID') // should come from cache

		expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(1)
		expect(result).toBeInstanceOf(DraftModel)
		expect(result2).toBeInstanceOf(DraftModel)
		expect(result).toBe(result2)
	})

	test('memoGetDraftByVersion calls subsequent calls with different arguments', async () => {
		const { memoGetDraftByVersion } = require('./attempt-review')

		const fn = memoGetDraftByVersion()

		const result = await fn('mockDID', 'mockDCID')
		const result2 = await fn('mockDID2', 'mockDCID2') // should come from cache

		expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(2)
		expect(result).toBeInstanceOf(DraftModel)
		expect(result2).toBeInstanceOf(DraftModel)
		expect(result).not.toBe(result2)
	})

	test('memoGetDraftByVersion cache is isolated per memoized function', async () => {
		const { memoGetDraftByVersion } = require('./attempt-review')

		const fn = memoGetDraftByVersion()
		const result = await fn('mockDID', 'mockDCID')
		const result2 = await fn('mockDID', 'mockDCID')

		const fn2 = memoGetDraftByVersion()
		const altResult = await fn2('mockDID', 'mockDCID')
		const altResult2 = await fn2('mockDID', 'mockDCID')

		// each memoized function should call this once
		expect(DraftModel.fetchDraftByVersion).toHaveBeenCalledTimes(2)
		// everything should be a DraftModel
		expect(result).toBeInstanceOf(DraftModel)
		expect(result2).toBeInstanceOf(DraftModel)
		expect(altResult).toBeInstanceOf(DraftModel)
		expect(altResult2).toBeInstanceOf(DraftModel)

		// each function should return the same object
		expect(result).toBe(result2)
		expect(altResult).toBe(altResult2)

		// none of the objects returned from fn should match fn2
		expect(result).not.toBe(altResult)
		expect(result).not.toBe(altResult2)
		expect(result2).not.toBe(altResult)
		expect(result2).not.toBe(altResult2)
	})

	test('memoGetCompletedAttemptsCount caches subsequent calls', async () => {
		AssessmentModel.getCompletedAssessmentAttemptHistory.mockReturnValue([
			{ result: { attemptScore: 100 } }
		])

		const { memoGetCompletedAttemptsCount } = require('./attempt-review')

		const fn = memoGetCompletedAttemptsCount()

		const result = await fn(
			'mock_userId',
			'mock_draftId',
			'mock_assessmentId',
			'mock_isPreview',
			'mock_resourceLinkId'
		)
		const result2 = await fn(
			'mock_userId',
			'mock_draftId',
			'mock_assessmentId',
			'mock_isPreview',
			'mock_resourceLinkId'
		) // should come from cache

		expect(AssessmentModel.getCompletedAssessmentAttemptHistory).toHaveBeenCalledTimes(1)
		expect(result).toBe(1)
		expect(result2).toBe(1)
	})

	test('memoGetCompletedAttemptsCount loads subsequent calls with different arguments', async () => {
		AssessmentModel.getCompletedAssessmentAttemptHistory
			.mockReturnValueOnce([
				// used on first call
				{ result: { attemptScore: 100 } }
			])
			.mockReturnValueOnce([
				// used on second with different args
				{ result: { attemptScore: 100 } },
				{ result: { attemptScore: 100 } }
			])

		const { memoGetCompletedAttemptsCount } = require('./attempt-review')

		const fn = memoGetCompletedAttemptsCount()

		const result = await fn(
			'mock_userId',
			'mock_draftId',
			'mock_assessmentId',
			'mock_isPreview',
			'mock_resourceLinkId'
		)
		// call with a different draftId
		const result2 = await fn(
			'mock_userId',
			'mock_draftId2',
			'mock_assessmentId',
			'mock_isPreview',
			'mock_resourceLinkId'
		)

		expect(AssessmentModel.getCompletedAssessmentAttemptHistory).toHaveBeenCalledTimes(2)
		expect(result).toBe(1)
		expect(result2).toBe(2)
	})

	test('memoGetCompletedAttemptsCount handles empty results', async () => {
		AssessmentModel.getCompletedAssessmentAttemptHistory.mockReturnValue([
			{ result: null }, // empty - ignored
			{ result: { attemptScore: 100 } } // counted
		])

		const { memoGetCompletedAttemptsCount } = require('./attempt-review')

		const fn = memoGetCompletedAttemptsCount()

		const result = await fn(
			'mock_userId',
			'mock_draftId',
			'mock_assessmentId',
			'mock_isPreview',
			'mock_resourceLinkId'
		)

		expect(AssessmentModel.getCompletedAssessmentAttemptHistory).toHaveBeenCalledTimes(1)
		expect(result).toBe(1)
	})
})
