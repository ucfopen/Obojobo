const jose = require('node-jose')
const jwt = require('jsonwebtoken')
const router = require('express').Router() //eslint-disable-line new-cap
const oboEvents = require('obojobo-express/server/obo_events')
const Draft = require('obojobo-express/server/models/draft')
const config = require('obojobo-express/server/config').materiaLti
const materiaEvent = require('./materia-event')
const {
	requireCurrentUser,
	requireCurrentVisit,
	requireCanViewEditor
} = require('obojobo-express/server/express_validators')

// append materia settings for the editor
oboEvents.on('EDITOR_SETTINGS', event => {
	event.moduleSettings.obojoboChunksMateria = {
		host: config.clientMateriaHost
	}
})

const base64encode = str => Buffer.from(str).toString('base64')
const base64decode = str => Buffer.from(str, 'base64').toString()

// util to get a baseUrl to build urls for for this server
// option `isForServerRequest` indicates the url will be
// used by materia server to communicate with obo server
// useful when the server needs a different host than the
// client's browser - like one docker container talking to another
const baseUrl = (req, isForServerRequest = true) => {
	if (isForServerRequest && config.optionalOboServerHost) return config.optionalOboServerHost
	return `${req.protocol}://${req.get('host')}`
}

// util to get a csrf token from an existing request
// feels like a bit of a hack but seems to work
const csrfCookie = req => {
	const cookies = req.headers.cookie.split(';')
	let cookieCSRFToken = cookies.find(cookie => cookie.includes('csrftoken'))
	if (cookieCSRFToken) {
		cookieCSRFToken = cookieCSRFToken.split('=')[1]
	}
	return cookieCSRFToken
}

const renderError = (res, title, message) => {
	res.set('Content-Type', 'text/html')
	res.send(
		`<html><head><title>Error - ${title}</title></head><body><h1>${title}</h1><p>${message}</p></body></html>`
	)
}

// route to launch a materia widget
// the viewer component sends the widget url
// to this url and we build a page with all the params
// and signed oauth signature that the client's browser
// will post for us - taking them to the widget
router
	.route('/materia-lti-launch')
	.get([requireCurrentUser, requireCurrentVisit])
	.get(async (req, res) => {
		// use the visitId to get the src from the materia chunk
		const currentDocument = await req.currentVisit.draftDocument
		const materiaNode = currentDocument.getChildNodeById(req.query.nodeId)

		if (!materiaNode) {
			renderError(
				res,
				'Materia Widget Not Found',
				`The Materia node id ${req.query.nodeId} was not found in the current draft: ${currentDocument.id} v.${currentDocument.contentId}.`
			)
			return
		}

		const materiaOboNodeId = materiaNode.node.id
		const widgetEndpoint = materiaNode.node.content.src

		// verify the endpoint is the configured materia server
		if (!widgetEndpoint.startsWith(config.clientMateriaHost)) {
			renderError(
				res,
				'Materia Widget Url Restricted',
				`The widget url ${widgetEndpoint} does not match the configured Materia server located at ${config.clientMateriaHost}.`
			)
			return
		}

		await materiaEvent.insertLtiLaunchWidgetEvent({
			userId: req.currentUser.id,
			draftId: currentDocument.draftId,
			contentId: currentDocument.contentId,
			visitId: req.currentVisit.id,
			isPreview: req.currentVisit.is_preview,
			lisResultSourcedId: `${req.currentVisit.id}__${materiaOboNodeId}`,
			resourceLinkId: `${req.currentVisit.resource_link_id}__${req.currentVisit.draft_id}__${materiaOboNodeId}`,
			widgetEndpoint,
			ip: req.ip
		})
		const endpoint = `${config.clientMateriaHost}/ltilaunch/`

		const loginHintObj = {
			nodeId: materiaOboNodeId,
			widgetEndpoint
		}
		const loginHint = base64encode(JSON.stringify(loginHintObj))
		const ltiMessageHint = 'resource'
		res.redirect(
			`${config.clientMateriaHost}/init/${config.oboLtiUuid}/?iss=${baseUrl(req)}&client_id=${
				config.oboLtiClientId
			}&target_link_uri=${endpoint}&login_hint=${loginHint}&lti_message_hint=${ltiMessageHint}`
		)
	})

router.route('/materia-lti-picker-return').post(async (req, res) => {
	// our Materia integration relies on postmessage
	// this is only here for Materia to redirect to
	// once a resource is selected.  Normally,
	// the client will close the browser before this loads
	if (req.url) {
		res.type('text/html')
		res.send(`<html><head></head><body>Materia Widget Selection Complete</body></html>`)
	}
})

