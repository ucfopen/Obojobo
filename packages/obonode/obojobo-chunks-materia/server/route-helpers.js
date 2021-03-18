const querystring = require('querystring')
const logger = require('obojobo-express/server/logger')
const xml2js = require('xml2js')
const crypto = require('crypto')
const config = require('obojobo-express/server/config').materiaLti
const sig = require('oauth-signature')

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

const ltiContextFromDocument = draft => ({
	context_id: draft.draftId,
	context_title: draft.getTitle(),
	context_type: 'CourseSection'
})

// create compound ids for materia
const expandLisResultSourcedId = lisResultSourcedId => {
	const [visitId, nodeId] = lisResultSourcedId.split('__')
	return { visitId, nodeId }
}

const buildLTIStudent = user => ({ ...buildLTIUser(user), roles: ['Student'] })

const buildLTIInstructor = user => ({ ...buildLTIUser(user), roles: ['Instructor'] })

const ltiToolConsumer = baseUrl => ({
	tool_consumer_info_product_family_code: config.oboFamilyCode,
	tool_consumer_instance_guid: config.oboGuid,
	tool_consumer_instance_name: config.oboName,
	tool_consumer_instance_url: baseUrl
})

const widgetLaunchParams = (document, visit, user, materiaOboNodeId, baseUrl) => {
	const params = {
		lti_message_type: 'basic-lti-launch-request',
		lti_version: 'LTI-1p0',
		// materia will send scores here
		lis_outcome_service_url: `${baseUrl}/materia-lti-score-passback`,
		// represents the container for the user's score this widget can set/update
		lis_result_sourcedid: `${visit.id}__${materiaOboNodeId}`,
		// unique placement of this widget (take into account the module's unique placement in a course + the widget's place in the module)
		// we are intentionally not including user id (not part of the placement) or draft_content_id (to allow updates to a module)
		resource_link_id: `${visit.resource_link_id}__${visit.draft_id}__${materiaChunkId}`,
		custom_obo_node_id: materiaOboNodeId,
		custom_visit_id: visit.id,
		custom_draft_id: visit.draft_id,
		custom_draft_content_id: visit.draft_content_id,
		custom_passthrough_resource_link_id: visit.resource_link_id
	}

	// materia currently uses context_id to group scores and attempts
	// obojobo doesn't support materia as scoreable questions yet, so the key in use here is intended to:
	// * support materia in content pages
	// * re lti launch will reset scores/attempts
	// * browser reload of the window will resume an attempt/score window
	// a visit id is a representation of: user_id + lti launch + draft_id + draft_content_id
	const overrideKeys = { context_id: params.resource_link_id }

	const ltiUser = visit.is_preview ? buildLTIInstructor(user) : buildLTIStudent(user)
	return {
		...ltiUser,
		...params,
		...ltiToolConsumer(baseUrl),
		...ltiContextFromDocument(document),
		...overrideKeys
	}
}

const contentSelectionParams = (document, materiaChunkId, user, clientBaseUrl, serverBaseUrl) => {
	const params = {
		lti_message_type: 'ContentItemSelectionRequest',
		lti_version: 'LTI-1p0',
		accept_media_types: 'application/vnd.ims.lti.v1.ltiassignment',
		accept_presentation_document_targets: 'iframe',
		accept_unsigned: true,
		accept_multiple: false,
		accept_copy_advice: false,
		auto_create: false,
		content_item_return_url: `${clientBaseUrl}/materia-lti-picker-return`,
		data: `draftId=${document.draftId}&contentId=${document.contentId}&nodeId=${materiaChunkId}`
	}

	return {
		...buildLTIInstructor(user),
		...params,
		...ltiToolConsumer(serverBaseUrl),
		...ltiContextFromDocument(document)
	}
}

const getValuesFromPassbackXML = async body => {
	const result = await xml2js.parseStringPromise(body, {
		normalize: true,
		normalizeTags: true,
		explicitArray: false
	})
	const messageId =
		result.imsx_poxenveloperequest.imsx_poxheader.imsx_poxrequestheaderinfo.imsx_messageidentifier
	const sourcedId =
		result.imsx_poxenveloperequest.imsx_poxbody.replaceresultrequest.resultrecord.sourcedguid
			.sourcedid
	const score =
		parseFloat(
			result.imsx_poxenveloperequest.imsx_poxbody.replaceresultrequest.resultrecord.result
				.resultscore.textstring
		) * 100

	return {
		messageId,
		sourcedId,
		score
	}
}

