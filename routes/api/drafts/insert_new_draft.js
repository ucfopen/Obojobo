var db = require('../../../db')

module.exports = (userId, content = {}) => {
	let newDraft

	return db
		.none(`BEGIN`)
		.then(() => {
			return db.one(
				`
				INSERT INTO drafts
					(user_id)
				VALUES
					($[userId])
				RETURNING *`,
				{ userId: userId }
			)
		})
		.then(result => {
			newDraft = result
			return db.one(
				`
				INSERT INTO drafts_content
					(draft_id, content)
				VALUES
					($[draftId], $[content])
				RETURNING *`,
				{ draftId: result.id, content: content }
			)
		})
		.then(result => {
			newDraft.content = result
			return db.none(`COMMIT`)
		})
		.then(() => {
			return newDraft
		})
}
