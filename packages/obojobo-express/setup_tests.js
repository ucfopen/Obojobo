// Global for loading specialized Obojobo stuff
// use oboRequire('models/draft') to load draft models from any context
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
			password: 'pwVal'
		},
		// adds a simple config for testing environment switching
		development: {
			host: 'itsdev!'
		}
	}

	// get the actual empty.xml
	const realFs = require.requireActual('fs')
	const emptyXmlPath = require.resolve('obojobo-document-engine/documents/empty.xml')
	const configPath = path.resolve(__dirname, 'config')
	const emptyXmlStream = realFs.readFileSync(emptyXmlPath)
	fs.__setMockFileContents(configPath+'/db.json', JSON.stringify(dbJson))
	fs.__setMockFileContents(
		configPath+'/lti.json',
		'{"test":{"keys":{"jesttestkey":"jesttestsecret"}}}'
	)
	fs.__setMockFileContents(
		configPath+'/draft.json',
		'{"test":{"excludeModules":["mockModule:mockExclude"]},"default":{"excludeModules":[]}}'
	)
	fs.__setMockFileContents(
		configPath+'/permission_groups.json',
		'{"test":{"canDoThing":["roleName"]}}'
	)
	fs.__setMockFileContents(
		configPath+'/media.json',
		'{"test":{"maxUploadSize":100000,"minImageSize": 10,"maxImageSize": 8000,"originalMediaTag":"original","presetDimensions":[]}}'
	)
	fs.__setMockFileContents(
		configPath+'/general.json',
		'{"test":{"key":"value","hostname":"obojobo.ucf.edu"}}'
	)
	fs.__setMockFileContents(emptyXmlPath, emptyXmlStream)
}

global.oboJestMockConfig()

// use this to wrap a class with a virtual mock
// mockVirtual('./express_load_balancer_helper')
// let elbh = require('./express_load_balancer_helper')
// elbh.myFunc = jest.fn()
// then when an include requires elbh, it'll get your mock
global.mockVirtual = mock => {
	const mockFunction = jest.fn()
	jest.mock(
		mock,
		() => {
			return mockFunction
		},
		{ virtual: true }
	)
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
