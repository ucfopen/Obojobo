const db = oboRequire('server/db')
const insertEvent = oboRequire('server/insert_event')
const User = oboRequire('server/models/user')
const config = oboRequire('server/config')
const logger = oboRequire('server/logger')
const createCaliperEvent = oboRequire('server/routes/api/events/create_caliper_event')
const { ACTOR_USER } = oboRequire('server/routes/api/events/caliper_constants')
const oboEvents = oboRequire('server/obo_events')

const saveSessionPromise = req =>
	new Promise((resolve, reject) => {
		req.session.save(error => {
			if (error) reject(error)
			else resolve()
		})
	})

const storeLtiLaunch = (draftDocument, user, ip, ltiBody, ltiConsumerKey) => {
	let launchId = null

	return db
		.one(
			`
		INSERT INTO launches
		(draft_id, draft_content_id, user_id, type, lti_key, data)
		VALUES ($[draftId], $[contentId], $[userId], 'lti', $[ltiConsumerKey], $[ltiBody])
		RETURNING id`,
			{
				draftId: draftDocument.draftId,
				contentId: draftDocument.contentId,
				userId: user.id,
				ltiConsumerKey,
				ltiBody
			}
		)
		.then(result => {
			launchId = result.id

			// Insert Event
			return insertEvent({
				action: 'lti:launch',
				actorTime: new Date().toISOString(),
				isPreview: false,
				payload: { launchId },
				userId: user.id,
				ip,
				metadata: {},
				eventVersion: '1.0.0',
				draftId: draftDocument.draftId,
				contentId: draftDocument.contentId
			})
		})
		.then(() => {
			return launchId
		})
}

const storeLtiPickerLaunchEvent = (user, ip, ltiBody, ltiConsumerKey, hostname) => {
	const { createLTIPickerEvent } = createCaliperEvent(null, hostname)

	return insertEvent({
		action: 'lti:pickerLaunch',
		actorTime: new Date().toISOString(),
		isPreview: false,
		payload: {
			ltiBody,
			ltiConsumerKey
		},
		userId: user.id,
		ip,
		metadata: {},
		eventVersion: '1.0.0',
		draftId: null,
		contentId: null,
		caliperPayload: createLTIPickerEvent({
			actor: {
				type: ACTOR_USER,
				id: user.id
			}
		})
	})
}

// creates / loads user based on lti launch data
// clears all previous sesions created for this user
// saves the current user id to the session
const userFromLaunch = (req, ltiBody) => {
	const username = ltiBody[config.lti.usernameParam]
		? ltiBody[config.lti.usernameParam]
		: ltiBody.user_id
	// Save/Create the user
	const newUser = new User({
		username,
		email: ltiBody.lis_person_contact_email_primary,
		firstName: ltiBody.lis_person_name_given,
		lastName: ltiBody.lis_person_name_family,
		roles: ltiBody.roles
	})

	return newUser
		.saveOrCreate()
		.then(() => {
			// if the user wasn't already logged in here
			// invalidate all other sessions for this user
			// prevents clearing the current session
			// eslint-disable-next-line eqeqeq
			if (!req.currentUser || req.currentUser.id != newUser.id) {
				return User.clearSessionsForUserById(newUser.id)
			}
		})
		.then(() => {
			req.setCurrentUser(newUser)
			return saveSessionPromise(req)
		})
		.then(() => {
			oboEvents.emit('server:lti:user_launch', newUser)
		})
		.then(() => newUser)
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

	return Promise.resolve(req.lti)
		.then(lti => userFromLaunch(req, lti.body))
		.then(() => req.requireCurrentDocument())
		.then(() => {
			return storeLtiLaunch(
				req.currentDocument,
				req.currentUser,
				req.connection.remoteAddress,
				req.lti.body,
				req.lti.consumer_key
			)
		})
		.then(launchId => {
			req.oboLti = {
				launchId,
				body: req.lti.body
			}

			next()
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
		.then(() => next())
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
				req.lti.consumer_key,
				req.hostname
			)
		})
		.then(() => next())
		.catch(error => {
			logger.error('LTI Picker Launch Error', error)
			logger.error('LTI Body', req.lti && req.lti.body ? req.lti.body : 'No LTI Body')

			next(new Error('There was a problem creating your account.'))
		})
}
