jest.mock('../db')

describe('create-visit', () => {
	const db = oboRequire('db')
	const { createVisit, createPreviewVisit } = require('../create-visit')

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('createVisit updates and inserts visit with expected values', () => {
		expect.assertions(4)

		db.none.mockResolvedValueOnce({})
		db.one.mockResolvedValueOnce({ id: 'mocked-draft-content-id' })
		db.one.mockResolvedValueOnce({ id: 'resulting-visit-id' })

		return createVisit('user-id', 'draft-id', 'resource-link-id', 'launch-id').then(result => {
			expect(db.none.mock.calls[0][1]).toEqual({
				draftId: 'draft-id',
				userId: 'user-id'
			})
			expect(db.one.mock.calls[0][1]).toEqual({
				draftId: 'draft-id'
			})
			expect(db.one.mock.calls[1][1]).toEqual({
				draftId: 'draft-id',
				draftContentId: 'mocked-draft-content-id',
				userId: 'user-id',
				resourceLinkId: 'resource-link-id',
				launchId: 'launch-id',
				preview: false
			})
			expect(result).toEqual({ id: 'resulting-visit-id' })
		})
	})

	test('createPreviewVisit updates and inserts with expected values', () => {
		expect.assertions(4)

		db.none.mockResolvedValueOnce({})
		db.one.mockResolvedValueOnce({ id: 'mocked-draft-content-id' })
		db.one.mockResolvedValueOnce({ id: 'resulting-visit-id' })

		return createPreviewVisit('user-id', 'draft-id').then(result => {
			expect(db.none.mock.calls[0][1]).toEqual({
				draftId: 'draft-id',
				userId: 'user-id'
			})
			expect(db.one.mock.calls[0][1]).toEqual({
				draftId: 'draft-id'
			})
			expect(db.one.mock.calls[1][1]).toEqual({
				draftId: 'draft-id',
				draftContentId: 'mocked-draft-content-id',
				userId: 'user-id',
				resourceLinkId: null,
				launchId: null,
				preview: true
			})
			expect(result).toEqual({ id: 'resulting-visit-id' })
		})
	})
})
