let permissions = oboRequire('config').permissions

class MockUser {
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

	hasPermission(permName) {
		if(!permissions[permName]) return false
		return this.hasOneOfRole(permissions[permName])
	}

	saveOrCreate(){
		return Promise.resolve(this)
	}
}

module.exports = MockUser;
