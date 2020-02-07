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
			CASE
				WHEN last_value(drafts_content.xml) OVER wnd IS NULL
				THEN 'visual'
				ELSE 'classic'
			END AS editor
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
			.one(buildQueryWhere('drafts.id = $[id]'), { id })
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				throw logger.logError('DraftSummary fetchById Error', error)
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
				throw logger.logError('Error loading DraftSummary by query', error)
			})
	}

	static fetchWhere(whereSQL, queryValues) {
		return db
			.any(buildQueryWhere(whereSQL), queryValues)
			.then(DraftSummary.resultsToObjects)
			.catch(error => {
				throw logger.logError('Error loading DraftSummary by query', error)
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
