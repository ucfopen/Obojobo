const db = require('obojobo-express/server/db')
const logger = require('obojobo-express/server/logger')

const buildQueryWhere = (whereSQL, joinSQL = '') => {
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
		editor,
		content,
		id,
		first_name,
		last_name
	}) {
		this.draftId = draft_id
		this.title = title
		this.userId = user_id
		this.createdAt = created_at
		this.updatedAt = updated_at
		this.latestVersion = latest_version
		this.revisionCount = Number(revision_count)
		this.editor = editor
		this.json = content
		this.revisionId = id
		this.userFullName = `${first_name} ${last_name}`
	}

	static fetchById(id) {
		return db
			.one(buildQueryWhere('drafts.id = $[id]'), { id })
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

	static fetchAndJoinWhere(joinSQL, whereSQL, queryValues) {
		return db
			.any(buildQueryWhere(whereSQL, joinSQL), queryValues)
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				logger.error('fetchWhere Error', error.message, whereSQL, queryValues)
				return Promise.reject('Error loading DraftSummary by query')
			})
	}

	static fetchWhere(whereSQL, queryValues) {
		return db
			.any(buildQueryWhere(whereSQL), queryValues)
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				logger.error('fetchWhere Error', error.message, whereSQL, queryValues)
				return Promise.reject('Error loading DraftSummary by query')
			})
	}

	static fetchAllDraftRevisions(draftId) {
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
			WHERE drafts_content.draft_id = $[draftId]
			ORDER BY drafts_content.created_at DESC;
		`

		return db
			.any(query, { draftId })
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				logger.error('fetchAllDraftRevisions', error.message, query, draftId)
				return Promise.reject('Error loading DraftSummary by query')
			})
	}

	static fetchDraftRevisionById(draftId, revisionId) {
		const query = `
			SELECT
				id,
				draft_id,
				created_at,
				content
			FROM drafts_content
			WHERE draft_id = $[draftId] AND id = $[revisionId]
		`

		return db
			.one(query, { draftId, revisionId })
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				logger.error('fetchAllDraftVersions', error.message, query, draftId)
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
