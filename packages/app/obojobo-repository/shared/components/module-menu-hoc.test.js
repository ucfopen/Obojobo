jest.mock('react-redux')
jest.mock('../actions/dashboard-actions')
jest.mock('./module-menu', () => ({}))

import DashboardActions from '../actions/dashboard-actions'
import ModuleMenu from './module-menu'

describe('ModuleMenu HOC', () => {
	test('redux collect is called with the correct arguments', () => {
		const ReactRedux = require('react-redux')

		const mockReduxConnectReturn = jest.fn()
		ReactRedux.connect = jest.fn()
		ReactRedux.connect.mockReturnValue(mockReduxConnectReturn)

		require('./module-menu-hoc')

		expect(ReactRedux.connect).toHaveBeenCalledTimes(1)
		expect(ReactRedux.connect).toHaveBeenCalledWith(null, {
			showModulePermissions: DashboardActions.showModulePermissions,
			deleteModule: DashboardActions.deleteModule,
			showModuleMore: DashboardActions.showModuleMore,
			showModuleSync: DashboardActions.showModuleSync
		})

		expect(mockReduxConnectReturn).toHaveBeenCalledTimes(1)
		expect(mockReduxConnectReturn).toHaveBeenCalledWith(ModuleMenu)
	})
})
