const db = oboRequire('server/db')
const logger = oboRequire('server/logger.js')
const oboEvents = oboRequire('server/obo_events')

class Collection {
	constructor() {
		this.draftId = rawDraft.draftId
	}

	yell() {
		return Promise.all(this.root.yell.apply(this.root, arguments)).then(() => {
			return this
		})
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
				oboEvents.emit(Collection.EVENT_NEW_COLLECTION_CREATED, { id: newCollection.id })
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

Collection.EVENT_NEW_COLLECTION_CREATED = 'EVENT_NEW_COLLECTION_CREATED'
Collection.EVENT_COLLECTION_DELETED = 'EVENT_COLLECTION_DELETED'
Collection.EVENT_COLLECTION_UPDATED = 'EVENT_COLLECTION_UPDATED'

module.exports = Collection
