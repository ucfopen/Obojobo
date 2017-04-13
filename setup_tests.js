// Global for loading specialized Obojobo stuff
// use oboRequire('models/draft') to load draft models from any context
global.oboRequire = require('./obo_require')


jest.mock('fs');
let fs = require('fs')
let dbJson = {
	test:{
		host: 'hostVal',
		port: 'portVal',
		database: 'databaseVal',
		user: 'userVal',
		password: 'pwVal'
	},
	development:{
		host: 'itsdev!',
	},
}

fs.__setMockFileContents('./config/db.json', JSON.stringify(dbJson));
fs.__setMockFileContents('./config/lti.json', '{"test":{"key":"value"}}');
fs.__setMockFileContents('./config/draft.json', '{"test":{"paths":[]}}');
fs.__setMockFileContents('./config/permission_groups.json', '{"test":{"key":"value"}}');
fs.__setMockFileContents('./config/general.json', '{"test":{"key":"value"}}');

