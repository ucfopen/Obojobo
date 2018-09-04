jest.mock('../../db')

describe('guest user model', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	it('extends user', () => {
		let GuestUser = oboRequire('models/guest_user')
		let User = oboRequire('models/user')
		let g = new GuestUser()
		expect(g).toBeInstanceOf(GuestUser)
		expect(g).toBeInstanceOf(User)
	})

	it('responds to isGuest', () => {
		let GuestUser = oboRequire('models/guest_user')
		let g = new GuestUser()
		expect(g.isGuest()).toBe(true)
	})

	it('throws error using saveOrCreate', () => {
		let GuestUser = oboRequire('models/guest_user')
		let g = new GuestUser()

		expect(() => {
			g.saveOrCreate()
		}).toThrowError('Cannot save or create Guest User')
	})

	it('throws error using fetchById', () => {
		let GuestUser = oboRequire('models/guest_user')

		expect(() => {
			GuestUser.fetchById(44)
		}).toThrowError('Cannot fetch Guest User')
	})
})
