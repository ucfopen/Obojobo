const router = require('express').Router() //eslint-disable-line new-cap
const util = require('util')
const xml2js = require('xml2js');
const crypto = require('crypto')
const querystring = require('querystring')
const bodyParser = require('body-parser')
const sig = require('oauth-signature')
const {
	requireCanViewDrafts,
	requireCurrentUser,
} = require('obojobo-express/server/express_validators')

const oauthKey = 'materia-key'
const oauthSecret = 'materia-secret'


const buildLTIStudent = user => ({
	lis_person_contact_email_primary: user.email,
	lis_person_name_family: user.lastName,
	lis_person_name_full: `${user.firstName} ${user.lastName}`,
	lis_person_name_given: user.firstName,
	lis_person_sourcedid: user.username,
	// @TODO get roles from obojobo?  Or should they be based on current 'veiw'?
	roles: ['Student'],
	user_id: user.id,
	user_image: user.avatarUrl
})

const buildLTIInstructor = user => ({
	lis_person_contact_email_primary: user.email,
	lis_person_name_family: user.lastName,
	lis_person_name_full: `${user.firstName} ${user.lastName}`,
	lis_person_name_given: user.firstName,
	lis_person_sourcedid: user.username,
	// @TODO get roles from obojobo?  Or should they be based on current 'veiw'?
	roles: ['Instructor'],
	user_id: user.id,
	user_image: user.avatarUrl
})

const ltiToolConsumer = {
	tool_consumer_info_product_family_code: 'obojobo-next',
	tool_consumer_instance_guid: 'next.obojobo.ucf.edu',
	tool_consumer_instance_name: 'University of Central Florida',
	tool_consumer_instance_url: 'https://obojobo.ucf.edu/'
}

// @TODO this should be the module!
const ltiContext = {
	context_id: 'S3294476',
	context_label: 'OBO4321',
	context_title: 'Obojobo Local Dev 101',
	context_type: 'CourseSection'
}

