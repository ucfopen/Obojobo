const path = require('path')

// Global for loading specialized Obojobo stuff
// use oboRequire('models/draft') to load draft models from any context
global.oboRequire = name => {
	return require(`${__dirname}/${name}`)
}

global.validUUID = () => '00000000-0000-0000-0000-000000000000'

jest.mock('fs')
const fs = require('fs')
const dbJson = {
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
const realFs = require.requireActual('fs')
const emptyXmlPath = path.resolve('../obojobo-document-engine/documents/empty.xml')
const emptyXmlStream = realFs.readFileSync(emptyXmlPath)

fs.__setMockFileContents(`${__dirname}/config/db.json`, JSON.stringify(dbJson))
fs.__setMockFileContents(
	`${__dirname}/config/lti.json`,
	'{"test":{"keys":{"jesttestkey":"jesttestsecret"}}}'
)
fs.__setMockFileContents(`${__dirname}/config/draft.json`, '{"test":{"paths":[]}}')
fs.__setMockFileContents(
	`${__dirname}/config/permission_groups.json`,
	'{"test":{"canDoThing":["roleName"]}}'
)
fs.__setMockFileContents(
	`${__dirname}/config/general.json`,
	'{"test":{"key":"value","hostname":"obojobo.ucf.edu"}}'
)
fs.__setMockFileContents(emptyXmlPath, emptyXmlStream)

// mockVirtual is used when you don't want jest to
// acknowledge any existing mock in the system
// and force whatever you're mocking to just return jest.fn()
// it can also be used to mock a file that doesn't exist
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
