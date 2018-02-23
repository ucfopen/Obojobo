let OutcomeDocument = require('ims-lti/lib/extensions/outcomes').OutcomeService
let HMAC_SHA1 = require('ims-lti/lib/hmac-sha1')
let config = oboRequire('config')
let db = require('./db')
let moment = require('moment')
let insertEvent = oboRequire('insert_event')
let logger = oboRequire('logger')

let retrieveLtiRequestData = function(userId, draftId) {
	return db.one(
		`
		SELECT id, data, lti_key
		FROM launches
		WHERE user_id = $[userId]
		AND draft_id = $[draftId]
		AND type = 'lti'
		AND created_at > $[oldestLaunchDate]
		ORDER BY created_at DESC
		LIMIT 1
	`,
		{
			userId: userId,
			draftId: draftId,
			oldestLaunchDate: moment()
				.subtract(5, 'hours')
				.toISOString()
		}
	)
}

let findSecretForKey = key => {
	// locate a matching key/secret pair
	let keys = Object.keys(config.lti.keys)
	for (var i = keys.length - 1; i >= 0; i--) {
		if (keys[i] == key) {
			return config.lti.keys[keys[i]]
		}
	}

	throw new Error(`LTI ERROR FINDING CONFIG FOR KEY: ${key}`)
}

/* Returns a Promise<boolean>
   Resolves with Boolean - the result was sent to the outcome service
   Rejects with Error Object only when we tried to send to the service and it failed
*/
let replaceResult = function(userId, draftId, score) {
	let ltiBody
	let ltiReqData

	return retrieveLtiRequestData(userId, draftId)
		.then(ltiReqData => {
			// locate the outcome service, if it doesnt exist, just don't do anything
			if (!ltiReqData.data.lis_outcome_service_url) {
				logger.info(`No outcome service for user: ${userId} on draft ${draftId}`)
				return Promise.resolve(false) // false indicates the score wasn't sent
			}

			// Launch found, try to send the score to the outcome service
			// wrap send_replace_result in a promise
			return new Promise((resolve, reject) => {
				ltiBody = ltiReqData.data
				let ltiLaunchKey = ltiReqData.lti_key
				let outcomeDocument = new OutcomeDocument({
					body: {
						lis_outcome_service_url: ltiBody.lis_outcome_service_url,
						lis_result_sourcedid: ltiBody.lis_result_sourcedid
					},
					consumer_key: ltiLaunchKey,
					consumer_secret: findSecretForKey(ltiLaunchKey),
					signer: new HMAC_SHA1()
				})

				logger.info(
					`SETTING LTI OUTCOME SCORE SET to ${score} for user: ${userId} on sourcedid: ${ltiBody.lis_result_sourcedid} using key: ${ltiLaunchKey}`
				)

				outcomeDocument.send_replace_result(score, (err, result) => {
					if (err) reject(err)
					else resolve(result)

					insertEvent({
						action: 'lti:replaceResult',
						actorTime: new Date().toISOString(),
						actor: 'serverApp',
						payload: {
							launchId: ltiReqData.id,
							launchKey: ltiLaunchKey,
							body: {
								lis_outcome_service_url: ltiBody.lis_outcome_service_url,
								lis_result_sourcedid: ltiBody.lis_result_sourcedid
							},
							score: score,
							result: result,
							error: err
						},
						userId: userId,
						ip: '',
						eventVersion: '1.0.0',
						metadata: {},
						draftId: draftId
					}).catch(err => {
						logger.error('There was an error inserting the lti event')
					})
				})
			}).catch(error => {
				// catch errors sending to the outcome service
				logger.error('replaceResult error!', error)
				return Promise.reject({ fatal: true })
			})
		})
		.catch(error => {
			// Fail if sending the score failed
			logger.warn('LTI replaceResult Error', error)

			if (error && error.fatal) {
				return Promise.reject(Error(`Unable to send score to LMS`))
			}

			// just continue if theres no launch data for this score
			logger.info(`No Relevent LTI Request found for user ${userId}, on ${draftId}`)
			return Promise.resolve(false)
		})
}

module.exports = {
	replaceResult: replaceResult,
	findSecretForKey: findSecretForKey
}
