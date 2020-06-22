const db = require('../db')
const editLockExpireMinutes = oboRequire('server/config').general.editLocks.autoExpireMinutes

class EditLock {
	constructor(props) {
		// expand all the props onto this object
		for (const prop in props) {
			this[prop] = props[prop]
		}
	}

	// returns count of all rows deleted
	static deleteExpiredLocks() {
		return db.result(
			`
			DELETE
			FROM edit_locks
			WHERE created_at < now() - interval '${editLockExpireMinutes} minutes'
				`,
			null,
			r => r.rowCount // extract rowCount from query data
		)
	}

	// clear a user's locks on a draft
	// returns true if deleted, false if nothing to delete
	static deleteByDraftIdandUser(userId, draftId) {
		return db
			.result(
				`
			DELETE
			FROM edit_locks
			WHERE draft_id = $[draftId]
			AND user_id = $[userId]
				`,
				{ userId, draftId },
				r => r.rowCount // extract rowCount from query data
			)
			.then(rows => {
				return rows > 0
			})
	}

	// get only the most recent active lock for a draft
	static fetchByDraftId(draftId) {
		return db
			.oneOrNone(
				`
			SELECT
				id,
				user_id AS "userId",
				draft_id AS "draftId",
				created_at AS "createdAt"
			FROM edit_locks
			WHERE draft_id = $[draftId]
			AND created_at > now() - interval '${editLockExpireMinutes} minutes'
			ORDER BY created_at DESC
			LIMIT 1
		`,
				{ draftId }
			)
			.then(data => {
				if (data === null) return
				return new EditLock(data)
			})
	}

	// inserts a lock only when a different user's valid lock doesn't already exist
	static async create(userId, draftId, contentId) {
		return db.taskIf(async t => {
			// get the newest draft contentId for this draft
			const currentContentId = await t.one(
				`SELECT
					drafts.id AS "draftId",
					drafts_content.id AS "contentId"
				FROM drafts
				JOIN drafts_content
					ON drafts.id = drafts_content.draft_id
				WHERE drafts.id = $[draftId]
					AND deleted = FALSE
				ORDER BY drafts_content.created_at DESC
				LIMIT 1
				`,
				{ draftId }
			)

			// verify the newest version is the same as the version requested
			// if it is not - that means the draft has been updated unexpectedly
			if (currentContentId.contentId !== contentId) {
				throw Error('Current version of draft does not match requested lock.')
			}

			return await t
				.one(
					`INSERT INTO edit_locks (user_id, draft_id)
				SELECT $[userId], $[draftId]
				WHERE NOT EXISTS (
					SELECT id
					FROM edit_locks
					WHERE draft_id = $[draftId]
					AND user_id != $[userId]
					AND created_at > now() - interval '${editLockExpireMinutes} minutes'
				) RETURNING
					id
					user_id AS "userId",
					draft_id AS "draftId",
					created_at AS "createdAt"
				`,
					{ userId, draftId }
				)
				.then(data => {
					return new EditLock(data)
				})
		})
	}
}

module.exports = EditLock
