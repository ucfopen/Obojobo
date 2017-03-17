let OutcomeDocument = require('ims-lti/lib/extensions/outcomes').OutcomeService
let HMAC_SHA1 = require('ims-lti/lib/hmac-sha1')



let db = require('./db')

let retrieveLtiRequestBody = function(userId, draftId) {
	return db.one(`
		SELECT data
		FROM launches
		WHERE user_id = $[userId]
		AND draft_id = $[draftId]
		AND type = 'lti'
		ORDER BY created_at DESC
		LIMIT 1
	`, {
		userId: userId,
		draftId: draftId
	})
}

let replaceResult = function(userId, draftId, score, callback) {
	let ltiBody = retrieveLtiRequestBody(userId, draftId)
	.then( (result) => {


		let ltiBody = result.data

		console.log('ltiBody', ltiBody.lis_outcome_service_url)

		let outcomeDocument = new OutcomeDocument({
			body: {
				lis_outcome_service_url: ltiBody.lis_outcome_service_url,
				lis_result_sourcedid: ltiBody.lis_result_sourcedid
			},
			consumer_key: 'testkey',
			consumer_secret: 'testsecret',
			signer: new HMAC_SHA1()
		})
		// console.log('XXXXXXXXx', x)
		outcomeDocument.send_replace_result(score, callback)
	})
	.catch( (error) => {
		console.log('error', error)
	})




	// let ltiBody = retrieveLtiRequestBody(userId, draftId)
	// let provider = getValidatedProvider(ltiBody)



	// // if(!provider) ...

	// console.log('-->', provider.outcome_service)

	// provider.outcome_service.send_replace_result(score, function(err, result) {
	// 	callback(err, result);
	// })
}

// let getValidatedProvider = function(req) {
// 	let provider = new lti.Provider('key', 'secret')

// 	provider.valid_request(req, function(err, isValid) {
// 		if(!isValid || !provider.outcome_service) return false
// 	})

// 	return provider
// }

module.exports = {
	replaceResult: replaceResult
}