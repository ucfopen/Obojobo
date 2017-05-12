let User = require('./user')

class GuestUser extends User{
	constructor(){
		super({id:0, firstName:'Guest', lastName:'Guest', email:'guest@obojobo.ucf.edu', username:'guest_user', createdAt:Date.now(), roles:[]})
	}

	saveOrCreate(){
		throw new Error('Cannot save or create Guest User')
	}

	isGuest(){
		return true;
	}

	static fetchById(id) {
		throw new Error('Cannot fetch Guest User')
	}
}

module.exports = GuestUser