// extract request headers into an object we can use
const extractAuthHeaders = headers => {
	if (!headers || !headers.authorization) {
		throw Error('Authorization header missing from score passback request')
	}
	return headers.authorization
		.split(' ')[1]
		.replace(/"/g, '')
		.split(',')
		.reduce((all, cur) => {
			return Object.assign({}, all, querystring.parse(cur))
		}, {})
}

const verifyBodyHash = (body, expectedHash) => {
	const bodyHash = crypto
		.createHash('sha1')
		.update(body)
		.digest('base64')
	// check if our body hash matches
	if (bodyHash !== expectedHash) {
		logger.info('Materia Body Hash Mismatch')
		logger.info(body)
		logger.info(`calculated hash ${bodyHash} expected hash ${expectedHash}`)
		throw Error('Materia Body Hash Mismatch')
	}

	return bodyHash
}

const verifyAuthSignature = (endpoint, authHeaders, bodyHash) => {
	// re-construct the headers so we can sign them
	const headers = {
		oauth_version: authHeaders.oauth_version,
		oauth_nonce: authHeaders.oauth_nonce,
		oauth_timestamp: authHeaders.oauth_timestamp,
		oauth_consumer_key: authHeaders.oauth_consumer_key,
		oauth_body_hash: bodyHash,
		oauth_signature_method: authHeaders.oauth_signature_method
	}

	// sign oauth headers with our secret
	const hmac_sha1 = sig.generate('POST', endpoint, headers, config.oauthSecret, '', {
		encodeSignature: false
	})

	// check our signature against the one we received
	if (hmac_sha1 !== authHeaders.oauth_signature) {
		logger.error('Materia Replace Result Header oAuth Signature Mismatch')
		logger.info(headers)
		logger.info(endpoint)
		logger.info(hmac_sha1)
		throw Error('Materia Replace Result Header oAuth Signature Mismatch')
	}

	return true
}

// check the bodyHash of an LTI 1 score passback to verify
// it matches when hashed with the secret we have locally
// returns true when matching, false when it fails verification
const verifyScorePassback = (headers, body, originalUrl, baseUrl) => {
	try {
		const authHeaders = extractAuthHeaders(headers)

		// verify all the required properties exist in auth header
		const requiredKeys = [
			'oauth_body_hash',
			'oauth_version',
			'oauth_timestamp',
			'oauth_nonce',
			'oauth_consumer_key',
			'oauth_signature_method',
			'oauth_signature'
		]

		requiredKeys.forEach(key => {
			if (!authHeaders[key]) throw Error(`LTI score passback authorization header missing "${key}"`)
		})

		const bodyHash = verifyBodyHash(body, authHeaders.oauth_body_hash)

		const endpoint = `${baseUrl}${originalUrl}`
		return verifyAuthSignature(endpoint, authHeaders, bodyHash)
	} catch (e) {
		logger.error('Materia score passback verification error')
		logger.error(e)
		return false
	}
}

const createPassbackResult = ({ success, messageId, messageRefId }) => {
	return `<?xml version="1.0" encoding="UTF-8"?>
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
		</imsx_POXEnvelopeResponse>`
}

const signLtiParams = (params, method, endpoint) => {
	// add the required oauth params to the given prams
	const oauthParams = {
		oauth_nonce: Math.round(new Date().getTime() / 1000.0),
		oauth_timestamp: Math.round(new Date().getTime() / 1000.0),
		oauth_callback: 'about:blank',
		oauth_consumer_key: config.oauthKey,
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version: '1.0'
	}
	const result = { ...params, ...oauthParams }
	const hmac_sha1 = sig.generate(method, endpoint, result, config.oauthSecret, '', {
		encodeSignature: false
	})
	result['oauth_signature'] = hmac_sha1
	return result
}

module.exports = {
	contentSelectionParams,
	widgetLaunchParams,
	expandLisResultSourcedId,
	createPassbackResult,
	getValuesFromPassbackXML,
	verifyScorePassback,
	signLtiParams
}
