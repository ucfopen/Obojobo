jest.mock('./db')

mockVirtual('./apiResponseDecorator')
mockVirtual('./apiResponseDecorator')
mockVirtual('./dev_nonce_store')
mockVirtual('./api_response_decorator')
mockVirtual('express-ims-lti')
mockVirtual('./express_load_balancer_helper')
mockVirtual('./express_current_user')
mockVirtual('./express_lti_launch')
mockVirtual('./express_register_chunks')
mockVirtual('./lti')

let mockOn = jest.fn().mockImplementation((event, func) => {})
let mockOnCallback
let mockExpress = (mockOn = false, mockStatic = false) => {
	jest.mock('express', () => {
		let module = () => ({
			on: (mockOn ? mockOn : jest.fn()),
			use: jest.fn(),
			get: jest.fn(),
			post: jest.fn(),
			delete: jest.fn(),
			static: (mockStatic ? mockStatic : jest.fn())
		})
		module.Router = () => ({
			all: jest.fn(),
			get: jest.fn(),
			post: jest.fn()
		})

		return module
	}, {virtual: true});
}

describe('obo express', () => {

	beforeAll(() => {
		// call this beforeAll because it only happens once on require
		// and the tests are run in random order
		mockExpress(mockOn)
		let oe = require('./obo_express')
		mockOnCallback = mockOn.mock.calls[0][1]
	})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	it('listens to mount event', () => {
		expect(mockOn).toBeCalledWith('mount', expect.any(Function))
	})

	it('implements expected middleware on parent app', () => {
		let oe = require('./obo_express')
		let mockApp = require('express')()
		let registerChunks = require('./express_register_chunks')
		mockOnCallback(mockApp)

		expect(mockApp.on).toHaveBeenCalledTimes(1)
		expect(mockApp.use).toHaveBeenCalledTimes(11)
		expect(registerChunks).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalledWith(oboRequire('express_load_balancer_helper'))
		expect(mockApp.use).toHaveBeenCalledWith(oboRequire('express_current_user'))
		expect(mockApp.use).toHaveBeenCalledWith(expect.any(String), oboRequire('api_response_decorator'))
		expect(mockApp.use).toHaveBeenCalledWith(expect.any(String), oboRequire('express_lti_launch'))
	})

	it('returns an express application', () => {
		mockExpress()
		let oe = require('./obo_express')

		expect(oe).toEqual(expect.objectContaining({
			on: expect.any(Function),
			static: expect.any(Function)
		}))
	})

})
