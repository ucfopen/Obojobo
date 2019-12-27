mockVirtual('./server/express_response_decorator')
mockVirtual('./server/dev_nonce_store')
mockVirtual('./server/express_current_user')
mockVirtual('./server/express_current_document')
mockVirtual('./server/express_load_balancer_helper')
mockVirtual('./server/express_lti_launch')
mockVirtual('./server/express_register_chunks')
mockVirtual('./server/lti')
mockVirtual('express-ims-lti')
jest.mock('../server/db')
jest.mock(
	'../server/asset_resolver',
	() => ({
		assetForEnv: path => path,
		webpackAssetPath: path => path
	}),
	{ virtual: true }
)

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

		// let x = oboRequire('server/dev_nonce_store')
		// console.log('go', x)
		// console.log(new x())

describe('obo express', () => {
	beforeAll(() => {
		// call this beforeAll because it only happens once on require
		// and the tests are run in random order

		mockExpress(mockOn)

		oboRequire('server/obo_express')
		mockOnCallback = mockOn.mock.calls[0][1]
	})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('listens to mount event', () => {
		expect(mockOn).toBeCalledWith('mount', expect.any(Function))
	})

	test('implements expected middleware on parent app', () => {
		oboRequire('server/obo_express')
		const mockApp = require('express')()
		const registerChunks = oboRequire('server/express_register_chunks')
		mockOnCallback(mockApp)

		expect(mockApp.on).toHaveBeenCalledWith('mount', expect.any(Function))
		expect(registerChunks).toHaveBeenCalledWith(mockApp)
		expect(mockApp.use).toHaveBeenCalledWith(oboRequire('server/express_load_balancer_helper'))
		expect(mockApp.use).toHaveBeenCalledWith(oboRequire('server/express_current_user'))
		expect(mockApp.use).toHaveBeenCalledWith('/', oboRequire('server/express_response_decorator'))
	})

	test('returns an express application', () => {
		mockExpress()
		const oe = oboRequire('server/obo_express')

		expect(oe).toEqual(
			expect.objectContaining({
				on: expect.any(Function),
				static: expect.any(Function)
			})
		)
	})
})
