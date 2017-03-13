let db = oboRequire('db');

class User {

	static fetchById(id) {
		// @TODO: HACK just mock someone
		let user = new User();
		user.id = id;
		user.firstName = 'Ian'
		user.lastName = 'Turgeon'
		user.email = 'iturgeon@gmail.com'
		user.username = 'iturgeon'
		user.created_at = Date.now()
		user.roles = ['buddy']
		return user;
	}

}

module.exports = User


