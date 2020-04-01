describe('Collection Model', () => {
	jest.mock('obojobo-express/server/db')
	jest.mock('obojobo-express/server/logger')
	jest.mock('../../../server/models/draft_summary')
	let db
	let logger
	let CollectionModel

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
		logger = require('obojobo-express/server/logger')

		CollectionModel = require('../../../server/models/collection')
	})
	afterEach(() => {})

	test('constructor initializes expected default properties', () => {
		const c = new CollectionModel({})

		expect(c.id).toBe(null)
		expect(c.title).toBe('')
		expect(c.userId).toBe(null)
		expect(c.createdAt).toBe(null)
	})

	test('constructor initializes expected properties from provided object', () => {
		const c = new CollectionModel(mockRawCollection)

		expect(c.id).toBe('whatever')
		expect(c.title).toBe('whatever')
		expect(c.userId).toBe(0)
		expect(c.createdAt).toBe(mockRawCollection.created_at)
	})

	test('fetchById retrieves a Collection from the database', () => {
		expect.hasAssertions()

		db.one.mockResolvedValueOnce(mockRawCollection)

		CollectionModel.fetchById('whatever').then(model => {
			expect(model).toBeInstanceOf(CollectionModel)
			expect(model.id).toBe('whatever')
			expect(model.title).toBe('whatever')
			expect(model.userId).toBe(0)
			expect(model.createdAt).toBe(mockRawCollection.created_at)
		})
	})

	test('fetchById returns error when no match is found in the database', () => {
		logger.error = jest.fn()

		expect.hasAssertions()

		db.one.mockRejectedValueOnce(new Error('not found in db'))

		return CollectionModel.fetchById('whatever').catch(err => {
			expect(logger.error).toHaveBeenCalledWith('fetchById Error', 'not found in db')
			expect(err).toBeInstanceOf(Error)
			expect(err.message).toBe('not found in db')
		})
	})

	test('createWithUser returns a collection and logs its creation', () => {
		logger.info = jest.fn()

		expect.hasAssertions()
		const userId = 1
		const mockNewRawCollection = {
			id: 'whatever',
			title: 'New Collection',
			user_id: userId,
			created_at: new Date().toISOString()
		}

		db.one.mockResolvedValueOnce(mockNewRawCollection)

		return CollectionModel.createWithUser(userId).then(model => {
			expect(model).toBeInstanceOf(CollectionModel)
			expect(model.id).toBe('whatever')
			expect(model.title).toBe('New Collection')
			expect(model.userId).toBe(userId)
			expect(model.createdAt).toBe(mockNewRawCollection.created_at)
			expect(logger.info).toHaveBeenCalledWith('user created collection', {
				userId,
				collectionId: 'whatever'
			})
		})
	})

	test('rename returns a collection and logs user id, collection id and new title', () => {
		logger.info = jest.fn()

		expect.hasAssertions()

		db.one.mockResolvedValueOnce({ ...mockRawCollection, title: 'whatever else' })

		const userId = 0

		CollectionModel.rename('whatever', 'whatever else', userId).then(model => {
			expect(model).toBeInstanceOf(CollectionModel)
			expect(model.id).toBe('whatever')
			expect(model.title).toBe('whatever else')
			expect(model.userId).toBe(0)
			expect(model.createdAt).toBe(mockRawCollection.created_at)
			expect(logger.info).toHaveBeenCalledWith('collection renamed', {
				id: 'whatever',
				title: 'whatever else',
				userId
			})
		})
	})

	test('addModule logs a user adding a module to a collection', () => {
		logger.info = jest.fn()

		expect.hasAssertions()

		const collectionId = 'whatever'
		const draftId = 'whatever'
		const userId = 0

		const mockPayload = { collectionId, draftId, userId }

		db.none.mockResolvedValueOnce(mockPayload)

		CollectionModel.addModule(collectionId, draftId, userId).then(() => {
			expect(logger.info).toHaveBeenCalledWith('user added module to collection', mockPayload)
		})
	})

	test('removeModule logs a user removing a module from a collection', () => {
		logger.info = jest.fn()

		expect.hasAssertions()

		const collectionId = 'whatever'
		const draftId = 'whatever'
		const userId = 0

		const mockPayload = { collectionId, draftId, userId }

		db.none.mockResolvedValueOnce(mockPayload)

		CollectionModel.removeModule(collectionId, draftId).then(() => {
			expect(logger.info).toHaveBeenCalledWith('user removed module from collection', mockPayload)
		})
	})

	test('delete logs a user deleting a collection', () => {
		logger.info = jest.fn()

		expect.hasAssertions()

		const collectionId = 'whatever'
		const userId = 0

		CollectionModel.delete(collectionId, userId).then(() => {
			expect(logger.info).toHaveBeenCalledWith('collection deleted by user', {
				collectionId,
				userId
			})
		})
	})

	test('loadRelatedDrafts calls DraftSummary.fetchAndJoinWhere with the correct arguments', () => {
		const DraftSummary = require('../../../server/models/draft_summary')
		DraftSummary.fetchAndJoinWhere = jest.fn()

		const mockDrafts = { draftId: 'whatever' }

		db.one.mockResolvedValueOnce(mockRawCollection)
		DraftSummary.fetchAndJoinWhere.mockResolvedValueOnce(mockDrafts)

		const joinSQL = `
		JOIN repository_map_drafts_to_collections
			ON repository_map_drafts_to_collections.draft_id = drafts.id
		JOIN repository_collections
			ON repository_collections.id = repository_map_drafts_to_collections.collection_id`

		CollectionModel.fetchById('whatever')
			.then(collection => collection.loadRelatedDrafts())
			.then(collection => {
				expect(DraftSummary.fetchAndJoinWhere).toHaveBeenCalledWith(joinSQL, 'whatever')
				expect(collection.drafts).toEqual(mockDrafts)
			})
	})

	test('loadRelatedDrafts returns errors if DraftSummary.fetchAndJoinWhere fails', () => {
		logger.error = jest.fn()

		const DraftSummary = require('../../../server/models/draft_summary')
		DraftSummary.fetchAndJoinWhere = jest.fn()

		db.one.mockResolvedValueOnce(mockRawCollection)
		DraftSummary.fetchAndJoinWhere.mockRejectedValueOnce(new Error('not found in db'))

		const joinSQL = `
		JOIN repository_map_drafts_to_collections
			ON repository_map_drafts_to_collections.draft_id = drafts.id
		JOIN repository_collections
			ON repository_collections.id = repository_map_drafts_to_collections.collection_id`

		CollectionModel.fetchById('whatever')
			.then(collection => collection.loadRelatedDrafts())
			.catch(error => {
				expect(DraftSummary.fetchAndJoinWhere).toHaveBeenCalledWith(joinSQL, 'whatever')
				expect(error).toBeInstanceOf(Error)
				expect(error.message).toBe('not found in db')
				expect(logger.error).toHaveBeenCalledWith('fetchById Error', 'not found in db')
			})
	})
})
