jest.mock('react-redux')
jest.mock('../actions/dashboard-actions')
jest.mock('./people-search-dialog', () => ({}))

import DashboardActions from '../actions/dashboard-actions'
import PeopleSearchDialog from './people-search-dialog'

describe('PeopleSearchDialog HOC', () => {
	test('redux collect is called with the correct arguments', () => {
		const ReactRedux = require('react-redux')

		const mockReduxConnectReturn = jest.fn()
		ReactRedux.connect = jest.fn(mapStoreStateToProps => {
			//the first argument to 'connect' is a private (untestable) method in the HOC
			//that method will never be 'covered' unless we call it like this
			//since we also know what it should return with what it's given, we can test that too
			const mapStoreStateToPropsArgs = {
				searchPeople: {
					items: [{ mockItemKey: 'mockItemVal' }]
				},
				shareSearchString: 'mockSearchString'
			}
			const mapStoreStateToPropsReturn = mapStoreStateToProps(mapStoreStateToPropsArgs)
			expect(mapStoreStateToPropsReturn).toEqual({
				people: [{ mockItemKey: 'mockItemVal' }],
				searchString: 'mockSearchString'
			})
			return mockReduxConnectReturn
		})

		require('./people-search-dialog-hoc')

		expect(ReactRedux.connect).toHaveBeenCalledTimes(1)
		expect(ReactRedux.connect).toHaveBeenCalledWith(expect.any(Function), {
			onSearchChange: DashboardActions.searchForUser,
			clearPeopleSearchResults: DashboardActions.clearPeopleSearchResults
		})

		expect(mockReduxConnectReturn).toHaveBeenCalledTimes(1)
		expect(mockReduxConnectReturn).toHaveBeenCalledWith(PeopleSearchDialog)
	})
})
