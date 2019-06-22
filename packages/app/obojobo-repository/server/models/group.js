const db = require('obojobo-express/db')
const logger = require('obojobo-express/logger')

class RepositoryGroup {
	constructor({id = null, title = '', user_id, created_at = null}) {
		this.id = id
		this.title = title
		this.userId = user_id
		this.createdAt = created_at
		this.drafts = []
	}

	static fetchById(id) {
		return db
			.one(
				`
			SELECT
				id,
				title,
				user_id,
				created_at
			FROM repository_groups
			WHERE id = $[id]
			LIMIT 1
			`,
				{ id }
			)
			.then(selectResult => {
				return new RepositoryGroup(selectResult)
			})
			.catch(error => {
				logger.error('fetchById Error', error.message)
				return Promise.reject(error)
			})
	}

	static create({title = '', user_id}) {
		let newDraft

		return db
			.one(
				`
				INSERT INTO repository_groups
					(title, user_id)
				VALUES
					($[title], $[user_id])
				RETURNING
					id,
					title,
					user_id as userId,
					created_at as createdAt`,
				{
					title,
					type,
					user_id
				}
			)
			.then(insertResult => {
				return new RepositoryGroup(insertResult)
			})
	}

	loadRelatedDrafts() {
		return db
			.manyOrNone(
				`
				SELECT
					DISTINCT c.draft_id AS id,
					last_value(c.created_at) OVER wnd as "updatedAt",
					first_value(c.created_at) OVER wnd as "createdAt",
					last_value(c.id) OVER wnd as "latestVersion",
					count(c.id) OVER wnd as revisionCount,
					last_value(c.content->'content'->'title') OVER wnd as "title",
					drafts.user_id AS userId
				FROM drafts
				JOIN repository_map_drafts_to_groups AS m
					ON m.draft_id = drafts.id
				JOIN repository_groups AS g
					ON g.id = m.group_id
				JOIN drafts_content AS c
					ON c.draft_id = drafts.id
				WHERE g.id = $[groupId]
				WINDOW wnd AS (
					PARTITION BY c.draft_id ORDER BY c.created_at
					ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
				)
			`,
				{ groupId : this.id }
			)
			.then(moduleResults => {
				this.drafts = moduleResults
				return this
			})
			.catch(error => {
				logger.error('loadModules Error', error.message)
				return Promise.reject(error)
			})
	}
}

module.exports = RepositoryGroup
