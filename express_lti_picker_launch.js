let insertEvent = oboRequire('insert_event')
let User = oboRequire('models/user')
let logger = oboRequire('logger')

let storeLtiPickerLaunch = (user, ip, ltiBody, ltiConsumerKey) => {
	// Insert Event
	return insertEvent({
		action: 'lti:pickerLaunch',
		actorTime: new Date().toISOString(),
		payload: {},
		userId: user.id,
		ip: ip,
		metadata: {},
		eventVersion: '1.0.0',
		draftId: null
	})
}

// LTI launch detection (req.lti is created by express-ims-lti)
// This middleware will create and register a user if there is one
// If a launch is happening, this will overwrite the current user
module.exports = (req, res, next) => {
	if (!req.lti) return next() // bypass, no lti launch data
	let currentUser = null

	return Promise.resolve(req.lti)
		.then(lti => {
			// Save/Create the user
			let newUser = new User({
				username: lti.body.lis_person_sourcedid,
				email: lti.body.lis_person_contact_email_primary,
				firstName: lti.body.lis_person_name_given,
				lastName: lti.body.lis_person_name_family,
				roles: lti.body.roles
			})
			return newUser.saveOrCreate()
		})
		.then(user => {
			// Set the current user
			currentUser = user
			req.setCurrentUser(currentUser)

			return storeLtiPickerLaunch(
				currentUser,
				req.connection.remoteAddress,
				req.lti.body,
				req.lti.consumer_key
			)
		})
		.then(launchResult => next())
		.catch(error => {
			logger.error('LTI Picker Launch Error', error)
			logger.error('LTI Body', req.lti && req.lti.body ? req.lti.body : 'No LTI Body')

			next(new Error('There was a problem creating your account.'))
		})
}
