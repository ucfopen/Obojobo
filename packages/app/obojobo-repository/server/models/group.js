const db = require('obojobo-express/db')
const logger = require('obojobo-express/logger')
const DraftSummary = require('./draft_summary')

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
		const joinOn = `
			JOIN repository_map_drafts_to_groups
				ON repository_map_drafts_to_groups.draft_id = drafts.id
			JOIN repository_groups
				ON repository_groups.id = repository_map_drafts_to_groups.group_id`

		const whereSQL = `repository_groups.id = $[groupId]`

		return DraftSummary
			.fetchAndJoinWhere(joinOn, whereSQL, { groupId : this.id })
			.then(draftSummaries => {
				this.drafts = draftSummaries
				return this
			})
			.catch(error => {
				logger.error('loadModules Error', error.message)
				return Promise.reject(error)
			})
	}
}

module.exports = RepositoryGroup
