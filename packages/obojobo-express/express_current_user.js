let User = oboRequire('models/user')
let GuestUser = oboRequire('models/guest_user')
let logger = oboRequire('logger')

let setCurrentUser = (req, user) => {
	if (!(user instanceof User)) throw new Error('Invalid User for Current user')
	req.session.currentUserId = user.id
}

let resetCurrentUser = req => {
	req.session.currentUserId = null
	req.currentUser = null
}

// returns a Promise!!!
let getCurrentUser = (req, isRequired = false) => {
	// return early if already verified
	if (req.currentUser) return Promise.resolve(req.currentUser)

	// no session data
	// if isRequired returns a promise rejection
	// if not require, resovles with a GuestUser
	if (!req.session || !req.session.currentUserId) {
		if (isRequired) {
			logger.warn(
				'No Session or Current User?',
				req.session instanceof Object,
				req.session.currentUserId
			)
			return Promise.reject(new Error('Login Required'))
		}
		return Promise.resolve(new GuestUser())
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
			return Promise.resolve(new GuestUser())
		})
}

// sugar for getCurrentUser(true)
let requireCurrentUser = req => req.getCurrentUser(true)

module.exports = (req, res, next) => {
	req.setCurrentUser = setCurrentUser.bind(this, req)
	req.getCurrentUser = getCurrentUser.bind(this, req)
	req.requireCurrentUser = requireCurrentUser.bind(this, req)
	req.resetCurrentUser = resetCurrentUser.bind(this, req)
	next()
}
