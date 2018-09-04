// This file is used to set up Mocks for Express Methods and
// Router Methods. It is used primarily in __tests___/routes

const mockExpressMethods = {}
const mockRouterMethods = {}

const mockExpress = () => {
	jest.mock(
		'express',
		() => {
			const module = () => {
				const methods = ['on', 'use', 'get', 'post', 'put', 'delete', 'all', 'static']
				const obj = {}
				methods.forEach(m => {
					obj[m] = mockExpressMethods[m] = jest.fn()
				})
				return obj
			}

			module.Router = () => {
				const methods = ['all', 'get', 'post', 'delete', 'put']
				const obj = {}
				methods.forEach(m => {
					obj[m] = mockRouterMethods[m] = jest.fn()
				})
				return obj
			}

			return module
		},
		{ virtual: true }
	)
}

mockExpress()

module.exports = {
	mockExpressMethods,
	mockRouterMethods
}
