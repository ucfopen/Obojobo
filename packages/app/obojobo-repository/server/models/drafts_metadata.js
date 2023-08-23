const db = require('obojobo-express/server/db')
const logger = require('obojobo-express/server/logger')

class DraftsMetadata {
	constructor({ draft_id, created_at, updated_at, key, value }) {
		this.draftId = draft_id
		this.createdAt = created_at
		this.updatedAt = updated_at
		this.key = key
		this.value = value
	}

	static getByDraftId(draftId) {
		return db
			.manyOrNone(
				`
			SELECT *
			FROM drafts_metadata
			WHERE draft_id = $[draftId]
			`,
				{ draftId }
			)
			.then(res => {
				if (res) return res.map(r => new DraftsMetadata(r))
				return null
			})
			.catch(error => {
				logger.logError('DraftMetadata getByDraftId error', error)
				throw error
			})
	}

	static getByDraftIdAndKey(draftId, key) {
		return db
			.oneOrNone(
				`
			SELECT *
			FROM drafts_metadata
			WHERE draft_id = $[draftId] AND key = $[key]
			`,
				{ draftId, key }
			)
			.then(res => {
				if (res) return new DraftsMetadata(res)
				return null
			})
			.catch(error => {
				logger.logError('DraftMetadata getByDraftIdAndKey error', error)
				throw error
			})
	}

	static getByKeyAndValue(key, value) {
		return db
			.manyOrNone(
				`
			SELECT *
			FROM drafts_metadata
			WHERE key = $[key] AND value = $[value]
			`,
				{ key, value }
			)
			.then(res => {
				if (res) return res.map(r => new DraftsMetadata(r))
				return null
			})
			.catch(error => {
				logger.logError('DraftMetadata getByKeyAndValue error', error)
				throw error
			})
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
