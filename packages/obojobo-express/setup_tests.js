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
fs.__setMockFileContents('./config/lti.json', '{"test":{"key":"value"}}')
fs.__setMockFileContents('./config/draft.json', '{"test":{"paths":[]}}')
fs.__setMockFileContents('./config/permission_groups.json', '{"test":{"canDoThing":["roleName"]}}')
fs.__setMockFileContents('./config/general.json', '{"test":{"key":"value"}}')
fs.__setMockFileContents(emptyXmlPath, emptyXmlStream)

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
