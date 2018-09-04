var db = require('../../../db')

module.exports = (draftId, content, xml) => {
	return db
		.one(
			`
			INSERT INTO drafts_content(
				draft_id,
				content,
				xml
			)
			VALUES(
				$[draftId],
				$[content],
				$[xml]
			)
			RETURNING id
		`,
			{
				draftId: draftId,
				content: content,
				xml: xml
			}
		)
		.then(result => {
			return result.id
		})
}
