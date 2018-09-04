let db = oboRequire('db')
let logger = oboRequire('logger')

function set(userId, draftId, key, version, value) {
	return db
		.none(
			`
				INSERT INTO view_state
				(user_id, draft_id, payload)
				VALUES($[user_id], $[draft_id], $[initialContents])
				ON CONFLICT (user_id, draft_id) DO UPDATE
				SET payload = jsonb_set(view_state.payload, $[key], $[contents], true)
				WHERE view_state.user_id = $[user_id] AND
				view_state.draft_id = $[draft_id]
			`,
			{
				user_id: userId,
				draft_id: draftId,
				contents: { value, version },
				initialContents: { [key]: { value, version } },
				key: `{${key}}`
			}
		)
		.catch(error => {
			logger.error('DB UNEXPECTED on viewer_state.set', error, error.toString())
		})
}

function get(userId, draftId) {
	return db
		.oneOrNone(
			`
				SELECT payload FROM view_state
				WHERE view_state.user_id = $[user_id] AND
				view_state.draft_id = $[draft_id]
			`,
			{
				user_id: userId,
				draft_id: draftId
			},
			result => {
				// return payload or empty object if undefined from query
				return result != null ? result.payload : {}
			}
		)
		.catch(error => {
			logger.error('DB UNEXPECTED on viewer_state.get', error, error.toString())
		})
}

module.exports = {
	get,
	set
}
