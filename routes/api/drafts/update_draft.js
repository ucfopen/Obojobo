var db = require('../../../db')

module.exports = (draftId, content) => {
	return (
		db.one(`
			INSERT INTO drafts_content(
				draft_id,
				content
			)
			VALUES(
				$[draftId],
				$[content]
			)
			RETURNING id
		`, {
			draftId: draftId,
			content: content
		})
		.then( result => {
			return result.id
		})
	)
}