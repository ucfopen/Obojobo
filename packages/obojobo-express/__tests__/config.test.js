const env_node = process.env.NODE_ENV
let logger

describe('config', () => {
	beforeEach(() => {
		delete process.env.NODE_ENV
		jest.resetModules()
		jest.mock('../logger')
		logger = oboRequire('logger')
		global.oboJestMockConfig()
	})
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
		expect(config).toHaveProperty('media')
	})

	test('selects the environment based on env', () => {
		const config = oboRequire('config')
		expect(config).toHaveProperty('db')
		expect(config.db.host).toBe('itsdev!')
	})

	test('processes DATABASE_URL env variable', () => {
		const fs = require('fs')
		const mockDBConfig = {
			development: {
				driver: 'postgres',
				user: { ENV: 'DB_USER' },
				password: { ENV: 'DB_PASS' },
				host: { ENV: 'DB_HOST' },
				database: { ENV: 'DB_NAME' },
				port: { ENV: 'DB_PORT' }
			}
		}
		fs.__setMockFileContents('./config/db.json', JSON.stringify(mockDBConfig))

		process.env.DATABASE_URL = 'postgres://mock-user:mock-password@mock-host.com:7777/mock-dbname'
		const config = oboRequire('config')
		expect(config).toHaveProperty('db.host', 'mock-host.com')
		expect(config).toHaveProperty('db.port', 7777)
		expect(config).toHaveProperty('db.database', 'mock-dbname')
		expect(config).toHaveProperty('db.driver', 'postgres')
		expect(config).toHaveProperty('db.user', 'mock-user')
		expect(config).toHaveProperty('db.password', 'mock-password')
		delete process.env.DATABASE_URL
		delete process.env.DB_USER
		delete process.env.DB_PASS
		delete process.env.DB_HOST
		delete process.env.DB_NAME
		delete process.env.DB_PORT
	})

	test('config logs errors when expected env not set', () => {
		process.env.NODE_ENV = 'test'
		const fs = require('fs')
		const mockDBConfig = {
			test: {
				driver: 'postgres',
				user: { ENV: 'DB_USER' }
			}
		}
		fs.__setMockFileContents('./config/db.json', JSON.stringify(mockDBConfig))

		const config = oboRequire('config')
		expect(logger.error).toHaveBeenCalledTimes(2)
		expect(logger.error).toHaveBeenCalledWith('Error: Expected ENV var DB_USER is not set')
		expect(config.db).toEqual({})
	})

	test('processes DATABASE_URL env variable 2', () => {
		process.env.NODE_ENV = 'test'
		const fs = require('fs')
		const mockDBConfig = {
			test: {
				driver: 'postgres',
				user: { ENV: 'DB_USER' }
			}
		}
		fs.__setMockFileContents('./config/db.json', JSON.stringify(mockDBConfig))

		oboRequire('config')
		expect(logger.error).toHaveBeenCalledTimes(2)
		expect(logger.error).toHaveBeenCalledWith('Error: Expected ENV var DB_USER is not set')
	})
})
