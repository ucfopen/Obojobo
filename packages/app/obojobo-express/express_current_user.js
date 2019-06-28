const User = oboRequire('models/user')
const GuestUser = oboRequire('models/guest_user')
const logger = oboRequire('logger')

const setCurrentUser = (req, user) => {
	if (!(user instanceof User)) throw new Error('Invalid User for Current user')
	req.session.currentUserId = user.id
}

const resetCurrentUser = req => {
	req.session.currentUserId = null
	req.currentUser = null
}

const resovleWithNewGuest = req => {
	req.currentUser = new GuestUser()
	return Promise.resolve(req.currentUser)
}

// returns a Promise!!!
const getCurrentUser = (req, isRequired = false) => {
	// return early if already verified
	if (req.currentUser) return Promise.resolve(req.currentUser)

	// no session data
	// if isRequired returns a promise rejection
	// if not require, resolves with a GuestUser
	if (!req.session || !req.session.currentUserId) {
		if (isRequired) {
			logger.warn(
				'No Session or Current User?',
				req.session instanceof Object,
				req.session.currentUserId
			)
			return Promise.reject(new Error('Login Required'))
		}
		return resovleWithNewGuest(req)
	}

	// fetch user from database using session data for the user id
	return User.fetchById(req.session.currentUserId)
		.then(user => {
			req.currentUser = user
			return user
		})
		.catch(err => {
			logger.warn('getCurrentUser', err)
			if (isRequired) return Promise.reject(new Error('Login Required'))
			return resovleWithNewGuest(req)
		})
}

// sugar for getCurrentUser(true)
const requireCurrentUser = req => req.getCurrentUser(true)

const saveSessionPromise = req => {
	return new Promise((resolve, reject) => {
		req.session.save(err => {
			if (err) return reject(err)
			resolve()
		})
	})
}

module.exports = (req, res, next) => {
	req.setCurrentUser = setCurrentUser.bind(this, req)
	req.getCurrentUser = getCurrentUser.bind(this, req)
	req.requireCurrentUser = requireCurrentUser.bind(this, req)
	req.resetCurrentUser = resetCurrentUser.bind(this, req)
	req.saveSessionPromise = saveSessionPromise.bind(this, req)
	next()
}
