describe('config', () => {

	beforeEach(() => {})
	afterEach(() => {})
	beforeAll(() => {})
	afterAll(() => {})


	it('db to have expected props and vals', () => {
		let config = oboRequire('config');
		expect(config).toHaveProperty('db.host')
		expect(config).toHaveProperty('db.port')
		expect(config).toHaveProperty('db.database')
		expect(config).toHaveProperty('db.user')
		expect(config).toHaveProperty('db.password')
	})

	it('expects config to have loaded all files', () => {
		let config = oboRequire('config');
		expect(config).toHaveProperty('db')
		expect(config).toHaveProperty('lti')
		expect(config).toHaveProperty('permissions')
		expect(config).toHaveProperty('general')
	})

	it('selects the environment based on env', () => {
		let config = oboRequire('config');
		expect(config).toHaveProperty('db')
		expect(config.db.host).toBe('hostVal')
	})

})
