const User = oboRequire('server/models/user')
const GuestUser = oboRequire('server/models/guest_user')
const logger = oboRequire('server/logger')

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

module.exports = (req, res, next) => {
	req.setCurrentUser = setCurrentUser.bind(this, req)
	req.getCurrentUser = getCurrentUser.bind(this, req)
	req.requireCurrentUser = requireCurrentUser.bind(this, req)
	req.resetCurrentUser = resetCurrentUser.bind(this, req)
	req.saveSessionPromise = saveSessionPromise.bind(this, req)
	next()
}
