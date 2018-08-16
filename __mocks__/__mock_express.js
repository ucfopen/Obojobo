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
				// create all the router verbs as jest functions
				let theVerbs = ['all', 'get', 'post', 'delete', 'put']
				let mockVerbs = {}
				theVerbs.forEach(m => {
					mockVerbs[m] = mockRouterMethods[m] = jest.fn().mockReturnValue(mockVerbs)
				})
				mockRouterMethods.route = mockVerbs.route = jest.fn().mockReturnValue(mockVerbs)

				// When route('/website').post() is called
				// we're going to want to know the context for the post
				// so we'll keep the main argument for route in scope
				// obj.route = jest.fn().mockImpleme(theRoute => {

				return mockVerbs
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
