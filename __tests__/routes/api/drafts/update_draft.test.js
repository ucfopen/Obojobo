jest.mock('../../../../db')
const db = oboRequire('db')
const updateDraft = oboRequire('routes/api/drafts/update_draft')

describe('api draft update helper', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('calls db.one with expected args', () => {
		expect.assertions(2)
		db.one.mockResolvedValueOnce({ id: 555 })

		return updateDraft(555, 'content')
			.then(id => {
				expect(id).toBe(555)
				expect(db.one).toBeCalledWith(
					expect.any(String),
					expect.objectContaining({
						draftId: 555,
						content: 'content'
					})
				)
			})
			.catch(err => {
				expect(err).toBe('never called')
			})
	})

	test('fails as expected', () => {
		expect.assertions(1)
		db.one.mockRejectedValueOnce('test error')

		return updateDraft(555, 'content')
			.then(id => {
				expect(id).toBe('never called')
			})
			.catch(err => {
				expect(err).toBe('test error')
			})
	})
})
