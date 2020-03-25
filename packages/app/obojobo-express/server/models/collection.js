const db = oboRequire('server/db')
const logger = oboRequire('server/logger.js')
const oboEvents = oboRequire('server/obo_events')

class Collection {
	constructor({ id = null, title = '', user_id, created_at = null }) {
		this.id = id
		this.title = title
		this.userId = user_id
		this.createdAt = created_at
	}

	static createWithUser(userId) {
		return db
			.one(
				`
					INSERT INTO repository_collections
						(title, group_type, user_id, visibility_type)
					VALUES
						('New Collection', 'tag', $[userId], 'private')
					RETURNING *`,
				{ userId }
			)
			.then(newCollection => {
				oboEvents.emit(Collection.EVENT_COLLECTION_CREATED, { id: newCollection.id })
				logger.info('user created collection', { userId, collectionId: newCollection.id })
				return newCollection
			})
	}

	static rename(id, newTitle) {
		return db
			.one(
				`UPDATE repository_collections
				SET title = $[newTitle]
				WHERE id = $[id]
				RETURNING *`,
				{ id, newTitle }
			)
			.then(updatedCollection => {
				const infoObject = {
					id: updatedCollection.id,
					title: updatedCollection.title
				}
				oboEvents.emit(Collection.EVENT_COLLECTION_UPDATED, infoObject)
				logger.info('collection renamed', infoObject)
				return updatedCollection
			})
	}

	static addModule(collectionId, draftId, userId) {
		return db
			.none(
				`INSERT INTO repository_map_drafts_to_collections
					(draft_id, collection_id, user_id)
				VALUES
					($[draftId], $[collectionId], $[userId])
				`,
				{ collectionId, draftId, userId }
			)
			.then(() => {
				const infoObject = {
					userId,
					collectionId,
					draftId
				}
				oboEvents.emit(Collection.EVENT_COLLECTION_MODULE_ADDED, infoObject)
				logger.info('user added module to collection', infoObject)
			})
	}

	static removeModule(collectionId, draftId) {
		return db
			.none(
				`DELETE FROM repository_map_drafts_to_collections
				WHERE
					draft_id = $[draftId]
					AND collection_id = $[collectionId]
				`,
				{ collectionId, draftId }
			)
			.then(() => {
				const infoObject = {
					collectionId,
					draftId
				}
				oboEvents.emit(Collection.EVENT_COLLECTION_MODULE_REMOVED, infoObject)
				logger.info('module removed from collection', infoObject)
			})
	}

	static delete(id) {
		return db
			.none(
				`UPDATE repository_collections
				SET deleted = TRUE
				WHERE id = $[id]`,
				{ id }
			)
			.then(() => {
				oboEvents.emit(Collection.EVENT_COLLECTION_UPDATED, { id })
				logger.info('collection deleted ', { id })
			})
	}
}

Collection.EVENT_COLLECTION_CREATED = 'EVENT_COLLECTION_CREATED'
Collection.EVENT_COLLECTION_DELETED = 'EVENT_COLLECTION_DELETED'
Collection.EVENT_COLLECTION_UPDATED = 'EVENT_COLLECTION_UPDATED'
Collection.EVENT_COLLECTION_MODULE_ADDED = 'EVENT_COLLECTION_MODULE_ADDED'
Collection.EVENT_COLLECTION_MODULE_REMOVED = 'EVENT_COLLECTION_MODULE_REMOVED'

module.exports = Collection
