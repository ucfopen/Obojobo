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

	const expectMatchesRawMock = draftMetadata => {
		expect(draftMetadata.draftId).toBe('mockDraftId')
		expect(draftMetadata.createdAt).toBeUndefined()
		expect(draftMetadata.updatedAt).toBeUndefined()
		expect(draftMetadata.key).toBe('key')
		expect(draftMetadata.value).toBe('value')
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

		draftMetadata.saveOrCreate().then(dm => {
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
})
