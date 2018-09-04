// Global for loading specialized Obojobo stuff
// use oboRequire('models/draft') to load draft models from any context
global.oboRequire = name => {
	return require(`${__dirname}/${name}`)
}

jest.mock('fs')
let fs = require('fs')
let dbJson = {
	test: {
		host: 'hostVal',
		port: 'portVal',
		database: 'databaseVal',
		user: 'userVal',
		password: 'pwVal'
	},
	development: {
		host: 'itsdev!'
	}
}

// get the actual empty.xml
let realFs = require.requireActual('fs')
let emptyXmlPath = './node_modules/obojobo-draft-document-engine/documents/empty.xml'
let emptyXmlStream = realFs.readFileSync(emptyXmlPath)

fs.__setMockFileContents('./config/db.json', JSON.stringify(dbJson))
fs.__setMockFileContents('./config/lti.json', '{"test":{"keys":{"jesttestkey":"jesttestsecret"}}}')
fs.__setMockFileContents('./config/draft.json', '{"test":{"paths":[]}}')
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
	let mockFunction = jest.fn()
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
	Date = class extends Date {
		constructor() {
			super()
			return testDate
		}
	}
	return testDate
}
