let db = oboRequire('db');

class User {
	constructor({id=0, firstName='Guest', lastName='Guest', email='guest@obojobo.ucf.edu', username='guest', createdAt=Date.now(), roles=[]} = {}){
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.username = username;
		this.createdAt = createdAt;
		this.roles = roles;
	}

	static fetchById(id) {
		return db.one(`
			SELECT *
			FROM users
			WHERE id = $1
		`, id)
		.then( (result) => {
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

	isGuest(){
		return false;
	}

}

module.exports = User
