let OutcomeDocument = require('ims-lti/lib/extensions/outcomes').OutcomeService
let HMAC_SHA1 = require('ims-lti/lib/hmac-sha1')
let config = oboRequire('config')
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

let findSecretForKey = (key) => {
	// locate a matching key/secret pair
	let keys = Object.keys(config.lti.keys)
	for (var i = keys.length - 1; i >= 0; i--) {
		if(keys[i] == key){
			return config.lti.keys[keys[i]]
		}
	}

	throw new Error(`LTI ERROR FINDING CONFIG FOR KEY: ${key}`);
};


// Returns a promise
let replaceResult = function(userId, draftId, score) {
	return retrieveLtiRequestBody(userId, draftId)
	.then( (result) => {
		let key = 'testkey' // @TODO: this key should be stored somewhere related to the lti data!
		let ltiBody = result.data;
		let outcomeDocument = new OutcomeDocument({
			body: {
				lis_outcome_service_url: ltiBody.lis_outcome_service_url,
				lis_result_sourcedid: ltiBody.lis_result_sourcedid
			},
			consumer_key: key,
			consumer_secret: findSecretForKey(key),
			signer: new HMAC_SHA1()
		})

		return new Promise((resolve, reject) => {
			outcomeDocument.send_replace_result(score, (err, result) =>{
				if(err) reject(err)
				console.log(`LTI SCORE SET to ${score} for ${userId} on ${ltiBody.lis_result_sourcedid}`)
				resolve(result)
			})
		})
	})
	.catch( (error) => {
		console.log('replaceResult error!', error)
		return Promise.reject(error)
	})
}

module.exports = {
	replaceResult: replaceResult,
	findSecretForKey: findSecretForKey
}
