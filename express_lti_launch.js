let db = oboRequire('db')
let insertEvent = oboRequire('insert_event')
let User = oboRequire('models/user')
let Draft = oboRequire('models/draft')
let logger = oboRequire('logger')

let storeLtiLaunch = (draft, user, ip, ltiBody, ltiConsumerKey) => {
	let insertLaunchResult = null

	return db
		.one(
			`
		INSERT INTO launches
		(draft_id, user_id, type, lti_key, data)
		VALUES ($[draftId], $[userId], 'lti', $[lti_key], $[data])
		RETURNING id`,
			{
				draftId: draft.draftId,
				userId: user.id,
				lti_key: ltiConsumerKey,
				data: ltiBody
			}
		)
		.then(result => {
			insertLaunchResult = result

			// Insert Event
			return insertEvent({
				action: 'lti:launch',
				actorTime: new Date().toISOString(),
				payload: { launchId: insertLaunchResult.id },
				userId: user.id,
				ip: ip,
				metadata: {},
				eventVersion: '1.0.0',
				draftId: draft.draftId,
				contentId: draft.contentId
			})
		})
		.then(() => {
			return insertLaunchResult
		})
}

let storeLtiPickerLaunchEvent = (user, ip, ltiBody, ltiConsumerKey) => {
	return insertEvent({
		action: 'lti:pickerLaunch',
		actorTime: new Date().toISOString(),
		payload: {
			ltiBody,
			ltiConsumerKey
		},
		userId: user.id,
		ip: ip,
		metadata: {},
		eventVersion: '1.0.0',
		draftId: null,
		contentId: null
	})
}

let userFromLaunch = (req, ltiBody) => {
	// Save/Create the user
	let newUser = new User({
		username: ltiBody.lis_person_sourcedid,
		email: ltiBody.lis_person_contact_email_primary,
		firstName: ltiBody.lis_person_name_given,
		lastName: ltiBody.lis_person_name_family,
		roles: ltiBody.roles
	})

	return newUser.saveOrCreate().then(user => {
		req.setCurrentUser(user)
		return user
	})
}

let draftFromLaunch = (req, draftId) => {
	return Draft.fetchById(draftId).then(draft => {
		req.setCurrentDraft(draft)
		return draft
	})
}

// LTI launch detection (req.lti is created by express-ims-lti)
// This middleware will create and register a user if there is one
// This will also try to register the launch information if there is any
// If a launch is happening, this will overwrite the current user
exports.assignment = (req, res, next) => {
	if (!req.lti) {
		next()
		return Promise.resolve()
	}

	// allows launches to redirect /view/example to /view/00000000-0000-0000-0000-000000000000
	// the actual redirect happens in the route, this just handles the lti launch
	let draftId =
		req.params.draftId === 'example' ? '00000000-0000-0000-0000-000000000000' : req.params.draftId
	let user

	return Promise.resolve(req.lti)
		.then(lti => userFromLaunch(req, lti.body))
		.then(launchUser => {
			user = launchUser
			return draftFromLaunch(req, draftId)
		})
		.then(draft => {
			return storeLtiLaunch(
				draft,
				user,
				req.connection.remoteAddress,
				req.lti.body,
				req.lti.consumer_key
			)
		})
		.then(launchResult => {
			req.oboLti = {
				launchId: launchResult.id,
				body: req.lti.body
			}

			return next()
		})
		.catch(error => {
			logger.error('LTI Launch Error', error)
			logger.error('LTI Body', req.lti && req.lti.body ? req.lti.body : 'No LTI Body')

			next(new Error('There was a problem creating your account.'))
		})
}

exports.courseNavlaunch = (req, res, next) => {
	if (!req.lti) {
		next()
		return Promise.resolve()
	}

	return Promise.resolve(req.lti)
		.then(lti => userFromLaunch(req, lti.body))
		.then(user => next())
		.catch(error => {
			logger.error('LTI Nav Launch Error', error)
			logger.error('LTI Body', req.lti && req.lti.body ? req.lti.body : 'No LTI Body')
			next(new Error('There was a problem creating your account.'))
		})
}

// LTI launch detection (req.lti is created by express-ims-lti)
// This middleware will create and register a user if there is one
// If a launch is happening, this will overwrite the current user
exports.assignmentSelection = (req, res, next) => {
	if (!req.lti) {
		next()
		return Promise.resolve()
	}

	return Promise.resolve(req.lti)
		.then(lti => userFromLaunch(req, lti.body))
		.then(user => {
			return storeLtiPickerLaunchEvent(
				user,
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
