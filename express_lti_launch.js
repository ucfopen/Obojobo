let db = oboRequire('db')
let insertEvent = oboRequire('insert_event')
let User = oboRequire('models/user')
let logger = oboRequire('logger')

let storeLtiLaunch = (draftId, user, ip, ltiBody, ltiConsumerKey) => {
	return db
		.one(
			`
		INSERT INTO launches
		(draft_id, user_id, type, link, lti_key, data)
		VALUES ($[draftId], $[userId], 'lti', $[link], $[lti_key], $[data])
		RETURNING id`,
			{
				draftId: draftId,
				userId: user.id,
				link: '',
				lti_key: ltiConsumerKey,
				data: ltiBody
			}
		)
		.then(result => {
			// Insert Event
			return insertEvent({
				action: 'lti:launch',
				actorTime: new Date().toISOString(),
				payload: { launchId: result.id },
				userId: user.id,
				ip: ip,
				metadata: {},
				draftId: draftId
			})
		})
}

// LTI launch detection (req.lti is created by express-ims-lti)
// This middleware will create and register a user if there is one
// This will also try to register the launch information if there is any
// If a launch is happening, this will overwrite the current user
module.exports = (req, res, next) => {
	if (!req.lti) return next() // bypass, no lti launch data
	req.session.lti = null // clean req.session.lti created by express-ims-lti, it's problematic for multiple launches
	let currentUser = null

	// allows launches to redirect /view/example to /view/00000000-0000-0000-0000-000000000000
	// the actual redirect happens in the route, this just handles the lti launch
	let draftId =
		req.params.draftId === 'example' ? '00000000-0000-0000-0000-000000000000' : req.params.draftId

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

			return storeLtiLaunch(
				draftId,
				currentUser,
				req.connection.remoteAddress,
				req.lti.body,
				req.lti.consumer_key
			)
		})
		.then(createdAt => {
			return next()
		})
		.catch(error => {
			logger.error('LTI Launch Error', error)
			logger.error('LTI Body', req.lti && req.lti.body ? req.lti.body : 'No LTI Body')
			next(new Error('There was a problem creating your account.'))
		})
}
