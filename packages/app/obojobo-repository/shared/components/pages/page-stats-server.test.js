import React from 'react'
import PageStatsServer from './page-stats-server'
import { shallow } from 'enzyme'

jest.mock('../../react-utils')
jest.mock('../stats-hoc')
jest.mock('../../reducers/stats-reducer')

const ReactUtils = require('../../react-utils')
const Stats = require('../stats-hoc')
const StatsReducer = require('../../reducers/stats-reducer')
const LayoutDefault = require('../layouts/default')

describe('Server-side Stats Page', () => {
	test('renders and runs functions correctly with default props', () => {
		const mockStore = {
			mockStoreKey: 'mockStoreVal'
		}

		ReactUtils.propsToStore.mockReturnValueOnce(mockStore)

		const component = shallow(<PageStatsServer />)

		expect(ReactUtils.convertPropsToString).toHaveBeenCalledTimes(1)
		expect(ReactUtils.convertPropsToString).toHaveBeenCalledWith(PageStatsServer.defaultProps)

		expect(ReactUtils.propsToStore).toHaveBeenCalledTimes(1)
		expect(ReactUtils.propsToStore).toHaveBeenCalledWith(StatsReducer, PageStatsServer.defaultProps)

		expect(ReactUtils.createCommonReactApp).toHaveBeenCalledTimes(1)
		expect(ReactUtils.createCommonReactApp).toHaveBeenCalledWith(Stats, mockStore)

		expect(component.find(LayoutDefault).length).toBe(1)
	})
})
