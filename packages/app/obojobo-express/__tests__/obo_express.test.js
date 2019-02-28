mockVirtual('./express_response_decorator')
mockVirtual('./dev_nonce_store')
mockVirtual('./express_current_user')
mockVirtual('./express_current_document')
mockVirtual('./express_load_balancer_helper')
mockVirtual('./express_lti_launch')
mockVirtual('./express_register_chunks')
mockVirtual('./lti')
mockVirtual('express-ims-lti')
jest.mock('db')

const mockOn = jest.fn().mockImplementation(() => {})
let mockOnCallback

// make circular references in router to support method chaining
// like router.route('/').get().get()
const mockRouter = {}
mockRouter.route = jest.fn().mockReturnValue(mockRouter)
mockRouter.all = jest.fn().mockReturnValue(mockRouter)
mockRouter.get = jest.fn().mockReturnValue(mockRouter)
mockRouter.post = jest.fn().mockReturnValue(mockRouter)
mockRouter.delete = jest.fn().mockReturnValue(mockRouter)

const mockExpress = (mockOn = false, mockStatic = false) => {
	jest.mock(
		'express',
		() => {
			const module = () => ({
				on: mockOn ? mockOn : jest.fn(),
				use: jest.fn(),
				get: mockRouter.get,
				post: mockRouter.post,
				delete: mockRouter.delete,
				static: mockStatic ? mockStatic : jest.fn()
			})
			module.Router = () => mockRouter

			return module
		},
		{ virtual: true }
	)
}

describe('obo express', () => {
	beforeAll(() => {
		// call this beforeAll because it only happens once on require
		// and the tests are run in random order
		mockExpress(mockOn)
		oboRequire('obo_express')
		mockOnCallback = mockOn.mock.calls[0][1]
	})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('listens to mount event', () => {
		expect(mockOn).toBeCalledWith('mount', expect.any(Function))
	})

	test('implements expected middleware on parent app', () => {
		oboRequire('obo_express')
		const mockApp = require('express')()
		const registerChunks = oboRequire('express_register_chunks')
		mockOnCallback(mockApp)

		expect(mockApp.on).toHaveBeenCalledWith('mount', expect.any(Function))
		expect(registerChunks).toHaveBeenCalledWith(mockApp)
		expect(mockApp.use).toHaveBeenCalledWith(oboRequire('express_load_balancer_helper'))
		expect(mockApp.use).toHaveBeenCalledWith(oboRequire('express_current_user'))
		expect(mockApp.use).toHaveBeenCalledWith('/', oboRequire('express_response_decorator'))
	})

	test('returns an express application', () => {
		mockExpress()
		const oe = oboRequire('obo_express')

		expect(oe).toEqual(
			expect.objectContaining({
				on: expect.any(Function),
				static: expect.any(Function)
			})
		)
	})
})
