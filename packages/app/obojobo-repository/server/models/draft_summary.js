const db = require('obojobo-express/server/db')
const logger = require('obojobo-express/server/logger')

const buildQuery = (whereSQL, joinSQL = '', limitSQL = '') => {
	return `
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
}

class DraftSummary {
	constructor({
		draft_id,
		latest_version,
		title,
		user_id,
		created_at,
		updated_at,
		revision_count,
		editor
	}) {
		this.draftId = draft_id
		this.title = title
		this.userId = user_id
		this.createdAt = created_at
		this.updatedAt = updated_at
		this.latestVersion = latest_version
		this.revisionCount = Number(revision_count)
		this.editor = editor
	}

	static fetchById(id) {
		return db
			.one(buildQuery('drafts.id = $[id]'), { id })
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				logger.error('fetchById Error', error.message)
				return Promise.reject('Error Loading DraftSummary by id')
			})
	}

	static fetchByUserId(userId) {
		return DraftSummary.fetchAndJoinWhere(
			`JOIN repository_map_user_to_draft
				ON repository_map_user_to_draft.draft_id = drafts.id`,
			`repository_map_user_to_draft.user_id = $[userId]`,
			{ userId }
		)
	}

	static fetchRecentByUserId(userId) {
		return DraftSummary.fetchAndJoinWhereLimit(
			`JOIN repository_map_user_to_draft
				ON repository_map_user_to_draft.draft_id = drafts.id`,
			`repository_map_user_to_draft.user_id = $[userId]`,
			'LIMIT 5',
			{ userId }
		)
	}

	static fetchAllInCollection(collectionId) {
		return DraftSummary.fetchAndJoinWhere(
			`JOIN repository_map_drafts_to_collections
				ON repository_map_drafts_to_collections.draft_id = drafts.id`,
			`repository_map_drafts_to_collections.collection_id = $[collectionId]`,
			{ collectionId }
		)
	}

	static fetchAllInCollectionForUser(collectionId, userId) {
		return DraftSummary.fetchAndJoinWhere(
			`JOIN repository_map_drafts_to_collections
				ON repository_map_drafts_to_collections.draft_id = drafts.id
			JOIN repository_map_user_to_draft
				ON repository_map_user_to_draft.draft_id = drafts.id`,
			`repository_map_drafts_to_collections.collection_id = $[collectionId]
			AND repository_map_user_to_draft.user_id = $[userId]`,
			{ collectionId, userId }
		)
	}

	static fetchByDraftTitleAndUser(searchString, userId) {
		searchString = `%${searchString}%`
		const whereSQL = `repository_map_user_to_draft.user_id = $[userId]`

		const joinSQL = `JOIN repository_map_user_to_draft
			ON repository_map_user_to_draft.draft_id = drafts.id`

		const innerQuery = buildQuery(whereSQL, joinSQL)
		const query = `
			SELECT inner_query.*
			FROM (
				${innerQuery}
			) AS inner_query
			WHERE inner_query.title ILIKE $[searchString]
		`

		const queryValues = { userId, searchString }

		return db
			.any(query, queryValues)
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				logger.error('fetchByDraftTitleAndUser Error', error.message, query, queryValues)
				return Promise.reject('Error loading DraftSummary by query')
			})
	}

	static fetchAndJoinWhereLimit(joinSQL, whereSQL, limitSQL, queryValues) {
		return db
			.any(buildQuery(whereSQL, joinSQL, limitSQL), queryValues)
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				logger.error(
					'fetchAndJoinWhereLimit Error',
					error.message,
					joinSQL,
					whereSQL,
					limitSQL,
					queryValues
				)
				return Promise.reject('Error loading DraftSummary by query')
			})
	}

	static fetchAndJoinWhere(joinSQL, whereSQL, queryValues) {
		return db
			.any(buildQuery(whereSQL, joinSQL), queryValues)
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				logger.error('fetchAndJoinWhere Error', error.message, joinSQL, whereSQL, queryValues)
				return Promise.reject('Error loading DraftSummary by query')
			})
	}

	static fetchWhere(whereSQL, queryValues) {
		return db
			.any(buildQuery(whereSQL), queryValues)
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				logger.error('fetchWhere Error', error.message, whereSQL, queryValues)
				return Promise.reject('Error loading DraftSummary by query')
			})
	}

	static resultsToObjects(results) {
		if (Array.isArray(results)) {
			return results.map(object => {
				return new DraftSummary(object)
			})
		}
		return new DraftSummary(results)
	}
}

module.exports = DraftSummary
