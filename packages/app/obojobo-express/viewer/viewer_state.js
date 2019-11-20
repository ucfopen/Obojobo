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
				(user_id, draft_id, content_id, creation_time, is_red_alert_enabled)
				VALUES($[userId], $[draftId], $[contentId], $[timestamp], $[isRedAlertEnabled])
				ON CONFLICT (user_id, draft_id) DO UPDATE
				SET
					creation_time = $[timestamp],
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
				SELECT view_state.payload, red_alert_status.is_red_alert_enabled FROM view_state
				JOIN red_alert_status ON
					view_state.user_id = red_alert_status.user_id AND
					view_state.draft_id = red_alert_status.draft_id AND
					view_state.draft_content_id = red_alert_status.content_id
				WHERE
					(view_state.user_id = $[userId] AND
					view_state.draft_content_id = $[contentId] AND
					view_state.resource_link_id = $[resourceLinkId]) OR
					(red_alert_status.user_id = $[userId] AND
					red_alert_status.content_id = $[contentId])
			`,
			{
				userId,
				contentId,
				resourceLinkId
			}
		)
		.then(result => {
			// return payload or empty object when result is null
			if (result === null) {
				return {}
			}

			if (typeof result.payload === 'object' && result.payload !== null) {
				result.payload['nav:redAlert'] = {
					value: !!result.is_red_alert_enabled
				}
			}

			delete result.payload.is_red_alert_enabled

			return result.payload
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
