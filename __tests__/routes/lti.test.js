jest.mock('../../db')
const { mockExpressMethods, mockRouterMethods } = require('../../__mocks__/__mock_express')
const editor = oboRequire('routes/lti')
const mockNext = jest.fn()
const mockRes = {
	type: jest.fn(),
	status: jest.fn(),
	render: jest.fn(),
	redirect: jest.fn(),
	send: jest.fn()
}
const mockReq = {
	app: {
		locals: {
			paths: 'test',
			modules: 'test'
		},
		get: jest.fn()
	},
	getCurrentUser: jest.fn()
}

describe('lti route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockRes.type.mockReset()
		mockRes.status.mockReset()
		mockRes.render.mockReset()
		mockRes.redirect.mockReset()
		mockRes.send.mockReset()
		mockNext.mockReset()
		mockReq.app.get.mockReset()
		mockReq.getCurrentUser.mockReset()
		delete mockReq.lti
	})
	afterEach(() => {})

	test('registers the expected routes ', () => {
		expect(mockRouterMethods.get).toHaveBeenCalledTimes(2)
		expect(mockRouterMethods.post).toHaveBeenCalledTimes(4)
		expect(mockRouterMethods.delete).toHaveBeenCalledTimes(0)
		expect(mockRouterMethods.all).toHaveBeenCalledTimes(0)
		expect(mockRouterMethods.get).toBeCalledWith('/', expect.any(Function))
		expect(mockRouterMethods.get).toBeCalledWith('/config.xml', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith('/canvas/course_navigation', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith('/canvas/editor_button', expect.any(Function))
		expect(mockRouterMethods.post).toBeCalledWith(
			'/canvas/assignment_selection',
			expect.any(Function)
		)
	})

	test('index calls render', () => {
		let rootRoute = mockRouterMethods.get.mock.calls[0][1]
		rootRoute(mockReq, mockRes, mockNext)
		expect(mockRes.render).toBeCalledWith(expect.any(String), expect.any(Object))
	})

	test('config calls render', () => {
		let configXmlRoute = mockRouterMethods.get.mock.calls[1][1]
		configXmlRoute(mockReq, mockRes, mockNext)
		expect(mockRes.render).toBeCalledWith(expect.any(String), expect.any(Object))
	})

	test('config sets response type to xml', () => {
		let configXmlRoute = mockRouterMethods.get.mock.calls[1][1]
		configXmlRoute(mockReq, mockRes, mockNext)
		expect(mockRes.type).toBeCalledWith('xml')
	})

	test('course_navigation calls redirect for users with access', () => {
		expect.assertions(2)
		let courseNavigationRoute = mockRouterMethods.post.mock.calls[0][1]
		let mockUser = { canViewEditor: true }
		mockReq.getCurrentUser.mockReturnValueOnce(Promise.resolve(mockUser))

		return courseNavigationRoute(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.redirect).toBeCalledWith('/editor')
			expect(mockNext).not.toBeCalled()
		})
	})

	test('course_navigation returns a 403 if user does not have access', () => {
		expect.assertions(4)
		let courseNavigationRoute = mockRouterMethods.post.mock.calls[0][1]
		let mockUser = { canViewEditor: false }
		mockReq.getCurrentUser.mockReturnValueOnce(Promise.resolve(mockUser))

		// mock method chaining on res.satus
		mockRes.status.mockReturnValueOnce({ send: mockRes.send })

		return courseNavigationRoute(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.redirect).not.toBeCalled()
			expect(mockNext).not.toBeCalled()
			expect(mockRes.status).toBeCalledWith(403)
			expect(mockRes.send).toBeCalledWith('Unauthorized')
		})
	})

	test('course_navigation silently calls next on an error', () => {
		expect.assertions(5)
		let courseNavigationRoute = mockRouterMethods.post.mock.calls[0][1]
		mockReq.getCurrentUser.mockRejectedValueOnce('whoopths')
		return courseNavigationRoute(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.redirect).not.toBeCalled()
			expect(mockRes.status).not.toBeCalled()
			expect(mockRes.render).not.toBeCalled()
			expect(mockRes.send).not.toBeCalled()
			expect(mockNext).toBeCalledWith('whoopths')
		})
	})

	test('canvas resource_selection requires a user', () => {
		expect.assertions(5)
		let resourceSelectionRoute = mockRouterMethods.post.mock.calls[1][1]
		mockReq.getCurrentUser.mockRejectedValueOnce('whoopths')
		return resourceSelectionRoute(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.redirect).not.toBeCalled()
			expect(mockRes.status).not.toBeCalled()
			expect(mockRes.render).not.toBeCalled()
			expect(mockRes.send).not.toBeCalled()
			expect(mockNext).toBeCalledWith('whoopths')
		})
	})

	test('canvas resource_selection requires a user with permissions', () => {
		expect.assertions(5)
		let resourceSelectionRoute = mockRouterMethods.post.mock.calls[1][1]
		let mockUser = { canViewEditor: false }
		mockReq.getCurrentUser.mockReturnValueOnce(Promise.resolve(mockUser))
		// mock method chaining on res.satus
		mockRes.status.mockReturnValueOnce({ send: mockRes.send })
		return resourceSelectionRoute(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.redirect).not.toBeCalled()
			expect(mockRes.render).not.toBeCalled()
			expect(mockNext).not.toBeCalled()
			expect(mockRes.status).toBeCalledWith(403)
			expect(mockRes.send).toBeCalledWith('Unauthorized')
		})
	})

	test('canvas resource_selection errors with no returnUrl', () => {
		expect.assertions(4)
		let resourceSelectionRoute = mockRouterMethods.post.mock.calls[1][1]
		let mockUser = { canViewEditor: true }
		mockReq.getCurrentUser.mockReturnValueOnce(Promise.resolve(mockUser))
		// mock method chaining on res.satus
		mockRes.status.mockReturnValueOnce({ send: mockRes.send })
		return resourceSelectionRoute(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.redirect).not.toBeCalled()
			expect(mockRes.status).not.toBeCalled()
			expect(mockRes.send).not.toBeCalled()
			expect(mockNext).toBeCalledWith('Unknown return url for assignment selection')
		})
	})

	test('canvas resource_selection renders with return url and assignment', () => {
		expect.assertions(4)
		let resourceSelectionRoute = mockRouterMethods.post.mock.calls[1][1]
		let mockUser = { canViewEditor: true }
		mockReq.lti = {
			body: {
				content_item_return_url: 'zombocom',
				ext_lti_assignment_id: 999
			}
		}
		mockReq.getCurrentUser.mockReturnValueOnce(Promise.resolve(mockUser))
		// mock method chaining on res.satus
		mockRes.status.mockReturnValueOnce({ send: mockRes.send })
		return resourceSelectionRoute(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.redirect).not.toBeCalled()
			expect(mockRes.status).not.toBeCalled()
			expect(mockRes.send).not.toBeCalled()
			expect(mockRes.render).toBeCalledWith('lti_picker', {
				isAssignment: true,
				returnUrl: 'zombocom'
			})
		})
	})

	test('canvas resource_selection uses ext_content_return_url to override content_item_return_url', () => {
		expect.assertions(4)
		let resourceSelectionRoute = mockRouterMethods.post.mock.calls[1][1]
		let mockUser = { canViewEditor: true }
		mockReq.lti = {
			body: {
				content_item_return_url: 'zombocom',
				ext_content_return_url: 'newgrounds',
				ext_lti_assignment_id: 999
			}
		}
		mockReq.getCurrentUser.mockReturnValueOnce(Promise.resolve(mockUser))
		// mock method chaining on res.satus
		mockRes.status.mockReturnValueOnce({ send: mockRes.send })
		return resourceSelectionRoute(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.redirect).not.toBeCalled()
			expect(mockRes.status).not.toBeCalled()
			expect(mockRes.send).not.toBeCalled()
			expect(mockRes.render).toBeCalledWith('lti_picker', {
				isAssignment: true,
				returnUrl: 'newgrounds'
			})
		})
	})

	test('canvas resource_selection renders non assignments correctly', () => {
		expect.assertions(4)
		let resourceSelectionRoute = mockRouterMethods.post.mock.calls[1][1]
		let mockUser = { canViewEditor: true }
		mockReq.lti = {
			body: {
				content_item_return_url: 'zombocom'
			}
		}
		mockReq.getCurrentUser.mockReturnValueOnce(Promise.resolve(mockUser))
		// mock method chaining on res.satus
		mockRes.status.mockReturnValueOnce({ send: mockRes.send })
		return resourceSelectionRoute(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.redirect).not.toBeCalled()
			expect(mockRes.status).not.toBeCalled()
			expect(mockRes.send).not.toBeCalled()
			expect(mockRes.render).toBeCalledWith('lti_picker', {
				isAssignment: false,
				returnUrl: 'zombocom'
			})
		})
	})

	test('canvas editor_button, assingment_selection, and resource_selection share the same method', () => {
		expect.assertions(2)
		let resourceSelectionRoute = mockRouterMethods.post.mock.calls[1][1]
		let editorButtonRoute = mockRouterMethods.post.mock.calls[2][1]
		let assignmentSelectionRoute = mockRouterMethods.post.mock.calls[3][1]

		expect(resourceSelectionRoute).toBe(editorButtonRoute)
		expect(resourceSelectionRoute).toBe(assignmentSelectionRoute)
	})
})
