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

let mockExpress = (mockOn = false, mockStatic = false) => {
	jest.mock('express', () => {
		return () => ({
			on: (mockOn ? mockOn : jest.fn()),
			static: (mockStatic ? mockStatic : jest.fn())
		})
	}, {virtual: true});
}


describe('obo express', () => {

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	it.only('listens to mount event', () => {
		let mockOn = jest.fn().mockImplementation((event, func) => {})
		mockExpress(mockOn)

		let app = require('express')()
		let oe = require('./obo_express')

		expect(mockOn).toBeCalledWith('mount', expect.any(Function))
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
