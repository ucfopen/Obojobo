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


const buildLTIPerson = user => ({
	lis_person_contact_email_primary: user.email,
	lis_person_name_family: user.lastName,
	lis_person_name_full: `${user.firstName} ${user.lastName}`,
	lis_person_name_given: user.firstName,
	lis_person_sourcedid: user.username,
	roles: ['Learner'],
	user_id: user.id,
	user_image: user.avatarUrl
})

const ltiToolConsumer = {
	tool_consumer_info_product_family_code: 'obojobo-next',
	tool_consumer_instance_guid: 'next.obojobo.ucf.edu',
	tool_consumer_instance_name: 'University of Central Florida',
	tool_consumer_instance_url: 'https://obojobo.ucf.edu/'
}

const ltiContext = {
	context_id: 'S3294476',
	context_label: 'OBO4321',
	context_title: 'Obojobo Local Dev 101',
	context_type: 'CourseSection'
}

const defaultResourceLinkId = 'obojobo-dev-resource-id'
// util to get a baseUrl for inernal requests
// const baseUrl = req => `${req.protocol}://${req.get('host')}`
const baseUrl = req => `https://docker.for.mac.localhost:8080`

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

const materiaUrl = 'http://localhost'

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

router
	.route('/materia-lti-score-passback')
	.post(bodyParser.text({type: '*/*'}))
	.post(async (req, res) => {
		console.log('passback heard!')
		let success = true

		try{
			verifyScorePassback(req)
			const {messageID, sourcedid, score} = await getValuesFromPassbackXML(req.body)

			console.log('SERVER RECEIVED A VALID SIGNED SCORE FROM MATERIA!!!')
			console.log(`Message ID: ${messageID}, sourcedid: ${sourcedid}, score: ${score}`)
			// @TODO: put the score in a database!
			// @TODO: make the client aware that we've got a verifed score (or error!)
			// @TODO: we may have found a Canvas security flaw - if you don't send a key, it may not validate the hash!
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

router
	.route('/materia-lti-launch')
	.get([requireCurrentUser])
	.get((req, res) => {
		const method = 'POST'
		const endpoint = decodeURI(`${req.query.endpoint}`)
		const params = {
			lis_outcome_service_url: `${baseUrl(req)}/materia-lti-score-passback`,
			lti_message_type: 'basic-lti-launch-request',
			lis_result_sourcedid: '00000-00000',
			lti_version: 'LTI-1p0',
			resource_link_id: defaultResourceLinkId,
		}
		renderLtiLaunch({ ...buildLTIPerson(req.currentUser), ...params, ...ltiToolConsumer, ...ltiContext }, method, endpoint, res)
	})


module.exports = router
