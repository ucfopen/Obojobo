// Global for loading specialized Obojobo stuff
// use oboRequire('server/models/draft') to load draft models from any context
global.oboRequire = name => {
	return require(`${__dirname}/${name}`)
}

global.validUUID = () => '00000000-0000-0000-0000-000000000000'

global.oboJestMockConfig = () => {
	jest.mock('fs')
	const path = require('path')
	const fs = require('fs')
	const dbJson = {
		default: {
			driver: 'driverVal',
			host: 'hostVal',
			port: 'portVal',
			database: 'databaseVal',
			user: 'userVal',
			password: 'pwVal',
			useBluebird: true
		},
		// adds a simple config for testing environment switching
		development: {
			host: 'itsdev!'
		}
	}

	const configPath = path.resolve(__dirname, 'server', 'config')

	// mock obojobo-express attempt to load list of config files
	// fs.mockReaddirSync(configPath, [
	// 	'db.json',
	// 	'lti.json',
	// 	'draft.json',
	// 	'media.json',
	// 	'general.json',
	// 	'permission_groups.json',
	// ])

	// mock obojobo-express config file contents
	fs.__setMockFileContents(`${configPath}/db.json`, JSON.stringify(dbJson))
}

// global.oboJestMockConfig()

// mockVirtual is used when you don't want jest to
// acknowledge any existing mock in the system
// and force whatever you're mocking to just return jest.fn()
// it can also be used to mock a file that doesn't exist
global.mockVirtual = mock => {
	const mockFunction = jest.fn()
	jest.mock(mock, () => mockFunction, { virtual: true })
	return mockFunction
}

// make sure all Date objects use a static date
global.mockStaticDate = () => {
	const testDate = new Date('2016-09-22T16:57:14.500Z')
	//eslint-disable-next-line no-global-assign
	Date = class extends Date {
		constructor() {
			super()
			return testDate
		}
	}
	return testDate
}

process.on('unhandledRejection', (reason, p) => {
	// eslint-disable-next-line no-console
	console.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
	throw Error('Unhandled Rejection at: Promise')
})
