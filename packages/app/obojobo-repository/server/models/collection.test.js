describe('Collection Model', () => {
	jest.mock('obojobo-express/server/db')
	jest.mock('obojobo-express/server/logger')
	jest.mock('./draft_summary')
	let db
	let logger
	let CollectionModel

	const mockRawCollection = {
		id: 'mockCollectionId',
		title: 'mockCollectionTitle',
		user_id: 0,
		created_at: new Date().toISOString()
	}

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		logger = require('obojobo-express/server/logger')

		CollectionModel = require('./collection')
	})
	afterEach(() => {})

	test('constructor initializes expected default properties', () => {
		const c = new CollectionModel({})

		expect(c.id).toBe(null)
		expect(c.title).toBe('')
		expect(c.userId).toBeUndefined()
		expect(c.createdAt).toBe(null)
	})

	test('constructor initializes expected properties from provided object', () => {
		const c = new CollectionModel(mockRawCollection)

		expect(c.id).toBe('mockCollectionId')
		expect(c.title).toBe('mockCollectionTitle')
		expect(c.userId).toBe(0)
		expect(c.createdAt).toBe(mockRawCollection.created_at)
	})

	test('fetchById retrieves a Collection from the database', () => {
		expect.hasAssertions()

		db.one.mockResolvedValueOnce(mockRawCollection)

		return CollectionModel.fetchById('mockCollectionId').then(model => {
			expect(model).toBeInstanceOf(CollectionModel)
			expect(model.id).toBe('mockCollectionId')
			expect(model.title).toBe('mockCollectionTitle')
			expect(model.userId).toBe(0)
			expect(model.createdAt).toBe(mockRawCollection.created_at)
		})
	})

	test('fetchById returns error when no match is found in the database', () => {
		expect.hasAssertions()
		const mockError = new Error('not found in db')
		logger.logError = jest.fn().mockReturnValueOnce(mockError)

		db.one.mockRejectedValueOnce(mockError)

		return CollectionModel.fetchById('mockCollectionId').catch(err => {
			expect(logger.logError).toHaveBeenCalledWith('Collection fetchById Error', mockError)
			expect(err).toBe(mockError)
		})
	})

	test('create with no title returns a collection', () => {
		expect.hasAssertions()
		const userId = 1
		const mockNewRawCollection = {
			id: 'mockCollectionId',
			title: 'mockCollectionTitle',
			user_id: userId,
			created_at: new Date().toISOString()
		}

		db.one.mockResolvedValueOnce(mockNewRawCollection)

		const mockCallObject = {
			user_id: userId
		}

		return CollectionModel.create(mockCallObject).then(model => {
			expect(model).toBeInstanceOf(CollectionModel)
			expect(model.id).toBe('mockCollectionId')
			expect(model.title).toBe('mockCollectionTitle')
			expect(model.userId).toBe(userId)
			expect(model.createdAt).toBe(mockNewRawCollection.created_at)
		})
	})

	test('create calls db.one() correctly', () => {
		expect.hasAssertions()
		const mockCallObject = {
			title: 'mockCollectionTitle',
			user_id: 1
		}

		db.one.mockResolvedValueOnce({})

		const createQuery = `
				INSERT INTO repository_collections
					(title, user_id)
				VALUES
					($[title], $[user_id])
				RETURNING
					id,
					title,
					user_id as userId,
					created_at as createdAt`

		return CollectionModel.create(mockCallObject).then(() => {
			expect(db.one).toHaveBeenCalledWith(createQuery, mockCallObject)
		})
	})

	test('loadRelatedDrafts calls DraftSummary.fetchAndJoinWhere with the correct arguments', () => {
		const DraftSummary = require('./draft_summary')
		DraftSummary.fetchAndJoinWhere = jest.fn()

		const mockDrafts = { draftId: 'mockDraftId' }

		db.one.mockResolvedValueOnce(mockRawCollection)
		DraftSummary.fetchAndJoinWhere.mockResolvedValueOnce(mockDrafts)

		const joinSQL = `
			JOIN repository_map_drafts_to_collections
				ON repository_map_drafts_to_collections.draft_id = drafts.id
			JOIN repository_collections
				ON repository_collections.id = repository_map_drafts_to_collections.collection_id`

		const whereSQL = `repository_collections.id = $[collectionId]`

		return CollectionModel.fetchById('mockCollectionId')
			.then(collection => collection.loadRelatedDrafts())
			.then(collection => {
				expect(DraftSummary.fetchAndJoinWhere).toHaveBeenCalledWith(joinSQL, whereSQL, {
					collectionId: 'mockCollectionId'
				})
				expect(collection.drafts).toEqual(mockDrafts)
			})
	})

	test('loadRelatedDrafts returns errors if DraftSummary.fetchAndJoinWhere fails', () => {
		expect.hasAssertions()
		const mockError = new Error('not found in db')
		logger.logError = jest.fn().mockReturnValueOnce(mockError)
		const DraftSummary = require('./draft_summary')
		DraftSummary.fetchAndJoinWhere = jest.fn()

		db.one.mockResolvedValueOnce(mockRawCollection)
		DraftSummary.fetchAndJoinWhere.mockRejectedValueOnce(mockError)

		const joinSQL = `
			JOIN repository_map_drafts_to_collections
				ON repository_map_drafts_to_collections.draft_id = drafts.id
			JOIN repository_collections
				ON repository_collections.id = repository_map_drafts_to_collections.collection_id`

		const whereSQL = `repository_collections.id = $[collectionId]`

		return CollectionModel.fetchById('mockCollectionId')
			.then(collection => collection.loadRelatedDrafts())
			.catch(error => {
				expect(DraftSummary.fetchAndJoinWhere).toHaveBeenCalledWith(joinSQL, whereSQL, {
					collectionId: 'mockCollectionId'
				})
				expect(error).toBe(mockError)
			})
	})
})
