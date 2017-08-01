let url = require('url')
let uuid = require('uuid').v4

let Event = require('caliper-js-public/src/events/event')
let NavigationEvent = require('caliper-js-public/src/events/navigationEvent')
let ViewEvent = require('caliper-js-public/src/events/viewEvent')

let NavigationActions = require('caliper-js-public/src/actions/navigationActions')

// let SoftwareApplication = require('caliper-js-public/src/entities/agent/softwareApplication')

// let Obojobo = new SoftwareApplication()
// Obojobo
let createIRI = (req, path) => {
	return url.format({
		protocol: 'https',
		host: req.get('host'),
		pathname: path
	})
}

module.exports = (req, currentUser) => {
	let clientEvent = req.body.event
	let caliperEvent = null

	switch (clientEvent.action) {
		case 'nav:goto':
		case 'nav:gotoPath':
		case 'nav:prev':
		case 'nav:next':
			caliperEvent = new NavigationEvent()

			caliperEvent.referrer = req.iri.getViewIRI(clientEvent.draft_id, clientEvent.payload.from)
			caliperEvent.setAction(NavigationActions.NAVIGATED_TO)
			caliperEvent.setObject(req.iri.getViewIRI(clientEvent.draft_id, clientEvent.payload.to))
			caliperEvent.extensions = {
				navType: clientEvent.action.split(':')[1]
			}

			break

		case 'question:view':
			caliperEvent = new ViewEvent()

			caliperEvent.setAction('Viewed')
			caliperEvent.setObject(
				req.iri.getViewIRI(clientEvent.draft_id, clientEvent.payload.questionId)
			)

			break
	}

	if (caliperEvent !== null) {
		caliperEvent.id = 'urn:uuid:' + uuid()
		caliperEvent.setEdApp(req.iri.getEdAppIRI())
		caliperEvent.setEventTime(new Date().toISOString())
		caliperEvent.setActor(req.iri.getCurrentUserIRI())
		//@TODO - setfederatedSession to store lti launch id

		if (req.session) {
			caliperEvent.session = req.iri.getSessionIRI()
		}
	}

	return caliperEvent
}
