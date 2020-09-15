describe('DraftSummary Model', () => {
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

	const mockRawRevisionHistory = [
		{
			id: 'mockDraftVersionId1',
			draft_id: 'mockDraftId',
			created_at: new Date(10000000000).toISOString(),
			user_id: 0,
			first_name: 'firstName',
			last_name: 'lastName'
		},
		{
			id: 'mockDraftVersionId2',
			draft_id: 'mockDraftId',
			created_at: new Date(20000000000).toISOString(),
			user_id: 0,
			first_name: 'firstName',
			last_name: 'lastName'
		},
		{
			id: 'mockDraftVersionId2',
			draft_id: 'mockDraftId',
			created_at: new Date(30000000000).toISOString(),
			user_id: 0,
			first_name: 'firstName',
			last_name: 'lastName'
		}
	]

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
	const queryBuilder = (whereSQL, joinSQL = '') =>
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
	`

	const fetchAllDraftRevisionsQuery = `
			SELECT
				drafts_content.id,
				drafts_content.draft_id,
				drafts_content.created_at,
				drafts_content.user_id,
				users.first_name,
				users.last_name
			FROM drafts_content
			JOIN users
				ON drafts_content.user_id = users.id
			WHERE
				drafts_content.draft_id = $[draftId]
				
			ORDER BY
				drafts_content.created_at DESC
			LIMIT $[count];
		`

	const expectIsMockSummary = summary => {
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
			expectIsMockSummary(summary)
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
		expect.hasAssertions()

		db.any = jest.fn()
		db.any.mockResolvedValueOnce(mockRawDraftSummary)

		const whereSQL = 'repository_map_user_to_draft.user_id = $[userId]'
		const joinSQL = `JOIN repository_map_user_to_draft
				ON repository_map_user_to_draft.draft_id = drafts.id`
		const query = queryBuilder(whereSQL, joinSQL)

		return DraftSummary.fetchByUserId(0).then(summary => {
			expect(db.any).toHaveBeenCalledWith(query, { userId: 0 })
			expectIsMockSummary(summary)
		})
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

	test('fetchAllDraftRevisions returns all versions of a draft when afterVersionId is null or missing', () => {
		expect.hasAssertions()

		db.any = jest.fn()
		db.any.mockResolvedValueOnce(mockRawRevisionHistory)

		return DraftSummary.fetchAllDraftRevisions('mockDraftId').then(history => {
			expect(db.any).toHaveBeenCalledWith(fetchAllDraftRevisionsQuery, {
				afterVersionId: null,
				count: 51,
				draftId: 'mockDraftId'
			})
			expect(history.revisions.length).toBe(mockRawRevisionHistory.length)
			for (let i = 0; i < history.revisions.length; i++) {
				const revision = history.revisions[i]
				expect(revision).toBeInstanceOf(DraftSummary)
				expect(revision.draftId).toBe('mockDraftId')
				expect(revision.userId).toBe(0)
				expect(revision.createdAt).toBe(mockRawRevisionHistory[i].created_at)
				expect(revision.revisionId).toBe(mockRawRevisionHistory[i].id)
				expect(revision.userFullName).toBe('firstName lastName')

				// nothing else was grabbed in the query
				expect(revision.title).toBeUndefined()
				expect(revision.updatedAt).toBeUndefined()
				expect(revision.latestVersion).toBeUndefined()
				expect(revision.editor).toBeUndefined()
				expect(revision.json).toBeUndefined()
			}
			// would only be true if the number of results returned was equal to the max number per batch
			expect(history.hasMoreResults).toBe(false)
		})
	})

	// there's no real way of testing this short of running the actual queries against an actual database
	// test will make sure the correct query is being generated
	test('fetchAllDraftRevisions returns revisions created later than a provided afterVersionId', () => {
		expect.hasAssertions()

		db.any = jest.fn()
		db.any.mockResolvedValueOnce([
			{ ...mockRawRevisionHistory[1] },
			{ ...mockRawRevisionHistory[2] }
		])

		const query = `
			SELECT
				drafts_content.id,
				drafts_content.draft_id,
				drafts_content.created_at,
				drafts_content.user_id,
				users.first_name,
				users.last_name
			FROM drafts_content
			JOIN users
				ON drafts_content.user_id = users.id
			WHERE
				drafts_content.draft_id = $[draftId]
				
				AND drafts_content.created_at < (
					SELECT created_at FROM drafts_content WHERE id = $[afterVersionId]
				)
			ORDER BY
				drafts_content.created_at DESC
			LIMIT $[count];
		`

		// bonus test - make sure count is equal to the provided number plus one
		return DraftSummary.fetchAllDraftRevisions('mockDraftId', 'mockAfterVersionId', 20).then(
			history => {
				expect(db.any).toHaveBeenCalledWith(query, {
					afterVersionId: 'mockAfterVersionId',
					count: 21,
					draftId: 'mockDraftId'
				})
				expect(history.revisions.length).toBeLessThan(mockRawRevisionHistory.length)
				for (let i = 1; i < history.length; i++) {
					const revision = history.revisions[i]
					expect(revision).toBeInstanceOf(DraftSummary)
					expect(revision.draftId).toBe('mockDraftId')
					expect(revision.userId).toBe(0)
					expect(revision.createdAt).toBe(mockRawRevisionHistory[i + 1].created_at)
					expect(revision.revisionId).toBe(mockRawRevisionHistory[i + 1].id)
					expect(revision.userFullName).toBe('firstName lastName')

					// nothing else was grabbed in the query
					expect(revision.title).toBeUndefined()
					expect(revision.updatedAt).toBeUndefined()
					expect(revision.latestVersion).toBeUndefined()
					expect(revision.editor).toBeUndefined()
					expect(revision.json).toBeUndefined()
				}
				// would only be true if the number of results returned was equal to the max number per batch
				expect(history.hasMoreResults).toBe(false)
			}
		)
	})

	// again, no real way of testing this without querying a real database
	// can approximate it
	test('fetchAllDraftRevisions indicates when more revisions are available', () => {
		expect.hasAssertions()

		const mockDbReturn = []
		for (let i = 0; i < 51; i++) {
			mockDbReturn.push({
				id: `mockDraftVersionId1${i + 1}`,
				draft_id: 'mockDraftId',
				created_at: new Date(10000000000 + 1000000000 * i).toISOString(),
				user_id: 0,
				first_name: 'firstName',
				last_name: 'lastName'
			})
		}

		db.any = jest.fn()
		db.any.mockResolvedValueOnce(mockDbReturn)

		return DraftSummary.fetchAllDraftRevisions('mockDraftId').then(history => {
			expect(db.any).toHaveBeenCalledWith(fetchAllDraftRevisionsQuery, {
				afterVersionId: null,
				count: 51,
				draftId: 'mockDraftId'
			})
			expect(history.revisions.length).toBe(50)
			// would only be true if the number of results returned was equal to the max number per batch
			expect(history.hasMoreResults).toBe(true)
		})
	})

	test('fetchAllDraftRevisions constrains the result count to a minimum', () => {
		expect.hasAssertions()

		db.any = jest.fn()
		db.any.mockResolvedValueOnce(mockRawRevisionHistory)

		return DraftSummary.fetchAllDraftRevisions('mockDraftId', null, 1).then(() => {
			expect(db.any).toHaveBeenCalledWith(fetchAllDraftRevisionsQuery, {
				afterVersionId: null,
				count: 11, //minimum count value is 10, plus one
				draftId: 'mockDraftId'
			})
		})
	})

	test('fetchAllDraftRevisions constrains the result count to a maximum', () => {
		expect.hasAssertions()

		db.any = jest.fn()
		db.any.mockResolvedValueOnce(mockRawRevisionHistory)

		return DraftSummary.fetchAllDraftRevisions('mockDraftId', null, 1000).then(() => {
			expect(db.any).toHaveBeenCalledWith(fetchAllDraftRevisionsQuery, {
				afterVersionId: null,
				count: 101, //maximum count value is 100, plus one
				draftId: 'mockDraftId'
			})
		})
	})

	test('fetchAllDraftRevisions catches database errors', () => {
		expect.hasAssertions()

		db.any.mockRejectedValueOnce(new Error('not found in db'))

		return DraftSummary.fetchAllDraftRevisions('mockDraftId').catch(err => {
			expect(logger.error).toHaveBeenCalledWith(
				'fetchAllDraftRevisions',
				'not found in db',
				fetchAllDraftRevisionsQuery,
				'mockDraftId'
			)
			expect(err).toBe('Error loading DraftSummary by query')
		})
	})

	test('fetchDraftRevisionById returns a draft revision', () => {
		expect.hasAssertions()

		const mockCreationDate = new Date().toISOString()

		db.one = jest.fn()
		db.one.mockResolvedValueOnce({
			id: 'mockRevisionId',
			draft_id: 'mockDraftId',
			created_at: mockCreationDate,
			content: 'mockDraftContent',
			first_name: 'firstname',
			last_name: 'lastname'
		})

		const query = `
			SELECT
				drafts_content.id,
				drafts_content.draft_id,
				drafts_content.created_at,
				drafts_content.content,
				drafts_content.user_id,
				users.first_name,
				users.last_name
			FROM drafts_content
			JOIN users
				ON drafts_content.user_id = users.id
			WHERE drafts_content.draft_id = $[draftId] AND drafts_content.id = $[revisionId]
		`

		return DraftSummary.fetchDraftRevisionById('mockDraftId', 'mockRevisionId').then(revision => {
			expect(db.one).toHaveBeenCalledWith(query, {
				draftId: 'mockDraftId',
				revisionId: 'mockRevisionId'
			})
			expect(revision).toBeInstanceOf(DraftSummary)
			expect(revision.draftId).toBe('mockDraftId')
			expect(revision.createdAt).toBe(mockCreationDate)
			expect(revision.json).toBe('mockDraftContent')
			expect(revision.revisionId).toBe('mockRevisionId')
			expect(revision.userFullName).toBe('firstname lastname')
		})
	})

	test('fetchDraftRevisionById catches database errors', () => {
		expect.hasAssertions()

		db.one.mockRejectedValueOnce(new Error('not found in db'))

		const query = `
			SELECT
				drafts_content.id,
				drafts_content.draft_id,
				drafts_content.created_at,
				drafts_content.content,
				drafts_content.user_id,
				users.first_name,
				users.last_name
			FROM drafts_content
			JOIN users
				ON drafts_content.user_id = users.id
			WHERE drafts_content.draft_id = $[draftId] AND drafts_content.id = $[revisionId]
		`

		return DraftSummary.fetchDraftRevisionById('mockDraftId', 'mockRevisionId').catch(err => {
			expect(logger.error).toHaveBeenCalledWith(
				'fetchDraftRevisionById',
				'not found in db',
				query,
				{ draftId: 'mockDraftId', revisionId: 'mockRevisionId' }
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
