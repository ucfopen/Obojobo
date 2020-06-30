describe.only('DraftSummary Model', () => {
	jest.mock('obojobo-express/server/db')
	jest.mock('obojobo-express/server/logger')
	let db
	let logger
	let DraftSummary

	const mockRawDraftSummary = {
		draft_id: 'mockDraftId',
		updated_at: new Date().toISOString(),
		created_at: new Date().toISOString(),
		latest_version: 'mockLatestVersionId',
		revision_count: 1,
		title: 'mockDraftTitle',
		user_id: 0,
		editor: 'visual'
	}

	beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		logger = require('obojobo-express/server/logger')

		DraftSummary = require('./draft_summary')
	})
	afterEach(() => {})

	//NOTE:
	// This is just the DraftSummary non-public 'buildQuery' method.
	// Not sure if there's a good way of exposing that, so will just use this.
	const queryBuilder = (whereSQL, joinSQL = '', limitSQL = '') =>
		`
		SELECT
			DISTINCT drafts_content.draft_id AS draft_id,
			last_value(drafts_content.created_at) OVER wnd as "updated_at",
			first_value(drafts_content.created_at) OVER wnd as "created_at",
			last_value(drafts_content.id) OVER wnd as "latest_version",
			count(drafts_content.id) OVER wnd as revision_count,
			COALESCE(last_value(drafts_content.content->'content'->>'title') OVER wnd, '') as "title",
			drafts.user_id AS user_id,
			'visual' AS editor
		FROM drafts
		JOIN drafts_content
			ON drafts_content.draft_id = drafts.id
		${joinSQL}
		WHERE drafts.deleted = FALSE
		AND ${whereSQL}
		WINDOW wnd AS (
			PARTITION BY drafts_content.draft_id ORDER BY drafts_content.created_at
			ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
		)
		ORDER BY updated_at DESC
		${limitSQL}
	`

	const checkAgainstMockRawSummary = summary => {
		expect(summary).toBeInstanceOf(DraftSummary)
		expect(summary.draftId).toBe('mockDraftId')
		expect(summary.title).toBe('mockDraftTitle')
		expect(summary.userId).toBe(0)
		expect(summary.createdAt).toBe(mockRawDraftSummary.created_at)
		expect(summary.updatedAt).toBe(mockRawDraftSummary.updated_at)
		expect(summary.latestVersion).toBe('mockLatestVersionId')
		expect(summary.revisionCount).toBe(1)
		expect(summary.editor).toBe('visual')
	}

	test('fetchById generates the correct query and returns a DraftSummary object', () => {
		db.one = jest.fn()
		db.one.mockResolvedValueOnce(mockRawDraftSummary)

		const query = queryBuilder('drafts.id = $[id]')

		return DraftSummary.fetchById('mockDraftId').then(summary => {
			expect(db.one).toHaveBeenCalledWith(query, { id: 'mockDraftId' })
			checkAgainstMockRawSummary(summary)
		})
	})

	test('fetchById returns error when no match is found in the database', () => {
		logger.error = jest.fn()

		expect.hasAssertions()

		db.one.mockRejectedValueOnce(new Error('not found in db'))

		return DraftSummary.fetchById('mockDraftId').catch(err => {
			expect(logger.error).toHaveBeenCalledWith('fetchById Error', 'not found in db')
			expect(err).toBe('Error Loading DraftSummary by id')
		})
	})

	test('fetchByUserId generates the correct query and returns a DraftSummary object', () => {
		db.any = jest.fn()
		db.any.mockResolvedValueOnce(mockRawDraftSummary)

		const whereSQL = 'repository_map_user_to_draft.user_id = $[userId]'
		const joinSQL = `JOIN repository_map_user_to_draft
				ON repository_map_user_to_draft.draft_id = drafts.id`
		const query = queryBuilder(whereSQL, joinSQL)

		return DraftSummary.fetchByUserId(0).then(summary => {
			expect(db.any).toHaveBeenCalledWith(query, { userId: 0 })
			checkAgainstMockRawSummary(summary)
		})
	})

	test('fetchRecentByUserId generates the correct query and returns a DraftSummary object', () => {
		db.any = jest.fn()
		db.any.mockResolvedValueOnce(mockRawDraftSummary)

		const whereSQL = 'repository_map_user_to_draft.user_id = $[userId]'
		const joinSQL = `JOIN repository_map_user_to_draft
				ON repository_map_user_to_draft.draft_id = drafts.id`
		const limitSQL = 'LIMIT 5'
		const query = queryBuilder(whereSQL, joinSQL, limitSQL)

		return DraftSummary.fetchRecentByUserId(0).then(summary => {
			expect(db.any).toHaveBeenCalledWith(query, { userId: 0 })
			checkAgainstMockRawSummary(summary)
		})
	})

	test('fetchAllInCollection generates the correct query and returns a DraftSummary object', () => {
		db.any = jest.fn()
		db.any.mockResolvedValueOnce(mockRawDraftSummary)

		const whereSQL = 'repository_map_drafts_to_collections.collection_id = $[collectionId]'
		const joinSQL = `JOIN repository_map_drafts_to_collections
				ON repository_map_drafts_to_collections.draft_id = drafts.id`
		const query = queryBuilder(whereSQL, joinSQL)

		return DraftSummary.fetchAllInCollection('mockCollectionId').then(summary => {
			expect(db.any).toHaveBeenCalledWith(query, { collectionId: 'mockCollectionId' })
			checkAgainstMockRawSummary(summary)
		})
	})

	test('fetchAllInCollectionForUser generates the correct query and returns a DraftSummary object', () => {
		db.any = jest.fn()
		db.any.mockResolvedValueOnce(mockRawDraftSummary)

		const whereSQL = `repository_map_drafts_to_collections.collection_id = $[collectionId]
			AND repository_map_user_to_draft.user_id = $[userId]`
		const joinSQL = `JOIN repository_map_drafts_to_collections
				ON repository_map_drafts_to_collections.draft_id = drafts.id
			JOIN repository_map_user_to_draft
				ON repository_map_user_to_draft.draft_id = drafts.id`
		const query = queryBuilder(whereSQL, joinSQL)

		return DraftSummary.fetchAllInCollectionForUser('mockCollectionId', 0).then(summary => {
			expect(db.any).toHaveBeenCalledWith(query, { collectionId: 'mockCollectionId', userId: 0 })
			checkAgainstMockRawSummary(summary)
		})
	})

	test('fetchByDraftTitleAndUser generates the correct query and returns a DraftSummary object', () => {
		db.any = jest.fn()
		db.any.mockResolvedValueOnce(mockRawDraftSummary)

		const whereSQL = 'repository_map_user_to_draft.user_id = $[userId]'
		const joinSQL = `JOIN repository_map_user_to_draft
			ON repository_map_user_to_draft.draft_id = drafts.id`
		const innerQuery = queryBuilder(whereSQL, joinSQL)
		const query = `
			SELECT inner_query.*
			FROM (
				${innerQuery}
			) AS inner_query
			WHERE inner_query.title ILIKE $[searchString]
		`

		return DraftSummary.fetchByDraftTitleAndUser('searchString', 0).then(summary => {
			expect(db.any).toHaveBeenCalledWith(query, { searchString: '%searchString%', userId: 0 })
			checkAgainstMockRawSummary(summary)
		})
	})

	test('fetchByDraftTitleAndUser returns error when no matches are found in the database', () => {
		logger.error = jest.fn()

		expect.hasAssertions()

		db.any.mockRejectedValueOnce(new Error('not found in db'))

		const whereSQL = 'repository_map_user_to_draft.user_id = $[userId]'
		const joinSQL = `JOIN repository_map_user_to_draft
			ON repository_map_user_to_draft.draft_id = drafts.id`
		const innerQuery = queryBuilder(whereSQL, joinSQL)
		const query = `
			SELECT inner_query.*
			FROM (
				${innerQuery}
			) AS inner_query
			WHERE inner_query.title ILIKE $[searchString]
		`

		return DraftSummary.fetchByDraftTitleAndUser('mockDraftTitle', 0).catch(err => {
			expect(logger.error).toHaveBeenCalledWith(
				'fetchByDraftTitleAndUser Error',
				'not found in db',
				query,
				{ searchString: '%mockDraftTitle%', userId: 0 }
			)
			expect(err).toBe('Error loading DraftSummary by query')
		})
	})

	test('fetchAndJoinWhereLimit catches database errors', () => {
		expect.hasAssertions()

		db.any.mockRejectedValueOnce(new Error('not found in db'))

		const whereSQL = ''
		const joinSQL = ''
		const limitSQL = ''
		const mockQueryValues = { id: 'mockDraftId' }

		return DraftSummary.fetchAndJoinWhereLimit(whereSQL, joinSQL, limitSQL, mockQueryValues).catch(
			err => {
				expect(logger.error).toHaveBeenCalledWith(
					'fetchAndJoinWhereLimit Error',
					'not found in db',
					whereSQL,
					joinSQL,
					limitSQL,
					mockQueryValues
				)
				expect(err).toBe('Error loading DraftSummary by query')
			}
		)
	})

	test('fetchAndJoinWhere catches database errors', () => {
		expect.hasAssertions()

		db.any.mockRejectedValueOnce(new Error('not found in db'))

		const whereSQL = ''
		const joinSQL = ''
		const mockQueryValues = { id: 'mockDraftId' }

		return DraftSummary.fetchAndJoinWhere(whereSQL, joinSQL, mockQueryValues).catch(err => {
			expect(logger.error).toHaveBeenCalledWith(
				'fetchAndJoinWhere Error',
				'not found in db',
				whereSQL,
				joinSQL,
				mockQueryValues
			)
			expect(err).toBe('Error loading DraftSummary by query')
		})
	})

	test('fetchWhere catches database errors', () => {
		expect.hasAssertions()

		db.any.mockRejectedValueOnce(new Error('not found in db'))

		const whereSQL = ''
		const mockQueryValues = { id: 'mockDraftId' }

		return DraftSummary.fetchWhere(whereSQL, mockQueryValues).catch(err => {
			expect(logger.error).toHaveBeenCalledWith(
				'fetchWhere Error',
				'not found in db',
				whereSQL,
				mockQueryValues
			)
			expect(err).toBe('Error loading DraftSummary by query')
		})
	})

	test('resultsToObjects renders a list of raw query results into DraftSummary objects', () => {
		const results = [
			{ ...mockRawDraftSummary },
			{ ...mockRawDraftSummary, draft_id: 'mockDraftId2' },
			{ ...mockRawDraftSummary, draft_id: 'mockDraftId3' }
		]

		const summaries = DraftSummary.resultsToObjects(results)

		expect(summaries.length).toBe(3)
		expect(summaries[0].draftId).toBe('mockDraftId')
		expect(summaries[1].draftId).toBe('mockDraftId2')
		expect(summaries[2].draftId).toBe('mockDraftId3')
	})
})
