const db = require('obojobo-express/db')
const logger = require('obojobo-express/logger')

class RepositoryModule {
	constructor({id, current_version, title, user_id, created_at, updated_at, revision_count}) {
		this.id = id
		this.title = title
		this.userId = user_id
		this.createdAt = created_at
		this.updatedAt = updated_at
		this.currentVersion = current_version
		this.revisionCount = Number(revision_count)
	}

	static fetchById(id) {
		return db
			.one(
				`
				SELECT
					DISTINCT c.draft_id AS id,
					last_value(c.created_at) OVER wnd as "updated_at",
					first_value(c.created_at) OVER wnd as "created_at",
					last_value(c.id) OVER wnd as "current_version",
					count(c.id) OVER wnd as revision_count,
					last_value(c.content->'content'->'title') OVER wnd as "title",
					drafts.user_id AS user_id
				FROM drafts
				JOIN drafts_content AS c
					ON c.draft_id = drafts.id
				WHERE drafts.id = $[id]
				WINDOW wnd AS (
					PARTITION BY c.draft_id ORDER BY c.created_at
					ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
				)
			`,
				{ id }
			)
			.then(selectResult => {
				return new RepositoryModule(selectResult)
			})
			.catch(error => {
				logger.error('fetchById Error', error.message)
				return Promise.reject(error)
			})
	}
}

module.exports = RepositoryModule
