const router = require('express').Router() //eslint-disable-line new-cap
const logger = require('obojobo-express/server/logger')
const uuid = require('uuid').v4
const bodyParser = require('body-parser')
const oboEvents = require('obojobo-express/server/obo_events')
const Visit = require('obojobo-express/server/models/visit')
const Draft = require('obojobo-express/server/models/draft')
const config = require('obojobo-express/server/config').materiaLti
const {
	widgetLaunchParams,
	contentSelectionParams,
	signLtiParams,
	verifyScorePassback,
	expandLisResultSourcedId,
	createPassbackResult,
	getValuesFromPassbackXML
} = require('./route-helpers')
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

// util to get a baseUrl to build urls for for this server
// option `isForServerRequest` indicates the url will be
// used by materia server to communicate with obo server
// useful when the server needs a different host than the
// client's browser - like one docker container talking to another
const baseUrl = (req, isForServerRequest = true) => {
	if (isForServerRequest && config.optionalOboServerHost) return config.optionalOboServerHost
	return `${req.protocol}://${req.get('host')}`
}

const renderError = (res, title, message) => {
	res.set('Content-Type', 'text/html')
	res.send(
		`<html><head><title>Error - ${title}</title></head><body><h1>${title}</h1><p>${message}</p></body></html>`
	)
}

// constructs a signed lti request, renders on client and has the client submit it
const renderLtiLaunch = (paramsIn, method, endpoint, res) => {
	const params = signLtiParams(paramsIn, method, endpoint)
	const keys = Object.keys(params)
	const htmlInput = keys
		.map(key => `<input type="hidden" name="${key}" value="${params[key]}"/>`)
		.join('')

	res.set('Content-Type', 'text/html')
	res.send(`<html>
		<body>
		<form id="form" method="${method}" action="${endpoint}" >${htmlInput}</form>
		<script>document.getElementById('form').submit()</script>
		</body></html>`)
}

// receives scores passed back from Materia
router
	.route('/materia-lti-score-passback')
	.post(bodyParser.text({ type: '*/*' }))
	.post(async (req, res) => {
		let success
		let visit = {}
		let passBackData = {}
		let sourcedIdData = {}
		const messageId = uuid()

		try {
			const verified = verifyScorePassback(req.headers, req.body, req.originalUrl, baseUrl(req))
			if (!verified) throw Error('Signature verification failed')
			passBackData = await getValuesFromPassbackXML(req.body)
			sourcedIdData = expandLisResultSourcedId(passBackData.sourcedId)
			visit = await Visit.fetchById(sourcedIdData.visitId)
			success = true
		} catch (e) {
			logger.error(e)
			success = false
		}

		await materiaEvent.insertLtiScorePassbackEvent({
			userId: visit.user_id,
			draftId: visit.draft_id,
			contentId: visit.draft_content_id,
			resourceLinkId: sourcedIdData.nodeId,
			messageRefId: passBackData.messageId,
			lisResultSourcedId: passBackData.sourcedId,
			messageId,
			success,
			ip: req.ip,
			score: passBackData.score,
			materiaHost: config.clientMateriaHost,
			isPreview: visit.is_preview,
			visitId: sourcedIdData.visitId
		})

		const xml = createPassbackResult({ success, messageId, messageRefId: passBackData.messageId })

		res.status(success ? 200 : 500)
		res.type('application/xml')
		res.send(xml)
	})

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
		const method = 'POST'

		if (!materiaNode) {
			renderError(
				res,
				'Materia Widget Not Found',
				`The Materia node id ${req.query.nodeId} was not found in the current draft: ${currentDocument.id} v.${currentDocument.contentId}.`
			)
			return
		}

		const materiaChunkId = materiaNode.node.id
		const endpoint = materiaNode.node.content.src

		// verify the endpoint is the configured materia server
		if (!endpoint.startsWith(config.clientMateriaHost)) {
			renderError(
				res,
				'Materia Widget Url Restricted',
				`The widget url ${endpoint} does not match the configured Materia server located at ${config.clientMateriaHost}.`
			)
			return
		}

		const launchParams = widgetLaunchParams(
			currentDocument,
			req.currentVisit,
			req.currentUser,
			materiaChunkId,
			baseUrl(req)
		)

		await materiaEvent.insertLtiLaunchWidgetEvent({
			userId: req.currentUser.id,
			draftId: currentDocument.draftId,
			contentId: currentDocument.contentId,
			visitId: req.currentVisit.id,
			isPreview: req.currentVisit.is_preview,
			lisResultSourcedId: launchParams.lis_result_sourcedid,
			resourceLinkId: launchParams.resource_link_id,
			endpoint,
			ip: req.ip
		})
		renderLtiLaunch(launchParams, method, endpoint, res)
	})

router.route('/materia-lti-picker-return').all((req, res) => {
	// our Materia integration relies on postmessage
	// this is only here for Materia to redirect to
	// once a resource is selected.  Normally,
	// the client will close the browser before this loads
	// In the future, this will have to receive & validate
	// a normal LTI ContentItemSelectionRequest results and
	// pass it to the client
	if (req.query.embed_type && req.query.url) {
		res.type('text/html')
		res.send(`<html><head></head><body>Materia Widget Selection Complete</body></html>`)
	}
})

router
	.route('/materia-lti-picker-launch')
	.get([requireCurrentUser, requireCanViewEditor])
	.get(async (req, res) => {
		const { draftId, contentId, nodeId } = req.query
		const clientBaseUrl = baseUrl(req, false)
		const serverBaseUrl = baseUrl(req)
		const currentDocument = await Draft.fetchDraftByVersion(draftId, contentId)
		const method = 'POST'
		const endpoint = `${config.clientMateriaHost}/lti/picker`
		const launchParams = contentSelectionParams(
			currentDocument,
			nodeId,
			req.currentUser,
			clientBaseUrl,
			serverBaseUrl
		)

		await materiaEvent.insertLtiPickerLaunchEvent({
			userId: req.currentUser.id,
			draftId,
			contentId,
			nodeId,
			endpoint,
			ip: req.ip
		})

		renderLtiLaunch(launchParams, method, endpoint, res)
	})

module.exports = router
