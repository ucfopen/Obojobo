jest.mock('../../db')

describe('Visit Model', () => {
	const db = oboRequire('db')
	const Visit = oboRequire('models/visit')

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('createVisit updates and inserts visit with expected values', () => {
		expect.assertions(4)

		db.oneOrNone.mockResolvedValueOnce({ deactivatedVisit: { id: 'deactivated-visit-id' } })
		db.one
			.mockResolvedValueOnce({ id: 'mocked-draft-content-id' })
			.mockResolvedValueOnce({ id: 'resulting-visit-id' })

		return Visit.createVisit('user-id', 'draft-id', 'resource-link-id', 'launch-id').then(
			result => {
				expect(db.oneOrNone.mock.calls[0][1]).toEqual({
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
					isPreview: false
				})
				expect(result).toEqual([
					{ id: 'resulting-visit-id' },
					{
						deactivatedVisit: { id: 'deactivated-visit-id' }
					}
				])
			}
		)
	})

	test('createPreviewVisit updates and inserts with expected values', () => {
		expect.assertions(4)

		db.oneOrNone.mockResolvedValueOnce({ deactivatedVisit: { id: 'deactivated-visit-id' } })
		db.one
			.mockResolvedValueOnce({ id: 'mocked-draft-content-id' })
			.mockResolvedValueOnce({ id: 'resulting-visit-id' })

		return Visit.createPreviewVisit('user-id', 'draft-id').then(result => {
			expect(db.oneOrNone.mock.calls[0][1]).toEqual({
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
				isPreview: true
			})
			expect(result).toEqual([
				{ id: 'resulting-visit-id' },
				{
					deactivatedVisit: { id: 'deactivated-visit-id' }
				}
			])
		})
	})
})
