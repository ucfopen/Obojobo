let originalConsole = console

describe('lti launch', () => {

	beforeEach(() => {})
	afterEach(() => {})
	beforeAll(() => {
		// global.console = {warn: jest.fn(), log: jest.fn(), error: jest.fn()}
		jest.mock('fs');
		jest.mock('./db');

		let fs = require('fs')
		let dbJson = JSON.stringify({
			test:{
				host: 'hostVal',
				port: 555,
				database: 'databaseVal',
				user: 'userVal',
				password: 'pwVal'
			}
		})
		fs.__setMockFileContents('./config/db.json', dbJson);
		fs.__setMockFileContents('./config/lti.json', '{"test":{"keys":{"testkey":"testsecret"}}}');
		fs.__setMockFileContents('./config/permission_groups.json', '{"test":{"key":"value"}}');
		fs.__setMockFileContents('./config/general.json', '{"test":{"key":"value"}}');

		jest.mock('./models/user')

	})
	afterAll(() => {
		global.console = originalConsole
	})

	it('should define the expected props', () => {
		let ltiLaunch = require('./lti_launch')
		expect(ltiLaunch).toHaveProperty('handle')
		expect(ltiLaunch).toHaveProperty('UserError')
		expect(ltiLaunch).toHaveProperty('UnauthorizedError')

		expect(ltiLaunch.handle).toBeInstanceOf(Function)
		expect(ltiLaunch.UserError).toBeInstanceOf(Function)
		expect(ltiLaunch.UnauthorizedError).toBeInstanceOf(Function)
	})

	it('hande should just return the current user when not a launch request', () =>{
		expect.assertions(1)

		let ltiLaunch = require('./lti_launch')
		let mockReq = {
			session: {lti:'not_null'},
			getCurrentUser: () => { return Promise.resolve('MOCK_CURRENT_USER')}
		}
		return ltiLaunch.handle(mockReq)
		.then(user => {
			expect(user).toBe('MOCK_CURRENT_USER')
		})
	})

	it('handle should create save or create a user', () =>{
		expect.assertions(3)

		let ltiLaunch = require('./lti_launch')
		let User = oboRequire('models/user')
		User.prototype.saveOrCreate = jest.fn()
		User.prototype.saveOrCreate.mockImplementationOnce(() => {
			return Promise.resolve('MOCK_CURRENT_USER')
		})

		let mockReq = {
			lti: {
				body:{
					lis_person_sourcedid: 'mockUsername',
					lis_person_contact_email_primary: 'mockEmail',
					lis_person_name_given: 'mockFirstName',
					lis_person_name_family: 'mockLastName',
					roles: ['mockRole1','mockRole2']
				}
			},
			session: {lti:'not_null'},
			setCurrentUser: jest.fn()
		}

		return ltiLaunch.handle(mockReq)
		.then(user => {
			expect(user).toBe('MOCK_CURRENT_USER')
			expect(User.prototype.saveOrCreate).toBeCalledWith()
			expect(mockReq.setCurrentUser).toBeCalledWith('MOCK_CURRENT_USER')
		})
	})

	it('hande should clear lti from the session', () =>{
		expect.assertions(1)

		let ltiLaunch = require('./lti_launch')
		let mockReq = {
			session: {lti:'not_null'},
			getCurrentUser: () => { return Promise.resolve()}
		}

		return ltiLaunch.handle(mockReq)
		.then(user => {
			expect(mockReq.session.lti).toBe(null)
		})

	})


	it('hande should return a promise', () =>{
		expect.assertions(1)
		let ltiLaunch = require('./lti_launch')
		let mockReq = {
			lti: {
				body:{
					lis_person_sourcedid: 'mockUsername',
					lis_person_contact_email_primary: 'mockEmail',
					lis_person_name_given: 'mockFirstName',
					lis_person_name_family: 'mockLastName',
					roles: ['mockRole1','mockRole2']
				}
			},
			session: {lti:'not_null'},
			setCurrentUser: jest.fn()
		}
		expect(ltiLaunch.handle(mockReq)).toBeInstanceOf(Promise)
	})

})
