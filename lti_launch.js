var db = oboRequire('db')
var User = oboRequire('models/user')


class UnauthorizedError extends Error {
	constructor(message){
		super(message);
		this.message = message;
		this.name = 'MyError';
	}
}

class UserError extends Error {
	constructor(message){
		super(message);
		this.message = message;
		this.name = 'MyError';
	}
}

// Returns a promise containing the current user (can be null)
// If it's an lti launch - it'll get or create a user
let handle = (req) => {
	// Check for lti data in the request (provided by express-ims-lti)
	if(!req.lti){
		req.session.lti = null
		return req.getCurrentUser()
	}

	return Promise.resolve(req.lti)
	.then(lti => {
		req.session.lti = null
		// create or update the use using the LTI data
		return new User({
			username: lti.body.lis_person_sourcedid,
			email: lti.body.lis_person_contact_email_primary,
			firstName: lti.body.lis_person_name_given,
			lastName: lti.body.lis_person_name_family,
			roles: lti.body.roles
		}).saveOrCreate()
	})
	.then(user => {
		req.setCurrentUser(user)
		return user
	})
	.catch(error => {
		console.error('lti handle error', error)
		return Promise.reject(new UserError('There was a problem creating your account.'))
	})
}


module.exports = {
	handle: handle,
	UserError: UserError,
	UnauthorizedError: UnauthorizedError

}
