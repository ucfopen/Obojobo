const User = oboRequire('models/user')
const GuestUser = oboRequire('models/guest_user')
const logger = oboRequire('logger')

const setCurrentUser = (req, user) => {
	if (!(user instanceof User)) throw new Error('Invalid User for Current user')
	req.session.currentUserId = user.id
	req.currentUser = user
}

const resetCurrentUser = req => {
	req.session.currentUserId = null
	req.currentUser = null
}

// returns the current user
// if there is no user in the session, returns a new guest by default
const getCurrentUser = async (req, errorIfMissing = false) => {
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
		if (errorIfMissing) throw new Error('Login Required')
		req.currentUser = new GuestUser()
	}

	return req.currentUser
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
