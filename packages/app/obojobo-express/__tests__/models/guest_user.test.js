jest.mock('../../db')

describe('guest user model', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('extends user', () => {
		const GuestUser = oboRequire('server/models/guest_user')
		const User = oboRequire('server/models/user')
		const g = new GuestUser()
		expect(g).toBeInstanceOf(GuestUser)
		expect(g).toBeInstanceOf(User)
	})

	test('responds to isGuest', () => {
		const GuestUser = oboRequire('server/models/guest_user')
		const g = new GuestUser()
		expect(g.isGuest()).toBe(true)
	})

	test('throws error using saveOrCreate', () => {
		const GuestUser = oboRequire('server/models/guest_user')
		const g = new GuestUser()

		expect(() => {
			g.saveOrCreate()
		}).toThrowError('Cannot save or create Guest User')
	})

	test('throws error using fetchById', () => {
		const GuestUser = oboRequire('server/models/guest_user')

		expect(() => {
			GuestUser.fetchById(44)
		}).toThrowError('Cannot fetch Guest User')
	})

	test('all permissions are falsy', () => {
		const GuestUser = oboRequire('server/models/guest_user')
		const g = new GuestUser()

		expect(g.canViewEditor).toBe(false)
		expect(g.canEditDrafts).toBe(false)
		expect(g.canDeleteDrafts).toBe(false)
		expect(g.canCreateDrafts).toBe(false)
		expect(g.canPreviewDrafts).toBe(false)

		expect(g.hasPermission('canViewEditor')).toBe(false)
		expect(g.hasPermission('canEditDrafts')).toBe(false)
		expect(g.hasPermission('canDeleteDrafts')).toBe(false)
		expect(g.hasPermission('canCreateDrafts')).toBe(false)
		expect(g.hasPermission('canPreviewDrafts')).toBe(false)
	})
})
