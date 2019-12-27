const permissions = oboRequire('server/config').permissions
let saveOrCreateCallbackFn = jest.fn()

class MockUser {
	constructor({
		id = 1,
		firstName = 'MOCK',
		lastName = 'USER',
		email = 'mock@obojobo.ucf.edu',
		username = 'mock',
		createdAt = Date.now(),
		roles = []
	} = {}) {
		this.id = id
		this.firstName = firstName
		this.lastName = lastName
		this.email = email
		this.username = username
		this.createdAt = createdAt
		this.roles = roles

		// creates 'canEditDrafts' getter if 'canEditDrafts' is set in config/role_groups.json
		for (const permName in permissions) {
			Object.defineProperty(this, permName, {
				get: this.hasPermission.bind(this, permName)
			})
		}
	}

	hasPermission(permName) {
		if (!permissions[permName]) return false
		return this.hasOneOfRole(permissions[permName])
	}

	saveOrCreate() {
		return Promise.resolve(this).then(user => {
			// you can throw errors or just use this to get notified
			saveOrCreateCallbackFn(user)
			return user
		})
	}

	isGuest() {
		return false
	}

	static set saveOrCreateCallback(fn) {
		saveOrCreateCallbackFn = fn
	}

	static get saveOrCreateCallback() {
		return saveOrCreateCallbackFn
	}
}

MockUser.clearSessionsForUserById = jest.fn()

module.exports = MockUser
