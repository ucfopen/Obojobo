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

	// get the actual empty.xml
	const realFs = require.requireActual('fs')
	const configPath = path.resolve(__dirname, 'server', 'config')
	const bypassMock = file => {
		fs.__setMockFileContents(file, realFs.readFileSync(file))
	}

	fs.__setMockFileContents(`${configPath}/db.json`, JSON.stringify(dbJson))
	bypassMock(`${configPath}/lti.json`)
	bypassMock(`${configPath}/draft.json`)
	bypassMock(`${configPath}/media.json`)
	bypassMock(`${configPath}/general.json`)
	bypassMock(`${configPath}/permission_groups.json`)
	bypassMock(require.resolve('obojobo-document-engine/documents/empty.xml'))
}

global.oboJestMockConfig()

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
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
