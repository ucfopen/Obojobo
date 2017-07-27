jest.mock('../../db')

let mockExpressMethods = {}
let mockRouterMethods = {}

let mockExpress = () => {
	jest.mock('express', () => {
		let module = () => {
			let methods = ['on', 'use', 'get', 'post', 'put', 'delete', 'all', 'static']
			let obj = {}
			methods.forEach(m => {
				obj[m] = mockExpressMethods[m]= jest.fn()
			})
			return obj
		}

		module.Router = () => {
			let methods = ['all', 'get', 'post', 'delete', 'put']
			let obj = {}
			methods.forEach(m => {
				obj[m] = mockRouterMethods[m] = jest.fn()
			})
			return obj
		}

		return module
	}, {virtual: true});
}


describe('editor route', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {});
	afterEach(() => {});

	test('registers the expected routes ', () => {
		mockExpress()
		let express = require('express')
		let editor = oboRequire('routes/editor')
		expect(mockRouterMethods.post).toBeCalledWith('/', expect.any(Function))
	})

	test('loads the expected draft ', () => {
		let db = oboRequire('db')

		// mock the launch insert
		db.any.mockImplementationOnce((query, vars) => {
			return Promise.resolve({draft:true})
		})

		mockExpress()
		let express = require('express')
		let User = oboRequire('models/user')
		let editor = oboRequire('routes/editor')
		let displayEditor = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			getCurrentUser: jest.fn().mockImplementationOnce(() => {
				let u = new User()
				u.canViewEditor = true
				return Promise.resolve(u)
			})
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext)
		.then(() => {
			expect(mockNext).toBeCalledWith()
			expect(mockRes.render).toBeCalledWith(expect.any(String), expect.objectContaining({
				"drafts":{draft:true},
				title: expect.any(String)
			}))
		})
	})

	test('rejects for guests', () => {
		let db = oboRequire('db')

		// mock the launch insert
		db.any.mockImplementationOnce((query, vars) => {
			console.log('REPLY')
			return Promise.resolve({draft:true})
		})

		mockExpress()
		let express = require('express')
		let GuestUser = oboRequire('models/guest_user')
		let editor = oboRequire('routes/editor')
		let displayEditor = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			getCurrentUser: jest.fn().mockImplementationOnce(() => {
				let u = new GuestUser()
				return Promise.resolve(u)
			})
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext)
		.then(() => {
			expect(mockNext).toBeCalledWith(expect.any(Error))
			expect(mockNext.mock.calls[0][0].message).toBe('Login Required')

		})
	})

	test('rejects for users without editor permissions', () => {
		let db = oboRequire('db')

		// mock the launch insert
		db.any.mockImplementationOnce((query, vars) => {
			return Promise.resolve({draft:true})
		})

		mockExpress()
		let express = require('express')
		let User = oboRequire('models/user')
		let editor = oboRequire('routes/editor')
		let displayEditor = mockRouterMethods.post.mock.calls[0][1]

		let mockReq = {
			getCurrentUser: jest.fn().mockImplementationOnce(() => {
				let u = new User()
				u.canViewEditor = false
				return Promise.resolve(u)
			})
		}

		let mockRes = {
			status: jest.fn(),
			render: jest.fn()
		}

		let mockNext = jest.fn()

		return displayEditor(mockReq, mockRes, mockNext)
		.then(() => {
			expect(mockNext).toBeCalledWith()
			expect(mockRes.status).toBeCalledWith(404)
		})
	})


})
