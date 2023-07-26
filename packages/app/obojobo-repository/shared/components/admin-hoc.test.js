jest.mock('react-redux')
jest.mock('../actions/admin-actions')
jest.mock('./admin', () => ({}))

import AdminActions from '../actions/admin-actions'
import Admin from './admin'

describe('admin HOC', () => {
	test('redux collect is called with the correct arguments', () => {
		const ReactRedux = require('react-redux')

		const mockReduxConnectReturn = jest.fn()
		ReactRedux.connect = jest.fn(mapStoreStateToProps => {
			// The first argument to 'connect' is a private (untestable) method in the HOC
			// that method will never be 'covered' unless we call it like this
			// since we also know that it should just return what it's given, we can test that too
			const mapStoreStateToPropsArgs = { testKey: 'testProp' }
			const mapStoreStateToPropsReturn = mapStoreStateToProps(mapStoreStateToPropsArgs)
			expect(mapStoreStateToPropsReturn).toStrictEqual(mapStoreStateToPropsArgs)
			return mockReduxConnectReturn
		})

		require('./admin-hoc')

		expect(ReactRedux.connect).toHaveBeenCalledTimes(1)
		expect(ReactRedux.connect).toHaveBeenCalledWith(expect.any(Function), {
			addUserPermission: AdminActions.addUserPermission,
			clearPeopleSearchResults: AdminActions.clearPeopleSearchResults,
			removeUserPermission: AdminActions.removeUserPermission,
			searchForUser: AdminActions.searchForUser
		})

		expect(mockReduxConnectReturn).toHaveBeenCalledTimes(1)
		expect(mockReduxConnectReturn).toHaveBeenCalledWith(Admin)
	})
})
