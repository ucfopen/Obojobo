const db = require('obojobo-express/db')
const logger = require('obojobo-express/logger')
const DraftSummary = require('./draft_summary')

class RepositoryCollection {
	constructor({ id = null, title = '', user_id, created_at = null }) {
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
			FROM repository_collections
			WHERE id = $[id]
			LIMIT 1
			`,
				{ id }
			)
			.then(selectResult => {
				return new RepositoryCollection(selectResult)
			})
			.catch(error => {
				logger.error('Collection fetchById Error', error.message)
				return Promise.reject(error)
			})
	}

	static create({ title = '', user_id }) {
		return db
			.one(
				`
				INSERT INTO repository_collections
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
					user_id
				}
			)
			.then(insertResult => {
				return new RepositoryCollection(insertResult)
			})
	}
	loadRelatedDrafts() {
		const joinOn = `
			JOIN repository_map_drafts_to_collections
				ON repository_map_drafts_to_collections.draft_id = drafts.id
			JOIN repository_collections
				ON repository_collections.id = repository_map_drafts_to_collections.collection_id`

		const whereSQL = `repository_collections.id = $[collectionId]`

		return DraftSummary.fetchAndJoinWhere(joinOn, whereSQL, { collectionId: this.id })
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

module.exports = RepositoryCollection
