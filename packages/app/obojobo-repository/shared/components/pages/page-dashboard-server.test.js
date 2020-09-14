import React from 'react'
import PageDashboardServer from './page-dashboard-server'
import { shallow } from 'enzyme'

jest.mock('../../react-utils')
jest.mock('../dashboard-hoc')
jest.mock('../../reducers/dashboard-reducer')

const ReactUtils = require('../../react-utils')
const Dashboard = require('../dashboard-hoc')
const DashboardReducer = require('../../reducers/dashboard-reducer')
const LayoutDefault = require('../layouts/default')

describe('Server-side Dashboard Page', () => {
	test('renders and runs functions correctly with default props', () => {
		const mockStore = {
			mockStoreKey: 'mockStoreVal'
		}

		ReactUtils.propsToStore.mockReturnValueOnce(mockStore)

		const component = shallow(<PageDashboardServer />)

		expect(ReactUtils.convertPropsToString).toHaveBeenCalledTimes(1)
		expect(ReactUtils.convertPropsToString).toHaveBeenCalledWith(PageDashboardServer.defaultProps)

		expect(ReactUtils.propsToStore).toHaveBeenCalledTimes(1)
		expect(ReactUtils.propsToStore).toHaveBeenCalledWith(
			DashboardReducer,
			PageDashboardServer.defaultProps
		)

		expect(ReactUtils.createCommonReactApp).toHaveBeenCalledTimes(1)
		expect(ReactUtils.createCommonReactApp).toHaveBeenCalledWith(Dashboard, mockStore)

		expect(component.find(LayoutDefault).length).toBe(1)
	})
})