const defaultResourceLinkId = 'obojobo-dev-resource-id'
// util to get a baseUrl for inernal requests
// const baseUrl = req => `${req.protocol}://${req.get('host')}`
const baseUrl = req => `${req.protocol}://${req.get('host')}`

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
// throws error if it doesn't match
const verifyScorePassback = (req) => {
	// re-constitute the authorization headers into an object we can use
	const requestHeaders = req.headers.authorization.split(' ')[1].replace(/"/g, '').split(',').reduce((all, cur, i) => { return Object.assign({}, all, querystring.parse(cur))}, {} )

	// recreate the body hash by re-hashing it now
	const bodyHash = crypto.createHash('sha1').update(req.body).digest('base64')

	// fail fast, check if our body hash matches?
	if(bodyHash !== requestHeaders.oauth_body_hash) throw Error('Replace Result Body Hash Mismatch')

	// re-construct the headers
	const headers = {
		oauth_version: requestHeaders.oauth_version,
		oauth_nonce: requestHeaders.oauth_nonce,
		oauth_timestamp: requestHeaders.oauth_timestamp,
		oauth_consumer_key: requestHeaders.oauth_consumer_key,
		oauth_body_hash: bodyHash,
		oauth_signature_method: requestHeaders.oauth_signature_method
	}

	// re-sign everything
	const endpoint = `${baseUrl(req)}${req.originalUrl}`
	const hmac_sha1 = sig.generate('POST', endpoint, headers, oauthSecret, '', {encodeSignature: false})

	// they _should_ match!
	if(hmac_sha1 !== requestHeaders.oauth_signature){
		throw Error('Replace Result Body Hash Mismatch')
	}

	return true
}

const getValuesFromPassbackXML = async body => {
	const result = await xml2js.parseStringPromise(body, {normalize: true, normalizeTags: true, explicitArray: false})
	const messageID = result.imsx_poxenveloperequest.imsx_poxheader.imsx_poxrequestheaderinfo.imsx_messageidentifier
	const sourcedid = result.imsx_poxenveloperequest.imsx_poxbody.replaceresultrequest.resultrecord.sourcedguid.sourcedid
	const score = parseFloat(result.imsx_poxenveloperequest.imsx_poxbody.replaceresultrequest.resultrecord.result.resultscore.textstring) * 100

	return {
		messageID,
		sourcedid,
		score
	}
}

// receives scores passed back from the LTI Tool
router
	.route('/materia-lti-score-passback')
	.post(bodyParser.text({type: '*/*'}))
	.post(async (req, res) => {
		// @TODO store event for score passback
		// @TODO: put the score in a database!
		// @TODO: make the client aware that we've got a verifed score (or error!)
		console.log('passback heard!')
		let success = true

		try{
			verifyScorePassback(req)
			const {messageID, sourcedid, score} = await getValuesFromPassbackXML(req.body)

			console.log('SERVER RECEIVED A VALID SIGNED SCORE FROM MATERIA!!!')
			console.log(`Message ID: ${messageID}, sourcedid: ${sourcedid}, score: ${score}`)
 		} catch(e){
			console.log(e)
			success = false
		}

		res.type('application/xml');
		res.send(`<?xml version="1.0" encoding="UTF-8"?>
			<imsx_POXEnvelopeResponse xmlns = "http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
				<imsx_POXHeader>
					<imsx_POXResponseHeaderInfo>
						<imsx_version>V1.0</imsx_version>
						<imsx_messageIdentifier>4560</imsx_messageIdentifier>
						<imsx_statusInfo>
							<imsx_codeMajor>${success ? 'success' : 'failure'}</imsx_codeMajor>
							<imsx_severity>status</imsx_severity>
							<imsx_messageRefIdentifier>999999123</imsx_messageRefIdentifier>
							<imsx_operationRefIdentifier>replaceResult</imsx_operationRefIdentifier>
						</imsx_statusInfo>
					</imsx_POXResponseHeaderInfo>
				</imsx_POXHeader>
				<imsx_POXBody>
					<replaceResultResponse/>
				</imsx_POXBody>
			</imsx_POXEnvelopeResponse>`)
	})

// route to launch a materia widget
// the viewer component sends the widget url
// to this url and we build a page with all the params
// and signed oauth signature that the client's browser
// will post for us - taking them to the widget
router
	.route('/materia-lti-launch')
	.get([requireCurrentUser])
	.get((req, res) => {
		// @TODO store event for lti launch
		// @TODO validate input more, restrict to viewer launches
		const isPreview = req.query.isPreview === 'true'
		const method = 'POST'
		const endpoint = decodeURI(`${req.query.endpoint}`)
		const params = {
			lis_outcome_service_url: `${baseUrl(req)}/materia-lti-score-passback`,
			lti_message_type: 'basic-lti-launch-request',
			lis_result_sourcedid: '00000-00000',
			lti_version: 'LTI-1p0',
			resource_link_id: defaultResourceLinkId,
		}
		const user = req.query.isPreview === 'true' ? buildLTIInstructor(req.currentUser) : buildLTIStudent(req.currentUser)
		renderLtiLaunch({ ...user, ...params, ...ltiToolConsumer, ...ltiContext }, method, endpoint, res)
	})


https://docker.for.mac.localhost:8080/materia-lti-picker-return?embed_type=basic_lti&url=https://localhost/embed/P6q9Y/test


router
	.route('/materia-lti-picker-return')
	.get((req, res) => {
		// @TODO store event picker return
		// @TODO validate the message
		// @TODO check the params to re-associate with the current document
		// @TODO announce the selection to the editor somehow
		// @TODO conver to lti content item selection
		if(req.query.embed_type && req.query.url){
			res.type('text/html');
			res.send(`<html><head></head><body><script>
				parent.postMessage(${JSON.stringify(req.query)}, "${baseUrl(req)}");
			</script></body></html>`)
		}
	})



router
	.route('/materia-lti-picker-launch')
	.get([requireCurrentUser])
	.get((req, res) => {
		// @TODO store event for picker launch
		const method = 'POST'
		const endpoint = 'https://localhost/lti/picker'
		const params = {
			launch_presentation_return_url: `${baseUrl(req)}/materia-lti-picker-return`,
			lti_message_type: 'ContentItemSelectionRequest',
			lis_result_sourcedid: '00000-00000',
			lti_version: 'LTI-1p0',
			resource_link_id: defaultResourceLinkId,
		}
		renderLtiLaunch({ ...buildLTIInstructor(req.currentUser), ...params, ...ltiToolConsumer, ...ltiContext }, method, endpoint, res)
	})


module.exports = router
