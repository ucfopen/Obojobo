const express = require('express')

describe('middleware', () => {
	test.skip('calls with no errors', () => {
		let middleware = require('../middleware.default')
		let mockApp = {
			get: jest.fn().mockReturnValueOnce('production'),
			use: jest.fn(),
			locals: {}
		}

		middleware(mockApp)
		expect(mockApp.get).toHaveBeenCalled()
		expect(mockApp.use).toHaveBeenCalled()
	})
})
