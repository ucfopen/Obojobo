const User = oboRequire('server/models/user')
const GuestUser = oboRequire('server/models/guest_user')
const logger = oboRequire('server/logger')
const viewerNotificationState = oboRequire('server/viewer/viewer_notification_state')
const viewerState = oboRequire('server/viewer/viewer_state')

const setCurrentUser = (req, user) => {
	if (!(user instanceof User)) throw new Error('Invalid User for Current user')
	req.session.currentUserId = user.id
	req.currentUser = user
}

const resetCurrentUser = req => {
	req.session.currentUserId = null
	req.currentUser = null
}

// returns the current user or a guest user
const getCurrentUser = async req => {
	// return early if already verified
	if (req.currentUser) return req.currentUser

	try {
		if (req.session && req.session.currentUserId) {
			req.currentUser = await User.fetchById(req.session.currentUserId)
		}
	} catch (err) {
		logger.warn('getCurrentUser', err)
	}

	if (!req.currentUser) {
		req.currentUser = new GuestUser()
	}

	return req.currentUser
}

// throws an error if:
// A: currentUser ISNT a instance of USER
// OR B: currentUser IS a guest
const requireCurrentUser = async req => {
	const user = await req.getCurrentUser()

	// isn't a user or is a guest?
	if (!(user instanceof User) || user.isGuest()) {
		throw new Error('Login Required')
	}

	return user
}

const saveSessionPromise = req => {
	return new Promise((resolve, reject) => {
		req.session.save(err => {
			if (err) return reject(err)
			resolve()
		})
	})
}

//retrieve notifications from the database and set them in the cookie
const getNotifications = async (req, res) => {
	return Promise.all([viewerState.get(req.currentUserId)])
		.then(() => viewerNotificationState.getRecentNotifications(req.currentUser.lastLogin))
		.then(result => {
			if (result) {
				return result.map(notifications => notifications.id)
			}
			return [0]
		})
		.then(ids => {
			if (ids.some(id => id !== 0)) {
				return viewerNotificationState.getNotifications(ids.filter(id => id !== 0))
			}
		})
		.then(result => {
			if (result) {
				const parsedNotifications = result.map(notifications => ({
					title: notifications.title,
					text: notifications.text
				}))
				res.cookie('notifications', JSON.stringify(parsedNotifications))
			}
			return 0
		})
		.then(() => {
			const today = new Date()
			req.currentUser.lastLogin = today
			viewerNotificationState.setLastLogin(req.currentUser.id, today)
		})
}

module.exports = (req, res, next) => {
	req.setCurrentUser = setCurrentUser.bind(this, req)
	req.getCurrentUser = getCurrentUser.bind(this, req)
	req.requireCurrentUser = requireCurrentUser.bind(this, req)
	req.resetCurrentUser = resetCurrentUser.bind(this, req)
	req.saveSessionPromise = saveSessionPromise.bind(this, req)
	req.getNotifications = getNotifications.bind(this, req, res)
	next()
}
