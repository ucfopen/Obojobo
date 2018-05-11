jest.mock('../../../../db')

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
		let db = oboRequire('db')
		// mock insert draft
		db.one.mockResolvedValueOnce({ id: 'NEWID' })
		// respond to insert content
		db.one.mockResolvedValueOnce('content')

		let updateDraft = oboRequire('routes/api/drafts/insert_new_draft')

		return updateDraft(555, { content: 'yes' }).then(newDraft => {
			expect(db.tx).toBeCalled()
			expect(newDraft).toEqual(
				expect.objectContaining({
					content: 'content',
					id: 'NEWID'
				})
			)

			expect(db.one.mock.calls[0][1]).toEqual(
				expect.objectContaining({
					userId: 555
				})
			)

			expect(db.one.mock.calls[1][1]).toEqual(
				expect.objectContaining({
					content: {
						content: 'yes'
					},
					draftId: 'NEWID'
				})
			)
		})
	})

	test('fails when begin tranaction fails', () => {
		expect.assertions(1)
		let db = oboRequire('db')
		// respond to BEGIN & COMMIT
		db.tx.mockRejectedValueOnce('error')
		let updateDraft = oboRequire('routes/api/drafts/insert_new_draft')

		return updateDraft(555, { content: 'yes' })
			.then(result => {
				expect(result).toBe('never called')
			})
			.catch(err => {
				expect(err).toBe('error')
			})
	})

	test('fails when insert draft fails', () => {
		expect.assertions(1)
		let db = oboRequire('db')
		// respond to BEGIN & COMMIT
		db.none.mockResolvedValueOnce()
		// respond to insert draft
		db.one.mockRejectedValueOnce('an error')
		let updateDraft = oboRequire('routes/api/drafts/insert_new_draft')

		return updateDraft(555, { content: 'yes' })
			.then(result => {
				expect(result).toBe('never called')
			})
			.catch(err => {
				expect(err).toBe('an error')
			})
	})

	test('fails when insert content fails', () => {
		expect.assertions(1)
		let db = oboRequire('db')
		// respond to BEGIN & COMMIT
		db.none.mockResolvedValueOnce()
		// respond to insert draft
		db.one.mockResolvedValueOnce({ id: 'NEWID' })
		// respond to insert content
		db.one.mockRejectedValueOnce('arrrg!')

		let updateDraft = oboRequire('routes/api/drafts/insert_new_draft')

		return updateDraft(555, { content: 'yes' })
			.then(result => {
				expect(result).toBe('never called')
			})
			.catch(err => {
				expect(err).toBe('arrrg!')
			})
	})
})
