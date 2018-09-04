jest.mock('../../../../db')
const DraftModel = oboRequire('models/draft')
const db = oboRequire('db')

describe('api draft insert helper', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		let db = oboRequire('db')
		db.one.mockClear()
		db.none.mockClear()
		db.any.mockClear()
	})
	afterEach(() => {})

	test('inserts a new draft', () => {
		expect.assertions(4)
		// mock insert draft
		db.one.mockResolvedValueOnce({ id: 'NEWID' })
		// respond to insert content
		db.one.mockResolvedValueOnce('inserted content result')
		const mockContent = { content: 'yes' }
		const mockXMLContent = '<?xml version="1.0" encoding="utf-8"?><ObojoboDraftDoc />'
		const mockUserId = 555

		return DraftModel.createWithContent(mockUserId, mockContent, mockXMLContent).then(newDraft => {
			// make sure we're using a transaction
			expect(db.tx).toBeCalled()

			// make sure the result looks as expected
			expect(newDraft).toEqual({
				content: 'inserted content result',
				id: 'NEWID'
			})

			// make sure mockUserID is sent to the insert draft query
			expect(db.one.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					userId: mockUserId
				})
			)

			// make sure the id coming back from insert draft is used to insert content
			// and make sure the content is sent to the query
			expect(db.one.mock.calls[1][1]).toEqual({
				jsonContent: mockContent,
				xmlContent: mockXMLContent,
				draftId: 'NEWID'
			})
		})
	})

	test('fails when begin tranaction fails', () => {
		expect.assertions(1)

		// reject transaction
		db.tx.mockRejectedValueOnce('error')

		return expect(DraftModel.createWithContent(0, 'whatever')).rejects.toThrow('error')
	})

	test('fails when insert draft fails', () => {
		expect.assertions(1)

		// reject insert draft query
		db.one.mockRejectedValueOnce('an error')

		return expect(DraftModel.createWithContent(0, 'whatever')).rejects.toThrow('an error')
	})

	test('fails when insert content fails', () => {
		expect.assertions(1)

		// respond to insert draft
		db.one.mockResolvedValueOnce({ id: 'NEWID' })
		// reject insert content query
		db.one.mockRejectedValueOnce('arrrg!')

		return expect(DraftModel.createWithContent(0, 'whatever')).rejects.toThrow('arrrg!')
	})
})
