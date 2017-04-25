let db = oboRequire('db');
let permissions = oboRequire('config').permissions

class User {
	constructor({id=0, firstName='Guest', lastName='Guest', email='guest@obojobo.ucf.edu', username='guest', createdAt=Date.now(), roles=[]} = {}){
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.username = username;
		this.createdAt = createdAt;
		this.roles = roles;

		// creates 'canEditDrafts' getter if 'canEditDrafts' is set in config/role_groups.json
		for(let permName in permissions)
		{
			Object.defineProperty(this, permName, {
				get: this.hasPermission.bind(this, permName)
			})
		}
	}

	static fetchById(id) {
		return db.one(`
			SELECT *
			FROM users
			WHERE id = $1
		`, id)
		.then(result => {
			return new User({
				id: result.id,
				firstName: result.first_name,
				lastName: result.last_name,
				email: result.email,
				username: result.username,
				createdAt: result.created_at,
				roles: result.roles,
			})
		})
	}

	saveOrCreate(){
		return db.one(`
			INSERT INTO users
				(username, email, first_name, last_name, roles)
				VALUES($[username], $[email], $[firstName], $[lastName], $[roles])
			ON CONFLICT (username) DO UPDATE SET
				email = $[email],
				first_name = $[firstName],
				last_name = $[lastName],
				roles = $[roles]
			RETURNING *
			`, this)
		.then(result => {
			// populate my id from the result
			this.id = result.id
			return this
		})
	}

	isGuest() {
		return false;
	}

	hasRole(expectedRole) {
		return this.roles.indexOf(expectedRole) > -1
	}

	hasRoles(expectedRoles) {
		return expectedRoles.length === this.roles.filter(role => {
			return expectedRoles.indexOf(role) > -1
		}).length
	}

	hasOneOfRole(expectedRoles) {
		return this.roles.filter(role => {
			return expectedRoles.indexOf(role) > -1
		}).length > 0
	}

	hasPermission(permName) {
		if(!permissions[permName]) return false
		return this.hasOneOfRole(permissions[permName])
	}
}


module.exports = User
