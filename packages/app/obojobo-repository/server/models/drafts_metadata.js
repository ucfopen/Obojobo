const db = require('obojobo-express/db')
const logger = require('obojobo-express/logger')

class DraftsMetadata {
	constructor({ draft_id, created_at, updated_at, key, value }) {
		this.draftId = draft_id
		this.createdAt = created_at
		this.updatedAt = updated_at
		this.key = key
		this.value = value
	}

	static fetchById(id) {
		// return db
		// 	.one(buildQueryWhere('drafts.id = $[id]'), { id })
		// 	.then(DraftsMetadata.resultsToObjects)
		// 	.catch(error => {
		// 		logger.error('fetchById Error', error.message)
		// 		return Promise.reject('Error Loading DraftSummary by id')
		// 	})
	}

	saveOrCreate() {
		return db
			.none(
				`
                INSERT INTO
                    drafts_metadata (draft_id, key, value)
                VALUES
                    ($[draftId], $[key], $[value])
                ON CONFLICT (draft_id, key) DO UPDATE SET
                    value = $[value],
                    updated_at = 'now()'
			    `,
				this
			)
			.then(() => {
				return this
			})
			.catch(error => {
				logger.error('saveOrCreate Error', error.message)
				return Promise.reject('Error loading DraftsMetadata by query')
			})
	}
}

module.exports = DraftsMetadata
