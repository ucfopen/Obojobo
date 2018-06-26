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
})
