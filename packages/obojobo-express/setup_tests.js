// Global for loading specialized Obojobo stuff
// use oboRequire('models/draft') to load draft models from any context
global.oboRequire = name => {
	return require(`${__dirname}/${name}`)
}

global.validUUID = () => '00000000-0000-0000-0000-000000000000'

jest.mock('fs')
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
const emptyXmlPath = '../../node_modules/obojobo-document-engine/documents/empty.xml'
const emptyXmlStream = realFs.readFileSync(emptyXmlPath)

fs.__setMockFileContents('./config/db.json', JSON.stringify(dbJson))
fs.__setMockFileContents('./config/lti.json', '{"test":{"keys":{"jesttestkey":"jesttestsecret"}}}')
fs.__setMockFileContents('./config/draft.json', '{"test":{"excludeModules":["mockModule:mockExclude"]},"default":{"excludeModules":[]}}')
fs.__setMockFileContents('./config/permission_groups.json', '{"test":{"canDoThing":["roleName"]}}')
fs.__setMockFileContents(
	'./config/general.json',
	'{"test":{"key":"value","hostname":"obojobo.ucf.edu"}}'
)
fs.__setMockFileContents(emptyXmlPath, emptyXmlStream)

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
