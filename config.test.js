jest.mock('fs');
let fs = require('fs')
let dbJson = JSON.stringify({
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
})

describe('config', () => {

	beforeEach(() => {
		process.env.NODE_ENV = 'test'
		fs.__setMockFileContents('./config/db.json', dbJson);
		fs.__setMockFileContents('./config/lti.json', '{"test":{"key":"value"}}');
		fs.__setMockFileContents('./config/permission_groups.json', '{"test":{"key":"value"}}');
		fs.__setMockFileContents('./config/general.json', '{"test":{"key":"value"}}');
	});


	it('db to have expected props and vals', () => {
		let config = require('./config');
		expect(config).toHaveProperty('db.host')
		expect(config).toHaveProperty('db.port')
		expect(config).toHaveProperty('db.database')
		expect(config).toHaveProperty('db.user')
		expect(config).toHaveProperty('db.password')
	})

	it('expects config to have loaded all files', () => {
		let config = require('./config');
		expect(config).toHaveProperty('db')
		expect(config).toHaveProperty('lti')
		expect(config).toHaveProperty('permissions')
		expect(config).toHaveProperty('general')
	})

	it('selects the environment based on env', () => {
		let config = require('./config');
		expect(config).toHaveProperty('db')
		expect(config.db.host).toBe('hostVal')
	})

})
