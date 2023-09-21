describe('DraftsMetadata Model', () => {
	jest.mock('obojobo-express/server/db')
	jest.mock('obojobo-express/server/logger')
	let db
	let logger
	let DraftsMetadata

	const mockRawDraftsMetadata = {
		draft_id: 'mockDraftId',
		key: 'key',
		value: 'value'
	}

	const mockRawDraftMetadataMultiple = [
		{
			draft_id: 'mockDraftId1',
			key: 'key',
			value: 'value1'
		},
		{
			draft_id: 'mockDraftId2',
			key: 'key',
			value: 'value2'
		}
	]

	const expectMatchesRawMock = (draftMetadata, number = '') => {
		expect(draftMetadata.draftId).toBe(`mockDraftId${number}`)
		// these would have dates from the database, but it doesn't really matter here
		expect(draftMetadata.createdAt).toBeUndefined()
		expect(draftMetadata.updatedAt).toBeUndefined()
		expect(draftMetadata.key).toBe('key')
		expect(draftMetadata.value).toBe(`value${number}`)
	}

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		logger = require('obojobo-express/server/logger')

		DraftsMetadata = require('./drafts_metadata')
	})
	afterEach(() => {})

	test('creating a new DraftsMetadata object maps arguments to properties correctly', () => {
		const draftMetadata = new DraftsMetadata(mockRawDraftsMetadata)
		expectMatchesRawMock(draftMetadata)
	})

	test('saveOrCreate returns a DraftsMetadata object', () => {
		db.none = jest.fn()
		db.none.mockResolvedValueOnce(mockRawDraftsMetadata)

		const draftMetadata = new DraftsMetadata(mockRawDraftsMetadata)

		expect.hasAssertions()

		// Trying to match whitespace with the query that's actually running
		const query = `
				INSERT INTO
					drafts_metadata (draft_id, key, value)
				VALUES
					($[draftId], $[key], $[value])
				ON CONFLICT (draft_id, key) DO UPDATE SET
					value = $[value],
					updated_at = 'now()'
				`

		return draftMetadata.saveOrCreate().then(dm => {
			expect(db.none).toHaveBeenCalledWith(query, draftMetadata)
			expect(dm).toBeInstanceOf(DraftsMetadata)
			expectMatchesRawMock(dm)
		})
	})

	test('saveOrCreate returns an error if the insert fails', () => {
		logger.error = jest.fn()

		expect.hasAssertions()

		db.none.mockRejectedValueOnce(new Error('insert failed'))

		const draftMetadata = new DraftsMetadata(mockRawDraftsMetadata)

		expect.hasAssertions()

		return draftMetadata.saveOrCreate().catch(err => {
			expect(logger.error).toHaveBeenCalledWith('saveOrCreate Error', 'insert failed')
			expect(err).toBe('Error loading DraftsMetadata by query')
		})
	})

	// getByDraftId tests

	test('getByDraftId generates the correct query and returns DraftsMetadata objects', () => {
		expect.hasAssertions()

		db.manyOrNone = jest.fn()
		db.manyOrNone.mockResolvedValueOnce(mockRawDraftMetadataMultiple)

		// Trying to match whitespace with the query that's actually running
		const query = `
			SELECT *
			FROM drafts_metadata
			WHERE draft_id = $[draftId]
			`

		return DraftsMetadata.getByDraftId('mockDraftId').then(res => {
			expect(db.manyOrNone).toHaveBeenCalledWith(query, { draftId: 'mockDraftId' })
			expect(res.length).toBe(2)
			expectMatchesRawMock(res[0], 1)
			expectMatchesRawMock(res[1], 2)
		})
	})

	test('getByDraftId generates the correct query and returns for zero results correctly', () => {
		expect.hasAssertions()

		db.manyOrNone = jest.fn()
		db.manyOrNone.mockResolvedValueOnce()

		// Trying to match whitespace with the query that's actually running
		const query = `
			SELECT *
			FROM drafts_metadata
			WHERE draft_id = $[draftId]
			`

		return DraftsMetadata.getByDraftId('mockDraftId').then(res => {
			expect(db.manyOrNone).toHaveBeenCalledWith(query, { draftId: 'mockDraftId' })
			expect(res).toBe(null)
		})
	})

	test('getByDraftId logs database errors', () => {
		expect.hasAssertions()
		const mockError = new Error('database error')
		logger.logError = jest.fn().mockReturnValueOnce(mockError)
		db.manyOrNone.mockRejectedValueOnce(mockError)

		return DraftsMetadata.getByDraftId('metaKey', 'metaValue').catch(err => {
			expect(logger.logError).toHaveBeenCalledWith('DraftMetadata getByDraftId error', mockError)
			expect(err).toBe(mockError)
		})
	})

	// getByDraftIdAndKey tests

	test('getByDraftIdAndKey generates the correct query and returns a DraftsMetadata object', () => {
		expect.hasAssertions()

		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce(mockRawDraftsMetadata)

		// Trying to match whitespace with the query that's actually running
		const query = `
			SELECT *
			FROM drafts_metadata
			WHERE draft_id = $[draftId] AND key = $[key]
			`

		return DraftsMetadata.getByDraftIdAndKey('draftId', 'metaKey').then(res => {
			expect(db.oneOrNone).toHaveBeenCalledWith(query, { draftId: 'draftId', key: 'metaKey' })
			expect(res).toBeInstanceOf(DraftsMetadata)
			expectMatchesRawMock(res)
		})
	})

	test('getByDraftIdAndKey generates the correct query and returns for zero results correctly', () => {
		expect.hasAssertions()

		db.oneOrNone = jest.fn()
		db.oneOrNone.mockResolvedValueOnce()

		// Trying to match whitespace with the query that's actually running
		const query = `
			SELECT *
			FROM drafts_metadata
			WHERE draft_id = $[draftId] AND key = $[key]
			`

		return DraftsMetadata.getByDraftIdAndKey('draftId', 'metaKey').then(res => {
			expect(db.oneOrNone).toHaveBeenCalledWith(query, { draftId: 'draftId', key: 'metaKey' })
			expect(res).toBe(null)
		})
	})

	test('getByDraftIdAndKey logs database errors', () => {
		expect.hasAssertions()
		const mockError = new Error('database error')
		logger.logError = jest.fn().mockReturnValueOnce(mockError)
		db.oneOrNone.mockRejectedValueOnce(mockError)

		return DraftsMetadata.getByDraftIdAndKey('draftId', 'metaKey').catch(err => {
			expect(logger.logError).toHaveBeenCalledWith(
				'DraftMetadata getByDraftIdAndKey error',
				mockError
			)
			expect(err).toBe(mockError)
		})
	})

	// getByKeyAndValue tests

	test('getByKeyAndValue generates the correct query and returns DraftsMetadata objects', () => {
		expect.hasAssertions()

		db.manyOrNone = jest.fn()
		db.manyOrNone.mockResolvedValueOnce(mockRawDraftMetadataMultiple)

		// Trying to match whitespace with the query that's actually running
		const query = `
			SELECT *
			FROM drafts_metadata
			WHERE key = $[key] AND value = $[value]
			`

		return DraftsMetadata.getByKeyAndValue('metaKey', 'metaValue').then(res => {
			expect(db.manyOrNone).toHaveBeenCalledWith(query, { key: 'metaKey', value: 'metaValue' })
			expect(res.length).toBe(2)
			expectMatchesRawMock(res[0], 1)
			expectMatchesRawMock(res[1], 2)
		})
	})

	test('getByKeyAndValue generates the correct query and returns for zero results correctly', () => {
		expect.hasAssertions()

		db.manyOrNone = jest.fn()
		db.manyOrNone.mockResolvedValueOnce()

		// Trying to match whitespace with the query that's actually running
		const query = `
			SELECT *
			FROM drafts_metadata
			WHERE key = $[key] AND value = $[value]
			`

		return DraftsMetadata.getByKeyAndValue('metaKey', 'metaValue').then(res => {
			expect(db.manyOrNone).toHaveBeenCalledWith(query, { key: 'metaKey', value: 'metaValue' })
			expect(res).toBe(null)
		})
	})

	test('getByKeyAndValue logs database errors', () => {
		expect.hasAssertions()
		const mockError = new Error('database error')
		logger.logError = jest.fn().mockReturnValueOnce(mockError)
		db.manyOrNone.mockRejectedValueOnce(mockError)

		return DraftsMetadata.getByKeyAndValue('metaKey', 'metaValue').catch(err => {
			expect(logger.logError).toHaveBeenCalledWith(
				'DraftMetadata getByKeyAndValue error',
				mockError
			)
			expect(err).toBe(mockError)
		})
	})
})
