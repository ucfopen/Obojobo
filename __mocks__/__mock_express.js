// This file is used to set up Mocks for Express Methods and
// Router Methods. It is used primarily in __tests___/routes

let mockExpressMethods = {}
let mockRouterMethods = {}

let mockExpress = () => {
	jest.mock(
		'express',
		() => {
			let module = () => {
				let methods = ['on', 'use', 'get', 'post', 'put', 'delete', 'all', 'static']
				let obj = {}
				methods.forEach(m => {
					obj[m] = mockExpressMethods[m] = jest.fn()
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
		},
		{ virtual: true }
	)
}

mockExpress()

module.exports = {
	mockExpressMethods,
	mockRouterMethods
}
