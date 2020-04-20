jest.mock('react-redux')
jest.mock('../actions/dashboard-actions')
jest.mock('./dashboard')

import DashboardActions from '../actions/dashboard-actions'
import Dashboard from './dashboard'

describe('Dashboard HOC', () => {
	test('react-redux.collect is called with the correct arguments', () => {
		const ReactRedux = require('react-redux')

		const mockReduxConnectReturn = jest.fn()
		ReactRedux.connect = jest.fn()
		ReactRedux.connect.mockReturnValue(mockReduxConnectReturn)

		require('./dashboard-hoc')

		expect(ReactRedux.connect).toHaveBeenCalledTimes(1)
		expect(ReactRedux.connect).toHaveBeenCalledWith(null, {
			createNewCollection: DashboardActions.createNewCollection,
			loadCollectionModules: DashboardActions.loadCollectionModules,
			showCollectionManageModules: DashboardActions.showCollectionManageModules,
			collectionAddModule: DashboardActions.collectionAddModule,
			collectionRemoveModule: DashboardActions.collectionRemoveModule,
			showCollectionRename: DashboardActions.showCollectionRename,
			renameCollection: DashboardActions.renameCollection,
			deleteCollection: DashboardActions.deleteCollection,
			createNewModule: DashboardActions.createNewModule,
			closeModal: DashboardActions.closeModal,
			addUserToModule: DashboardActions.addUserToModule,
			loadUsersForModule: DashboardActions.loadUsersForModule,
			deleteModulePermissions: DashboardActions.deleteModulePermissions,
			filterModules: DashboardActions.filterModules,
			filterCollections: DashboardActions.filterCollections,
			deleteModule: DashboardActions.deleteModule,
			showModulePermissions: DashboardActions.showModulePermissions,
			showModuleManageCollections: DashboardActions.showModuleManageCollections,
			loadModuleCollections: DashboardActions.loadModuleCollections,
			moduleAddToCollection: DashboardActions.moduleAddToCollection,
			moduleRemoveFromCollection: DashboardActions.moduleRemoveFromCollection
		})

		expect(mockReduxConnectReturn).toHaveBeenCalledTimes(1)
		expect(mockReduxConnectReturn).toHaveBeenCalledWith(Dashboard)
	})
})
