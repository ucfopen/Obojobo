const db = oboRequire('server/db')
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
				oboEvents.emit(Collection.EVENT_COLLECTION_UPDATED, {
					id: updatedCollection.id,
					title: updatedCollection.title
				})
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
				oboEvents.emit(Collection.EVENT_COLLECTION_MODULE_ADDED, {
					collectionId,
					draftId
				})
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
				oboEvents.emit(Collection.EVENT_COLLECTION_MODULE_REMOVED, {
					collectionId,
					draftId
				})
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
			})
	}
}

Collection.EVENT_COLLECTION_CREATED = 'EVENT_COLLECTION_CREATED'
Collection.EVENT_COLLECTION_DELETED = 'EVENT_COLLECTION_DELETED'
Collection.EVENT_COLLECTION_UPDATED = 'EVENT_COLLECTION_UPDATED'
Collection.EVENT_COLLECTION_MODULE_ADDED = 'EVENT_COLLECTION_MODULE_ADDED'
Collection.EVENT_COLLECTION_MODULE_REMOVED = 'EVENT_COLLECTION_MODULE_REMOVED'

module.exports = Collection
