const db = oboRequire('db')
const logger = oboRequire('logger')

function set(userId, draftId, contentId, key, version, value) {
	return db
		.none(
			`
				INSERT INTO view_state
				(user_id, draft_id, draft_content_id, payload)
				VALUES($[userId], $[draftId], $[contentId], $[initialContents])
				ON CONFLICT (user_id, draft_content_id) DO UPDATE
				SET payload = jsonb_set(view_state.payload, $[key], $[contents], true)
				WHERE view_state.user_id = $[userId] AND
				view_state.draft_content_id = $[contentId]
			`,
			{
				userId,
				draftId,
				contentId,
				contents: { value, version },
				initialContents: { [key]: { value, version } },
				key: `{${key}}`
			}
		)
		.catch(error => {
			logger.error('DB UNEXPECTED on viewer_state.set', error, error.toString())
		})
}

function setRedAlert(userId, draftId, contentId, timestamp, redAlert) {
	return db
		.none(
			`
		INSERT INTO red_alert_status
		(user_id, draft_id, creation_time, red_alert, draft_content_id)
		VALUES($[user_id], $[draft_id], $[actor_time], $[red_alert], $[draft_content_id])
		ON CONFLICT (user_id, draft_id) DO
		UPDATE
		SET	creation_time = $[actor_time], red_alert = $[red_alert]
		WHERE red_alert_status.user_id = $[user_id]
			AND red_alert_status.draft_id = $[draft_id]`,
			{
				user_id: userId,
				draft_id: draftId,
				actor_time: timestamp,
				red_alert: redAlert,
				draft_content_id: contentId
			}
		)
		.catch(error => {
			logger.error('DB UNEXPECTED on viewer_state.setRedAlert', error, error.toString())
		})
}

function get(userId, contentId) {
	return db
		.oneOrNone(
			`
				SELECT view_state.payload, red_alert_status.red_alert
				FROM view_state
				FULL OUTER JOIN red_alert_status ON
				view_state.user_id = red_alert_status.user_id AND
				view_state.draft_id = red_alert_status.draft_id AND
				view_state.draft_content_id = red_alert_status.draft_content_id
				WHERE (view_state.user_id = $[userId] AND
				view_state.draft_content_id = $[contentId]) OR
				(red_alert_status.user_id = $[userId] AND
				red_alert_status.draft_content_id = $[contentId])
			`,
			{
				userId,
				contentId
			}
		)
		.then(result => {
			// return payload or empty object when result is null
			if (result === null) {
				return {}
			}
			const payload = result.payload
			if (typeof payload === 'object' && payload !== null) {
				payload['nav:redAlert'] = { value: result.red_alert }
			}
			return payload
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
