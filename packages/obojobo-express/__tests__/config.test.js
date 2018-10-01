const env_node = process.env.NODE_ENV
delete process.env.NODE_ENV

describe('config', () => {
	beforeEach(() => {})
	afterEach(() => {})
	beforeAll(() => {})
	afterAll(() => {
		process.env.NODE_ENV = env_node
	})

	test('db to have expected props and vals', () => {
		const config = oboRequire('config')
		expect(config).toHaveProperty('db.host')
		expect(config).toHaveProperty('db.port')
		expect(config).toHaveProperty('db.database')
		expect(config).toHaveProperty('db.user')
		expect(config).toHaveProperty('db.password')
		expect(config.db.host).toBe('itsdev!')
	})

	test('expects config to have loaded all files', () => {
		const config = oboRequire('config')
		expect(config).toHaveProperty('db')
		expect(config).toHaveProperty('lti')
		expect(config).toHaveProperty('permissions')
		expect(config).toHaveProperty('general')
	})

	test('selects the environment based on env', () => {
		const config = oboRequire('config')
		expect(config).toHaveProperty('db')
		expect(config.db.host).toBe('itsdev!')
	})
})
