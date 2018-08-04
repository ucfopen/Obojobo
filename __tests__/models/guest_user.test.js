jest.mock('../../db')

describe('guest user model', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('extends user', () => {
		let GuestUser = oboRequire('models/guest_user')
		let User = oboRequire('models/user')
		let g = new GuestUser()
		expect(g).toBeInstanceOf(GuestUser)
		expect(g).toBeInstanceOf(User)
	})

	test('responds to isGuest', () => {
		let GuestUser = oboRequire('models/guest_user')
		let g = new GuestUser()
		expect(g.isGuest()).toBe(true)
	})

	test('throws error using saveOrCreate', () => {
		let GuestUser = oboRequire('models/guest_user')
		let g = new GuestUser()

		expect(() => {
			g.saveOrCreate()
		}).toThrowError('Cannot save or create Guest User')
	})

	test('throws error using fetchById', () => {
		let GuestUser = oboRequire('models/guest_user')

		expect(() => {
			GuestUser.fetchById(44)
		}).toThrowError('Cannot fetch Guest User')
	})

	test('all permissions are falsy', () => {
		let GuestUser = oboRequire('models/guest_user')
		let g = new GuestUser()

		expect(g.canViewEditor).toBe(undefined)
		expect(g.canEditDrafts).toBe(undefined)
		expect(g.canDeleteDrafts).toBe(undefined)
		expect(g.canCreateDrafts).toBe(undefined)
		expect(g.canViewDrafts).toBe(undefined)

		expect(g.hasPermission('canViewEditor')).toBe(false)
		expect(g.hasPermission('canEditDrafts')).toBe(false)
		expect(g.hasPermission('canDeleteDrafts')).toBe(false)
		expect(g.hasPermission('canCreateDrafts')).toBe(false)
		expect(g.hasPermission('canViewDrafts')).toBe(false)
	})
})
