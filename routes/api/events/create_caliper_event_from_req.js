let url = require('url')
let uuid = require('uuid').v4

let NavigationEvent = require('caliper-js-public/src/events/navigationEvent')

let NavigationActions = require('caliper-js-public/src/actions/navigationActions')

// let SoftwareApplication = require('caliper-js-public/src/entities/agent/softwareApplication')


// let Obojobo = new SoftwareApplication()
// Obojobo
let createIRI = (req, path) => {
	return (url.format({
		protocol: 'https',
		host: req.get('host'),
		pathname: path
	}))
}

module.exports = (req, currentUser) => {
	let clientEvent = req.body.event;
	let caliperEvent;

	switch(clientEvent.action)
	{
		case 'nav:goto':
		case 'nav:gotoPath':
		case 'nav:prev':
		case 'nav:next':
			caliperEvent = new NavigationEvent();

			// caliperEvent.id = 'urn:uuid:' + uuid()
			// caliperEvent.referrer = createIRI(req, '/view/' + clientEvent.draft_id + '/' + clientEvent.payload.from)
			// caliperEvent.setActor(createIRI(req, '/users/' + currentUser.id))
			// caliperEvent.setAction(NavigationActions.NAVIGATED_TO)
			// caliperEvent.setObject(createIRI(req, '/view/' + clientEvent.draft_id + '/' + clientEvent.payload.to))
			// caliperEvent.setEventTime((new Date()).toISOString())
			// caliperEvent.setEdApp(createIRI(req, '/'))

			caliperEvent.id = 'urn:uuid:' + uuid()
			caliperEvent.referrer = req.iri.getViewIRI(clientEvent.draft_id, clientEvent.payload.from)
			caliperEvent.setActor(req.iri.getUserIRI())
			caliperEvent.setAction(NavigationActions.NAVIGATED_TO)
			caliperEvent.setObject(req.iri.getViewIRI(clientEvent.draft_id, clientEvent.payload.to))
			caliperEvent.setEventTime((new Date()).toISOString())
			caliperEvent.setEdApp(req.iri.getIRI('/'))
			caliperEvent.extensions = {
				navType: clientEvent.action.split(':')[1]
			}

			if(req.session)
			{
				// caliperEvent.session = createIRI(req, '/sessions/' + req.session.id)
				caliperEvent.session = req.iri.getSessionIRI()
			}

			//@TODO - setfederatedSession to store lti launch id
			break

		default:
			caliperEvent = { todo: 'create a caliper event' }
			break
	}

	return caliperEvent
}
