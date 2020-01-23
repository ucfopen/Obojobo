jest.setMock('obojobo-express/db', require('obojobo-express/__mocks__/db'))
jest.mock('obojobo-express/db')
const db = require('obojobo-express/db')
const { deletePreviewState } = require('./preview')

describe('assessment preview service', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('deletePreviewState resolves with the result of batch', () => {
		expect.hasAssertions()

		// mock transaction creation
		db.tx.mockImplementationOnce(cb => Promise.resolve(cb(db)))
		db.manyOrNone.mockResolvedValueOnce([]) // deletePreviewScores
		db.manyOrNone.mockResolvedValueOnce([]) // deletePreviewAttempts
		db.batch.mockResolvedValueOnce('mock-batch-resolve') // should be returned

		return deletePreviewState('mockUserId', 'mockDraftId', 'mockResourceLinkId').then(response => {
			expect(response).toBe('mock-batch-resolve')
		})
	})

	test('deletePreviewState runs queries in a transaction', () => {
		expect.hasAssertions()

		// mock transaction creation
		db.tx.mockImplementationOnce(cb => Promise.resolve(cb(db)))
		db.manyOrNone.mockResolvedValueOnce([]) // deletePreviewScores
		db.manyOrNone.mockResolvedValueOnce([]) // deletePreviewAttempts
		db.batch.mockResolvedValueOnce('mock-batch-resolve') // should be returned

		return deletePreviewState('mockUserId', 'mockDraftId', 'mockResourceLinkId').then(() => {
			expect(db.tx).toHaveBeenCalledTimes(1)
		})
	})

	test('deletePreviewState passes arguments to select queries', () => {
		expect.hasAssertions()

		// mock transaction creation
		db.tx.mockImplementationOnce(cb => Promise.resolve(cb(db)))
		db.manyOrNone.mockResolvedValueOnce([]) // deletePreviewScores
		db.manyOrNone.mockResolvedValueOnce([]) // deletePreviewAttempts
		db.batch.mockResolvedValueOnce('mock-batch-resolve') // should be returned

		return deletePreviewState('mockUserId', 'mockDraftId', 'mockResourceLinkId').then(() => {
			expect(db.manyOrNone).toHaveBeenCalledTimes(2)
			expect(db.manyOrNone).toHaveBeenCalledWith(
				expect.stringContaining('SELECT assessment_scores.id'),
				{
					userId: 'mockUserId',
					draftId: 'mockDraftId',
					resourceLinkId: 'mockResourceLinkId'
				}
			)
			expect(db.manyOrNone).toHaveBeenCalledWith(expect.stringContaining('SELECT id'), {
				userId: 'mockUserId',
				draftId: 'mockDraftId',
				resourceLinkId: 'mockResourceLinkId'
			})
		})
	})

	test('deletePreviewScores deletes selected ids and passes results to batch', () => {
		expect.hasAssertions()

		// mock transaction creation
		db.tx.mockImplementationOnce(cb => Promise.resolve(cb(db)))
		db.none.mockReturnValueOnce('mock-none-return-1')
		db.none.mockReturnValueOnce('mock-none-return-2')
		db.manyOrNone.mockResolvedValueOnce([{ id: 1 }, { id: 9 }]) // deletePreviewScores
		db.manyOrNone.mockResolvedValueOnce([]) // deletePreviewAttempts
		db.batch.mockResolvedValueOnce('mock-batch-resolve') // should be returned

		return deletePreviewState('mockUserId', 'mockDraftId', 'mockResourceLinkId').then(() => {
			expect(db.none).toHaveBeenCalledTimes(2)
			expect(db.none).toHaveBeenCalledWith(
				expect.stringContaining('DELETE FROM lti_assessment_scores'),
				{
					ids: [1, 9]
				}
			)
			expect(db.none).toHaveBeenCalledWith(
				expect.stringContaining('DELETE FROM assessment_scores'),
				{
					ids: [1, 9]
				}
			)
			expect(db.batch).toHaveBeenCalledWith(['mock-none-return-1', 'mock-none-return-2'])
		})
	})

	test('deletePreviewAttempts deletes selected ids and passes results to batch', () => {
		expect.hasAssertions()

		// mock transaction creation
		db.tx.mockImplementationOnce(cb => Promise.resolve(cb(db)))
		db.none.mockReturnValueOnce('mock-none-return-1')
		db.none.mockReturnValueOnce('mock-none-return-2')
		db.manyOrNone.mockResolvedValueOnce([]) // deletePreviewScores
		db.manyOrNone.mockResolvedValueOnce([{ id: 55 }, { id: 65 }]) // deletePreviewAttempts
		db.batch.mockResolvedValueOnce('mock-batch-resolve') // should be returned

		return deletePreviewState('mockUserId', 'mockDraftId', 'mockResourceLinkId').then(() => {
			expect(db.none).toHaveBeenCalledTimes(2)
			expect(db.none).toHaveBeenCalledWith(
				expect.stringContaining('DELETE FROM attempts_question_responses'),
				{
					ids: [55, 65]
				}
			)
			expect(db.none).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM attempts'), {
				ids: [55, 65]
			})
			expect(db.batch).toHaveBeenCalledWith(['mock-none-return-1', 'mock-none-return-2'])
		})
	})

	test('deletePreviewState throws errors', () => {
		expect.hasAssertions()

		// mock transaction creation
		db.tx.mockRejectedValue('mock-error')

		return expect(deletePreviewState()).rejects.toBe('mock-error')
	})
})
