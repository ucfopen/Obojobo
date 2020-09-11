import React from 'react'
import PageModuleServer from './page-module-server'
import { shallow } from 'enzyme'

jest.mock('../../react-utils')

const ReactUtils = require('../../react-utils')
const LayoutDefault = require('../layouts/default')

describe('Server-side Module Page', () => {
	test('renders and runs functions correctly with default props', () => {
		const mockProps = {
			appJsUrl: '/path/to/js',
			appCSSUrl: '/path/to/css',
			module: {
				title: 'mockModuleTitle'
			}
		}

		const component = shallow(<PageModuleServer {...mockProps} />)

		expect(ReactUtils.convertPropsToString).toHaveBeenCalledTimes(1)
		expect(ReactUtils.convertPropsToString).toHaveBeenCalledWith(mockProps)

		expect(component.find(LayoutDefault).length).toBe(1)
		expect(component.find(LayoutDefault).props().title).toBe(
			`${mockProps.module.title} - an Obojobo Module`
		)
	})
})
