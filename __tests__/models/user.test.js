jest.mock('../../db')

describe('user model', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {});
	afterEach(() => {});

	it('initializes expected properties', () => {
		let User = oboRequire('models/user')
		let u = new User({
			id:5,
			firstName:'Roger',
			lastName:'Wilco',
			email:'e@m.com',
			username: 'someusername'
		});
		expect(u).toBeInstanceOf(User)
		expect(u.id).toBe(5)
		expect(u.firstName).toBe('Roger')
		expect(u.lastName).toBe('Wilco')
		expect(u.email).toBe('e@m.com')
		expect(u.username).toBe('someusername')
		expect(u.createdAt).toEqual(expect.any(Number))
		expect(u.roles).toBeInstanceOf(Array)
		expect(u.roles).toHaveLength(0)
	})


	it('initializes permission getters', () => {
		let User = oboRequire('models/user')
		let u

		u = new User({roles: ["roleName", "otherRoleName"]});
		expect(u.roles).toHaveLength(2)
		expect(u.canDoThing).toBe(true)
		expect(u.canDoThingOtherThing).toBe(undefined)

		u = new User({roles: ["roleName2", "otherRoleName"]});
		expect(u.roles).toHaveLength(2)
		expect(u.canDoThing).toBe(false)
		expect(u.canDoThingOtherThing).toBe(undefined)
	})

	it('hasPermission behaves', () => {
		let User = oboRequire('models/user')
		let u = new User({roles: ["roleName", "otherRoleName"]});

		expect(u.hasPermission('test')).toBe(false)
		expect(u.hasPermission('canDoThing')).toBe(true)
	})


	it('hasRole and hasRoles work', () => {
		let User = oboRequire('models/user')
		let u = new User({roles: ["roleName", "otherRoleName"]});
		expect(u.hasRole('test')).toBe(false)
		expect(u.hasRole('roleName')).toBe(true)
		expect(u.hasRole('otherRoleName')).toBe(true)

		expect(u.hasRoles(['roleName', 'otherRoleName'])).toBe(true)
		expect(u.hasRoles(['roleName'])).toBe(true)
		expect(u.hasRoles(['test', 'noway'])).toBe(false)
		expect(u.hasRoles(['roleName', 'noway'])).toBe(false)

		expect(u.hasOneOfRole([]))
	})

	it('hasRole and hasOneOfRole work', () => {
		let User = oboRequire('models/user')
		let u = new User({roles: ["roleName", "otherRoleName"]});
		expect(u.hasRole('test')).toBe(false)
		expect(u.hasRole('roleName')).toBe(true)
		expect(u.hasRole('otherRoleName')).toBe(true)

		expect(u.hasOneOfRole(['test'])).toBe(false)
		expect(u.hasOneOfRole(['roleName'])).toBe(true)
		expect(u.hasOneOfRole(['roleName', 'otherRoleName'])).toBe(true)
		expect(u.hasOneOfRole(['roleName', 'test'])).toBe(true)
	})

	it('responds to isGuest correctly', () => {
		let User = oboRequire('models/user')
		let u = new User({roles: ["roleName", "otherRoleName"]});
		expect(u.isGuest()).toBe(false)
	})

	it('saves or creates correctly', () => {
		expect.assertions(3)

		let db = oboRequire('db')
		let User = oboRequire('models/user')
		db.one.mockImplementationOnce((query, vars) => {
			expect(vars).toEqual(expect.objectContaining({
				"email": "guest@obojobo.ucf.edu",
				"firstName": "Guest",
				"id": 0,
				"lastName": "Guest",
				"roles": expect.any(Array),
				"username": "guest"
			}))
			return Promise.resolve({id:3})
		})

		let u = new User()
		return u.saveOrCreate()
		.then(user => {
			expect(user).toBeInstanceOf(User)
			expect(user.id).toBe(3)
		})
		.catch(err => {
			expect(true).toBe("never called")
		})
	})


	it('fetches one from the databse', () => {
		expect.assertions(3)

		let db = oboRequire('db')
		let User = oboRequire('models/user')
		db.one.mockImplementationOnce((query, vars) => {
			expect(vars).toEqual(5)
			return Promise.resolve({
				"id": 5,
				"createdAt": 3,
				"email": "guest@obojobo.ucf.edu",
				"firstName": "Guest",
				"lastName": "Guest",
				"roles": expect.any(Array),
				"username": "guest"
			})
		})

		return User.fetchById(5)
		.then(user => {
			expect(user).toBeInstanceOf(User)
			expect(user.id).toBe(5)
		})
		.catch(err => {
			expect(err).toBe("never called")
		})
	})

})
