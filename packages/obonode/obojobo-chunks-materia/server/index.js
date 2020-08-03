const router = require('express').Router() //eslint-disable-line new-cap
const util = require('util')
const xml2js = require('xml2js');
const crypto = require('crypto')
const logger = require('obojobo-express/server/logger')
const insertEvent = require('obojobo-express/server/insert_event')
const uuid = require('uuid').v4
const querystring = require('querystring')
const bodyParser = require('body-parser')
const sig = require('oauth-signature')
const oboEvents = require('obojobo-express/server/obo_events')
const Visit = require('obojobo-express/server/models/visit')
const {
	requireCurrentUser, requireCurrentVisit, requireCurrentDocument, requireCanViewEditor,
} = require('obojobo-express/server/express_validators');
const Draft = require('obojobo-express/server/models/draft');

// @TODO move these to a config
const oauthKey = 'materia-key'
const oauthSecret = 'materia-secret'
const materiaHost = 'https://localhost'

// append materia settings for the editor
oboEvents.on('EDITOR_SETTINGS', event => {
	event.moduleSettings.obojoboChunksMateria = {
		host: materiaHost
	}
})

const buildLTIUser = user => ({
	lis_person_contact_email_primary: user.email,
	lis_person_name_family: user.lastName,
	lis_person_name_full: `${user.firstName} ${user.lastName}`,
	lis_person_name_given: user.firstName,
	lis_person_sourcedid: user.username,
	roles: [],
	user_id: user.id,
	user_image: user.avatarUrl
})

const buildLTIStudent = user => ({...buildLTIUser(user), roles: ['Student']})
const buildLTIInstructor = user => ({...buildLTIUser(user), roles: ['Instructor']})

// @TODO score in config
const ltiToolConsumer = {
	tool_consumer_info_product_family_code: 'obojobo-next',
	tool_consumer_instance_guid: 'next.obojobo.ucf.edu',
	tool_consumer_instance_name: 'University of Central Florida',
	tool_consumer_instance_url: 'https://obojobo.ucf.edu/'
}

// @TODO this should be the module!
const ltiContextFromDocument = draft => ({
	context_id: draft.draftId,
	context_title: draft.getTitle(),
	context_type: 'CourseSection'
})

const defaultResourceLinkId = 'obojobo-dev-resource-id'
// util to get a baseUrl for inernal requests
const isDockerMateriaDev = true;
const baseUrl = (req, forClientRequest = false) => {
	if(!forClientRequest && isDockerMateriaDev) return 'https://host.docker.internal:8080'
	return `${req.protocol}://${req.get('host')}`
}

const renderError = (title, message) => {
	res.set('Content-Type', 'text/html')
	res.send(`<html><head><title>Error - ${title}</title></head><body><h1>${title}</h1><p>${message}</p></body></html>`)
}

// constructs a signed lti request and sends it.
const renderLtiLaunch = (paramsIn, method, endpoint, res) => {
	// add the required oauth params to the given prams
	const oauthParams = {
		oauth_nonce: Math.round(new Date().getTime() / 1000.0),
		oauth_timestamp: Math.round(new Date().getTime() / 1000.0),
		oauth_callback: 'about:blank',
		oauth_consumer_key: oauthKey,
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version: '1.0'
	}
	const params = { ...paramsIn, ...oauthParams }
	const hmac_sha1 = sig.generate(method, endpoint, params, oauthSecret, '', {
		encodeSignature: false
	})
	params['oauth_signature'] = hmac_sha1
	const keys = Object.keys(params)
	const htmlInput = keys
		.map(key => `<input type="hidden" name="${key}" value="${params[key]}"/><br/>`)
		.join('')

	res.set('Content-Type', 'text/html')
	res.send(`<html>
		<body>
		<form id="form" method="${method}" action="${endpoint}" >${htmlInput}</form>
		<script>document.getElementById('form').submit()</script>
		</body></html>`)
}


