jest.mock('../../../../db')

describe('api draft insert helper', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		let db = oboRequire('db')
		db.one.mockClear()
		db.none.mockClear()
	});
	afterEach(() => {});

	test('inserts a new draft', () => {
		expect.assertions(5)
		let db = oboRequire('db')
		// respond to BEGIN & COMMIT
		db.none.mockImplementation(() => {return Promise.resolve()})
		// respond to insert draft
		db.one.mockImplementationOnce(() => {return Promise.resolve({id: 'NEWID'})})
		// respond to insert content
		db.one.mockImplementationOnce(() => {return Promise.resolve('content')})

		let updateDraft = oboRequire('routes/api/drafts/insert_new_draft')

		return updateDraft(555, {content:"yes"})
		.then(newDraft => {
			expect(db.none).toBeCalledWith('BEGIN')
			expect(db.none).toBeCalledWith('COMMIT')
			expect(newDraft).toEqual(expect.objectContaining({
				content: 'content',
				id: 'NEWID'
			}))

			expect(db.one.mock.calls[0][1]).toEqual(expect.objectContaining({
				userId: 555
			}))

			expect(db.one.mock.calls[1][1]).toEqual(expect.objectContaining({
				content: {
					content: "yes"
				},
				draftId: 'NEWID'
			}))

		})
		.catch(err => {
			expect(err).toBe('never called')
		})
	})


	test('fails when begin tranaction fails', () => {
		expect.assertions(1)
		let db = oboRequire('db')
		// respond to BEGIN & COMMIT
		db.none.mockImplementation(() => {return Promise.reject('error')})

		let updateDraft = oboRequire('routes/api/drafts/insert_new_draft')

		return updateDraft(555, {content:"yes"})
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
		db.none.mockImplementation(() => {return Promise.resolve()})
		// respond to insert draft
		db.one.mockImplementationOnce(() => {return Promise.reject('an error')})

		let updateDraft = oboRequire('routes/api/drafts/insert_new_draft')

		return updateDraft(555, {content:"yes"})
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
		db.none.mockImplementation(() => {return Promise.resolve()})
		// respond to insert draft
		db.one.mockImplementationOnce(() => {return Promise.resolve({id: 'NEWID'})})
		// respond to insert content
		db.one.mockImplementationOnce(() => {return Promise.reject('arrrg!')})

		let updateDraft = oboRequire('routes/api/drafts/insert_new_draft')

		return updateDraft(555, {content:"yes"})
		.then(result => {
			expect(result).toBe('never called')
		})
		.catch(err => {
			expect(err).toBe('arrrg!')
		})
	})

})
