import React from 'react'
import PageAdminServer from './page-admin-server'
import { shallow } from 'enzyme'

jest.mock('../../react-utils')
jest.mock('../admin-hoc')
jest.mock('../../reducers/admin-reducer')

const ReactUtils = require('../../react-utils')
const Admin = require('../admin-hoc')
const AdminReducer = require('../../reducers/admin-reducer')
const LayoutDefault = require('../layouts/default')

describe('Server-side Admin Page', () => {
	test('renders and runs functions correctly with default props', () => {
		const mockStore = {
			mockStoreKey: 'mockStoreVal'
		}

		ReactUtils.propsToStore.mockReturnValueOnce(mockStore)

		const component = shallow(<PageAdminServer />)

		expect(ReactUtils.convertPropsToString).toHaveBeenCalledTimes(1)
		expect(ReactUtils.convertPropsToString).toHaveBeenCalledWith(PageAdminServer.defaultProps)

		expect(ReactUtils.propsToStore).toHaveBeenCalledTimes(1)
		expect(ReactUtils.propsToStore).toHaveBeenCalledWith(AdminReducer, PageAdminServer.defaultProps)

		expect(ReactUtils.createCommonReactApp).toHaveBeenCalledTimes(1)
		expect(ReactUtils.createCommonReactApp).toHaveBeenCalledWith(Admin, mockStore)

		expect(component.find(LayoutDefault).length).toBe(1)
	})
})
