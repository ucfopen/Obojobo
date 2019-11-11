const db = oboRequire('db')
const logger = oboRequire('logger')

function set(userId, draftId, contentId, key, version, value, resourceLinkId) {
	return db
		.none(
			`
				INSERT INTO view_state
				(user_id, draft_id, draft_content_id, payload, resource_link_id)
				VALUES($[userId], $[draftId], $[contentId], $[initialContents], $[resourceLinkId])
				ON CONFLICT (user_id, draft_content_id, resource_link_id) DO UPDATE
				SET payload = jsonb_set(view_state.payload, $[key], $[contents], true)
				WHERE view_state.user_id = $[userId] AND
				view_state.draft_content_id = $[contentId] AND
				view_state.resource_link_id = $[resourceLinkId]
			`,
			{
				userId,
				draftId,
				contentId,
				contents: { value, version },
				initialContents: { [key]: { value, version } },
				key: `{${key}}`,
				resourceLinkId
			}
		)
		.catch(error => {
			logger.error('DB UNEXPECTED on viewer_state.set', error, error.toString())
		})
}

function get(userId, contentId, resourceLinkId) {
	return db
		.oneOrNone(
			`
				SELECT payload FROM view_state
				WHERE view_state.user_id = $[userId] AND
				view_state.draft_content_id = $[contentId] AND
				view_state.resource_link_id = $[resourceLinkId]
				LIMIT 1
			`,
			{
				userId,
				contentId,
				resourceLinkId
			}
		)
		.then(result => {
			// return payload or empty object when result is null
			return result !== null ? result.payload : {}
		})
		.catch(error => {
			logger.error('DB UNEXPECTED on viewer_state.get', error, error.toString())
		})
}

module.exports = {
	get,
	set
}
