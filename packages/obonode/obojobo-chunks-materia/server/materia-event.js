const insertEvent = require('obojobo-express/server/insert_event')
const logger = require('obojobo-express/server/logger')
const oboEvents = require('obojobo-express/server/obo_events')
const { expandLisResultSourcedId } = require('./route-helpers')

// EVENTS
const insertLtiLaunchWidgetEvent = ({
	userId,
	draftId,
	contentId,
	visitId,
	isPreview,
	lisResultSourcedId,
	resourceLinkId,
	endpoint,
	ip
}) => {
	const action = 'materia:ltiLaunchWidget'
	return insertEvent({
		action,
		actorTime: new Date().toISOString(),
		isPreview,
		payload: {
			lisResultSourcedId,
			resourceLinkId,
			endpoint
		},
		visitId,
		userId,
		ip,
		eventVersion: '1.0.0',
		metadata: {},
		draftId,
		contentId
	}).catch(err => {
		logger.error(`There was an error inserting the ${action} event`, err)
	})
}

const insertLtiPickerLaunchEvent = ({ userId, draftId, contentId, nodeId, endpoint, ip }) => {
	const action = 'materia:ltiPickerLaunch'
	return insertEvent({
		action,
		actorTime: new Date().toISOString(),
		isPreview: false,
		payload: {
			nodeId,
			endpoint
		},
		visitId: null,
		userId,
		ip,
		eventVersion: '1.0.0',
		metadata: {},
		draftId,
		contentId
	}).catch(err => {
		logger.error(`There was an error inserting the ${action} event`, err)
	})
}

const insertLtiScorePassbackEvent = ({
	userId,
	draftId,
	contentId,
	resourceLinkId,
	lisResultSourcedId,
	messageRefId,
	messageId,
	success,
	ip,
	score,
	materiaHost,
	isPreview,
	visitId
}) => {
	const action = 'materia:ltiScorePassback'
	return insertEvent({
		action,
		actorTime: new Date().toISOString(),
		isPreview,
		payload: {
			lisResultSourcedId,
			resourceLinkId,
			messageRefId,
			messageId,
			materiaHost,
			score,
			success
		},
		visitId,
		userId,
		ip,
		eventVersion: '1.0.0',
		metadata: {},
		draftId,
		contentId
	})
		.then(() => {
			const payload = {
				score
			}

			const { nodeId } = expandLisResultSourcedId(lisResultSourcedId)

			oboEvents.emit(action, { userId, visitId, contentId, nodeId, payload })
		})
		.catch(err => {
			logger.error(`There was an error inserting the ${action} event`, err)
		})
}

module.exports = {
	insertLtiLaunchWidgetEvent,
	insertLtiPickerLaunchEvent,
	insertLtiScorePassbackEvent
}