router
	.route('/materia-lti-picker-launch')
	.get([requireCurrentUser, requireCanViewEditor])
	.get(async (req, res) => {
		const { draftId, contentId, nodeId } = req.query
		const currentDocument = await Draft.fetchDraftByVersion(draftId, contentId)
		const endpoint = `${config.clientMateriaHost}/ltilaunch/`

		await materiaEvent.insertLtiPickerLaunchEvent({
			userId: req.currentUser.id,
			draftId,
			contentId,
			nodeId,
			endpoint,
			ip: req.ip
		})

		const loginHintObj = {
			nodeId: nodeId,
			documentTitle: currentDocument.getTitle()
		}

		const loginHint = base64encode(JSON.stringify(loginHintObj))
		const ltiMessageHint = 'picker'
		res.redirect(
			`${config.clientMateriaHost}/init/${config.oboLtiUuid}/?iss=${baseUrl(req)}&client_id=${
				config.oboLtiClientId
			}&target_link_uri=${endpoint}&login_hint=${loginHint}&lti_message_hint=${ltiMessageHint}`
		)
	})

router
	.route('/materia-lti-auth')
	.get([requireCurrentUser])
	.get(async (req, res) => {
		const { client_id, redirect_uri, login_hint, lti_message_hint, nonce, state } = req.query

		if (lti_message_hint === 'picker' && !req.currentUser.hasPermission('canViewEditor')) {
			renderError(
				res,
				'Action Not Allowed',
				'Widget picker event launched by user lacking editor rights.'
			)
			return
		}

		const now = Math.floor(Date.now() / 1000)

		const nodeContext = JSON.parse(base64decode(login_hint))

		const payload = {
			iss: baseUrl(req),
			aud: client_id,
			iat: now,
			exp: now + 300,
			nonce,
			sub: req.currentUser.username, // this... may not be necessary?
			email: req.currentUser.email,
			given_name: req.currentUser.firstName,
			family_name: req.currentUser.lastName,
			'https://purl.imsglobal.org/spec/lti/claim/lis': {
				person_sourcedid: req.currentUser.username
			},
			'https://purl.imsglobal.org/spec/lti/claim/version': '1.3.0',
			'https://purl.imsglobal.org/spec/lti/claim/message_type':
				lti_message_hint === 'picker' ? 'LtiDeepLinkingRequest' : 'LtiResourceLinkRequest',
			'https://purl.imsglobal.org/spec/lti/claim/deployment_id': 'obojobo-deployment-id',
			'https://purl.imsglobal.org/spec/lti/claim/target_link_uri':
				lti_message_hint === 'picker' ? redirect_uri : nodeContext.widgetEndpoint,
			// transporting the node ID of the Materia node being embedded via the login hint
			// there may be a more intelligent way of doing this?
			'https://purl.imsglobal.org/spec/lti/claim/resource_link': { id: nodeContext.nodeId },
			'https://purl.imsglobal.org/spec/lti/claim/roles': [
				// this may be a bit naive, but we can probably assume that
				//  students will not be able to use the draft editor, so anybody
				//  getting this far is an instructor
				req.currentUser.hasPermission('canViewEditor')
					? 'http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor'
					: 'http://purl.imsglobal.org/vocab/lis/v2/membership#Learner'
			],
			// need to somehow address this
			'https://purl.imsglobal.org/spec/lti/claim/context': {
				id: nodeContext.nodeId,
				title: nodeContext.draftTitle
			}
		}
		if (lti_message_hint === 'picker') {
			payload['https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings'] = {
				deep_link_return_url: `${baseUrl(req)}/materia-lti-picker-return`,
				accept_types: ['ltiResourceLink'],
				accept_presentation_document_targets: ['iframe', 'window', 'embed']
			}
		}

		const idToken = jwt.sign(payload, config.oboPrivateRsaKey, {
			algorithm: 'RS256',
			keyid: config.oboJwtKey
		})

		res.set('Content-Type', 'text/html')
		res.send(`<html><body>
			<form id="form" method="POST" action="${redirect_uri}">
				<input type="hidden" name="instance" value="${nodeContext.nodeId}" />
				<input type="hidden" name="csrfmiddlewaretoken" value="${csrfCookie(req)}" />
				<input type="hidden" name="state" value="${state}" />
				<input type="hidden" name="id_token" value="${idToken}" />
			</form>
			<script>document.getElementById('form').submit()</script>
			</body></html>`)
	})

// this might make more sense somewhere else, but currently it only matters for the materia integration
router.route('/.well-known/jwks.json').get(async (req, res) => {
	const key = await jose.JWK.asKey(config.oboPrivateRsaKey, 'pem')

	const jwk = key.toJSON()
	jwk.use = 'sig'
	jwk.alg = 'RS256'
	jwk.kid = config.oboJwtKey

	res.json({ keys: [jwk] })
})

module.exports = router
