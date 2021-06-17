jest.mock('react-redux')
jest.mock('../actions/stats-actions')
jest.mock('./stats', () => ({}))

import StatsActions from '../actions/stats-actions'
import Stats from './stats'

describe('stats HOC', () => {
	test('redux collect is called with the correct arguments', () => {
		const ReactRedux = require('react-redux')

		const mockReduxConnectReturn = jest.fn()
		ReactRedux.connect = jest.fn(mapStoreStateToProps => {
			//the first argument to 'connect' is a private (untestable) method in the HOC
			//that method will never be 'covered' unless we call it like this
			//since we also know that it should just return what it's given, we can test that too
			const mapStoreStateToPropsArgs = { testKey: 'testProp' }
			const mapStoreStateToPropsReturn = mapStoreStateToProps(mapStoreStateToPropsArgs)
			expect(mapStoreStateToPropsReturn).toStrictEqual(mapStoreStateToPropsArgs)
			return mockReduxConnectReturn
		})

		require('./stats-hoc')

		expect(ReactRedux.connect).toHaveBeenCalledTimes(1)
		expect(ReactRedux.connect).toHaveBeenCalledWith(expect.any(Function), {
			loadModuleAssessmentAnalytics: StatsActions.loadModuleAssessmentAnalytics
		})

		expect(mockReduxConnectReturn).toHaveBeenCalledTimes(1)
		expect(mockReduxConnectReturn).toHaveBeenCalledWith(Stats)
	})
})
