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
				// create all the router verbs as jest functions
				const theVerbs = ['all', 'get', 'post', 'delete', 'put']
				const mockVerbs = {}
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
