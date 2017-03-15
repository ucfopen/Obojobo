var db = oboRequire('db.js')
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

// Returns a promise containing lti data and the current user
let handle = (req, res, next) => {
	// // Check for lti data in the request (provided by express-ims-lti)
	// if(!req.lti){
	// 	if (req.session.lti) req.session.lti = null

	// 	res.status(401)
	// 	.render('error.pug', {message: 'Access Denied', error: {status: 'Invalid LTI launch request'}, stack:null });
	// 	return next()
	// }

	// // create or update the use using the LTI data
	// let user = new User({
	// 	username: req.lti.body.lis_person_sourcedid,
	// 	email: req.lti.body.lis_person_contact_email_primary,
	// 	firstName: req.lti.body.lis_person_name_given,
	// 	lastName: req.lti.body.lis_person_name_family,
	// 	roles: req.lti.body.roles
	// });

	// return user.saveOrCreate()
	// .then( result => {
	// 	req.setCurrentUser(user)
	// 	next()
	// })
	// .catch( error => {
	// 	console.log('new, failure', error)
	// 	res.render('error.pug', {message: 'ERROR', error: {status: 'There was a problem creating your account.'}});
	// 	next()
	// })



	// Check for lti data in the request (provided by express-ims-lti)
	if(!req.lti){
		if (req.session.lti) req.session.lti = null
		return Promise.reject(new UnauthorizedError('Invalid LTI launch Request'))
	}

	let lti = req.lti.body
	// create or update the use using the LTI data
	let user = new User({
		username: lti.lis_person_sourcedid,
		email: lti.lis_person_contact_email_primary,
		firstName: lti.lis_person_name_given,
		lastName: lti.lis_person_name_family,
		roles: lti.roles
	});

	return user.saveOrCreate()
	.then( result => {
		req.setCurrentUser(user)
		return [user, req.lti]
	})
	.catch( error => {
		return new UserError('There was a problem creating your account.')
	})
}


module.exports = {
	handle: handle,
	UserError: UserError,
	UnauthorizedError: UnauthorizedError

}
