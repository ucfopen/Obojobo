jest.mock('../../../../db')
const db = oboRequire('db')
const DraftModel = oboRequire('models/draft')

describe('api draft update helper', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('calls db.one with expected args', () => {
		expect.assertions(2)

		const id = 555
		const jsonContent = 'mockJsonContent'
		const xmlContent = 'mockXmlContent'

		db.one.mockResolvedValueOnce({ id })

		return DraftModel.updateContent(id, jsonContent, xmlContent)
			.then(resultId => {
				expect(resultId).toBe(id)
				expect(db.one).toBeCalledWith(
					expect.any(String),
					expect.objectContaining({
						draftId: id,
						jsonContent: jsonContent,
						xmlContent: xmlContent
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

		return DraftModel.updateContent(555, 'content')
			.then(id => {
				expect(id).toBe('never called')
			})
			.catch(err => {
				expect(err).toBe('test error')
			})
	})
})
