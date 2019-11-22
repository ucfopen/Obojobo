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

function setRedAlert(userId, draftId, contentId, timestamp, isRedAlertEnabled) {
	return db
		.none(
			`
				INSERT INTO red_alert_status
				(user_id, draft_id, draft_content_id, created_at, is_red_alert_enabled)
				VALUES($[userId], $[draftId], $[contentId], $[timestamp], $[isRedAlertEnabled])
				ON CONFLICT (user_id, draft_id) DO UPDATE
				SET
					created_at = $[timestamp],
					is_red_alert_enabled = $[isRedAlertEnabled]
				WHERE
					red_alert_status.user_id = $[userId] AND
					red_alert_status.draft_id = $[draftId]
			`,
			{
				userId,
				draftId,
				contentId,
				timestamp,
				isRedAlertEnabled
			}
		)
		.catch(error => {
			logger.error('DB UNEXPECTED on viewer_state.setRedAlert', error, error.toString())
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
	set,
	setRedAlert
}