// check the bodyHash of an LTI 1 score passback to verify
// it matches when hashed with the secret we have locally
// returns true when matching, false when it fails verification
const verifyScorePassback = (req) => {
	try{
		// @TODO: verifty the sender is materiaHost

		// extract request headers into an object we can use
		const requestHeaders = req.headers.authorization.split(' ')[1].replace(/"/g, '').split(',').reduce((all, cur, i) => { return Object.assign({}, all, querystring.parse(cur))}, {} )

		// recreate the body hash by re-hashing it now
		const bodyHash = crypto.createHash('sha1').update(req.body).digest('base64')

		// check if our body hash matches
		if(bodyHash !== requestHeaders.oauth_body_hash){
			logger.error('Materia Replace Result Body Hash Mismatch')
			logger.info(req.body)
			logger.info(bodyHash)
			logger.info(requestHeaders.oauth_body_hash)
			return false
		}

		// re-construct the headers to sign them
		const headers = {
			oauth_version: requestHeaders.oauth_version,
			oauth_nonce: requestHeaders.oauth_nonce,
			oauth_timestamp: requestHeaders.oauth_timestamp,
			oauth_consumer_key: requestHeaders.oauth_consumer_key,
			oauth_body_hash: bodyHash,
			oauth_signature_method: requestHeaders.oauth_signature_method
		}

		// sign headers with our secret key
		const endpoint = `${baseUrl(req)}${req.originalUrl}`
		const hmac_sha1 = sig.generate('POST', endpoint, headers, oauthSecret, '', {encodeSignature: false})

		// check our signature against the one we received
		if(hmac_sha1 !== requestHeaders.oauth_signature){
			logger.error('Materia Replace Result Header oAuth Signature Mismatch')
			lggger.info(headers)
			logger.info(endpoint)
			lggger.info(hmac_sha1)
			return false
		}

		return true

	} catch(e){
		logger.error('Materia score passback verification error')
		logger.error(e)
		return false
	}
}

const getValuesFromPassbackXML = async (body) => {
	const result = await xml2js.parseStringPromise(body, {normalize: true, normalizeTags: true, explicitArray: false})
	const messageId = result.imsx_poxenveloperequest.imsx_poxheader.imsx_poxrequestheaderinfo.imsx_messageidentifier
	const sourcedId = result.imsx_poxenveloperequest.imsx_poxbody.replaceresultrequest.resultrecord.sourcedguid.sourcedid
	const score = parseFloat(result.imsx_poxenveloperequest.imsx_poxbody.replaceresultrequest.resultrecord.result.resultscore.textstring) * 100

	return {
		messageId,
		sourcedId,
		score
	}
}


const sendPassbackResult = ({res, success, messageId, messageRefId}) => {
	res.status(success ? 200 : 500)
	res.type('application/xml');
	res.send(`<?xml version="1.0" encoding="UTF-8"?>
		<imsx_POXEnvelopeResponse xmlns = "http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
			<imsx_POXHeader>
				<imsx_POXResponseHeaderInfo>
					<imsx_version>V1.0</imsx_version>
					<imsx_messageIdentifier>${messageId}</imsx_messageIdentifier>
					<imsx_statusInfo>
						<imsx_codeMajor>${success ? 'success' : 'failure'}</imsx_codeMajor>
						<imsx_severity>status</imsx_severity>
						<imsx_messageRefIdentifier>${messageRefId}</imsx_messageRefIdentifier>
						<imsx_operationRefIdentifier>replaceResult</imsx_operationRefIdentifier>
					</imsx_statusInfo>
				</imsx_POXResponseHeaderInfo>
			</imsx_POXHeader>
			<imsx_POXBody>
				<replaceResultResponse/>
			</imsx_POXBody>
		</imsx_POXEnvelopeResponse>`)
}

// receives scores passed back from the LTI Tool
router
	.route('/materia-lti-score-passback')
	.post(bodyParser.text({type: '*/*'}))
	.post(async (req, res) => {
		// @TODO: make the client aware that we've got a verifed score (or error!)
		let success
		let visit = {}
		let passBackData = {}
		let sourcedIdData = {}
		const messageId = uuid()

		try{
			if (!verifyScorePassback(req)) throw Error('Signature verification failed')
			passBackData = await getValuesFromPassbackXML(req.body)
			sourcedIdData = expandLisResultSourcedId(passBackData.sourcedId)
			visit = await Visit.fetchById(sourcedIdData.visitId)
			success = true
		} catch(e){
			logger.error(e)
			success = false
		}

		await insertLtiScorePassbackEvent({
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
			materiaHost,
			isPreview: visit.is_preview,
			visitId: sourcedIdData.visitId,
		})

		sendPassbackResult({ res, success, messageId, messageRefId: passBackData.messageId })
	})

const createLisResultSourcedId = (visitId, nodeId) => `${visitId}_${nodeId}`
const expandLisResultSourcedId = lisResultSourcedId => {
	const [visitId, nodeId] = lisResultSourcedId.split('_')
	return { visitId, nodeId }
}

// route to launch a materia widget
// the viewer component sends the widget url
// to this url and we build a page with all the params
// and signed oauth signature that the client's browser
// will post for us - taking them to the widget
router
	.route('/materia-lti-launch')
	.get([requireCurrentUser, requireCurrentVisit]) // @TODO add visitId, draftDocument, resource_link_id=chunk id
	.get( async (req, res) => {
		// use the visitId to get the src from the materia chunk
		const currentDocument = await req.currentVisit.draftDocument
		const materiaNode = currentDocument.getChildNodeById(req.query.nodeId)

		if (!materiaNode){
			renderError('Materia Widget Not Found', `The Materia node id ${req.query.nodeId} was not found in the current draft: ${currentDocument.id} v.${currentDocument.contentId}.`)
			return
		}

		const nodeId = materiaNode.node.id
		const endpoint = materiaNode.node.content.src

		// verify the endpoint is the configured materia server
		if (!endpoint.startsWith(materiaHost)){
			renderError('Materia Widget Url Restricted', `The widget url ${endpoint} does not match the configured Materia server located at ${materiaHost}.`)
			return
		}

		const method = 'POST'
		const params = {
			lis_outcome_service_url: `${baseUrl(req)}/materia-lti-score-passback`,
			lti_message_type: 'basic-lti-launch-request',
			lis_result_sourcedid: createLisResultSourcedId(req.currentVisit.id, nodeId),
			lti_version: 'LTI-1p0',
			resource_link_id: nodeId,
		}
		const user = req.currentVisit.is_preview ? buildLTIInstructor(req.currentUser) : buildLTIStudent(req.currentUser)
		const launchParams = { ...user, ...params, ...ltiToolConsumer, ...ltiContextFromDocument(currentDocument) }

		await insertLtiLaunchWidgetEvent({
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

router
	.route('/materia-lti-picker-return')
	.all((req, res) => {
		// our Materia integration relies on postmessage
		// this is only here for Materia to redirect to
		// once a resource is selected.  Normally,
		// the client will close the browser before this loads
		// In the future, this will have to receive & validate
		// a normal LTI ContentItemSelectionRequest results and
		// pass it to the client
		if(req.query.embed_type && req.query.url){
			res.type('text/html');
			res.send(`<html><head></head><body>Materia Widget Selection Complete</body></html>`)
		}
	})

router
	.route('/materia-lti-picker-launch')
	.get([requireCurrentUser, requireCanViewEditor])
	.get(async (req, res) => {
		const { draftId, contentId, nodeId } = req.query
		const currentDocument = await Draft.fetchDraftByVersion(draftId, contentId)
		const method = 'POST'
		const endpoint = `${materiaHost}/lti/picker`
		const params = {
			lti_message_type: 'ContentItemSelectionRequest',
			lti_version: 'LTI-1p0',
			accept_media_types: 'application/vnd.ims.lti.v1.ltiassignment',
			accept_presentation_document_targets: 'iframe',
			accept_unsigned: true,
			accept_multiple: false,
			accept_copy_advice: false,
			auto_create: false,
			content_item_return_url: `${baseUrl(req, true)}/materia-lti-picker-return`,
			data: `draftId=${draftId}&contentId=${contentId}&nodeId=${nodeId}`,
		}
		const launchParams = { ...buildLTIInstructor(req.currentUser), ...params, ...ltiToolConsumer, ...ltiContextFromDocument(currentDocument) }

		insertLtiPickerLaunchEvent({
			userId: req.currentUser.id,
			draftId,
			contentId,
			nodeId,
			endpoint,
			id: req.ip
		})

		renderLtiLaunch(launchParams, method, endpoint, res)
	})


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

const insertLtiPickerLaunchEvent = ({
	userId,
	draftId,
	contentId,
	nodeId,
	endpoint,
	ip
}) => {
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
	visitId,
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
			success,
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

module.exports = router
