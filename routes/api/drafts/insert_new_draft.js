var db = require('../../../db')

module.exports = (userId, content = {}, xml = null) => {
	let newDraft

	return db
		.tx(transactionDb => {
			return transactionDb
				.one(
					`
					INSERT INTO drafts
						(user_id)
					VALUES
						($[userId])
					RETURNING *`,
					{ userId: userId }
				)
				.then(result => {
					newDraft = result

					return transactionDb.one(
						`
						INSERT INTO drafts_content
							(draft_id, content, xml)
						VALUES
							($[draftId], $[content], $[xml])
						RETURNING *`,
						{ draftId: result.id, content: content, xml: xml }
					)
				})
				.then(result => {
					newDraft.content = result
				})
		})
		.then(() => {
			// transaction committed
			return newDraft
		})
}
