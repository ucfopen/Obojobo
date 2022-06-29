const db = require('obojobo-express/server/db')
const logger = require('obojobo-express/server/logger')

class AdminInterface {
	constructor({ id = null, title = '' }) {
		console.log("AdminInterface built")
		this.id = id
		this.title = title
	}

    // INSERT INTO user_perms VALUES (4, '{canViewStatsPage}');
    // INSERT INTO user_perms VALUES (4, '{canViewSystemStats}');
	static doSomething(id) {
        console.log("doSomething id:")
        console.log(id)
		return db
			.one(`
			    INSERT INTO user_perms 
                VALUES (1000, '{canViewStatsPage}')
			`)
			.then(selectResult => {
				return new AdminInterface(selectResult)
			})
			.catch(error => {
				throw logger.logError('AdminInterface doSomething Error', error)
			})
	}
}

module.exports = AdminInterface