const db = require('../db')
const editLockExpireMinutes = oboRequire('config').general.editLockExpireMinutes

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
	static create(userId, draftId) {
		return db.one(
			`
			INSERT INTO edit_locks (user_id, draft_id)
			SELECT $[userId], $[draftId]
			WHERE NOT EXISTS (
				SELECT id
				FROM edit_locks
				WHERE draft_id = $[draftId]
				AND user_id != $[userId]
				AND created_at > now() - interval '${editLockExpireMinutes} minutes'
			) RETURNING user_id AS "userId", draft_id AS "draftId", created_at AS "createdAt"
			`,
			{ userId, draftId }
		)
	}
}

module.exports = EditLock
