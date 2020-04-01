describe('Collection Services', () => {
	jest.mock('obojobo-express/server/db')
	jest.mock('../../../server/models/collection')

	let db
	const CollectionModel = require('../../../server/models/collection')
	let CollectionServices

	const mockRawCollection = {
		id: 'whatever',
		title: 'whatever',
		user_id: 0,
		created_at: new Date().toISOString()
	}

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		CollectionServices = require('../../../server/services/collections')
	})
	afterEach(() => {})

	test('fetchAllCollectionsForDraft returns a list of collection objects', () => {
		const mockResponse = [
			{ ...mockRawCollection },
			{ ...mockRawCollection, id: 'whatever-2' },
			{ ...mockRawCollection, id: 'whatever-3' }
		]

		db.manyOrNone = jest.fn()
		db.manyOrNone.mockResolvedValueOnce(mockResponse)

		expect.hasAssertions()
		const queryString = `SELECT
			repository_collections.id,
			repository_collections.title,
			repository_collections.user_id,
			repository_collections.created_at
		FROM repository_map_drafts_to_collections
		JOIN repository_collections
			ON repository_map_drafts_to_collections.collection_id = repository_collections.id
		WHERE
			repository_collections.deleted = FALSE
			AND repository_map_drafts_to_collections.draft_id = $[draftId]
		ORDER BY repository_collections.title
		`

		CollectionServices.fetchAllCollectionsForDraft('whatever').then(response => {
			expect(db.manyOrNone).toHaveBeenCalledWith(queryString)

			expect(response[0]).toBeInstanceOf(CollectionModel)
			expect(response[0].id).toBe('whatever')
			expect(response[0].title).toBe('whatever')
			expect(response[0].userId).toBe(0)
			expect(response[0].createdAt).toBe(mockRawCollection.created_at)

			expect(response[1]).toBeInstanceOf(CollectionModel)
			expect(response[1].id).toBe('whatever-2')

			expect(response[2]).toBeInstanceOf(CollectionModel)
			expect(response[2].id).toBe('whatever-3')
		})
	})
})
