import { shallow } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

const mockStylableText = props => <div {...props} className={'mockStylableText'} />
const mockScrollIntoView = jest.fn()
// Common
jest.mock('../../../src/scripts/common/index', () => ({
	models: {
		OboModel: {
			models: {
				5: {
					getDomEl: jest.fn(() => ({
						scrollIntoView: mockScrollIntoView
					}))
				}
			}
		}
	},
	util: {
		getBackgroundImage: jest.fn()
	},
	text: {
		StyleableText: mockStylableText,
		StyleableTextComponent: jest.fn()
	}
}))

// NavUtil
jest.mock('../../../src/scripts/viewer/util/nav-util', () => ({
	canNavigate: jest.fn(),
	gotoPath: jest.fn(),
	toggle: jest.fn(),
	getOrderedList: jest.fn()
}))

// NavStore
jest.mock('../../../src/scripts/viewer/stores/nav-store', () => ({}))

const Common = require('../../../src/scripts/common/index')
const NavUtil = require('../../../src/scripts/viewer/util/nav-util')
const Nav = require('../../../src/scripts/viewer/components/nav').default

describe('Nav', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('renders opened', () => {
		NavUtil.getOrderedList.mockReturnValueOnce([])
		let props = {
			navState: {
				open: false,
				locked: true
			}
		}
		const component = renderer.create(<Nav {...props} />)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders closed', () => {
		NavUtil.getOrderedList.mockReturnValueOnce([])
		let props = {
			navState: {
				open: true,
				locked: true
			}
		}
		const component = renderer.create(<Nav {...props} />)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders unlocked', () => {
		NavUtil.getOrderedList.mockReturnValueOnce([])
		let props = {
			navState: {
				open: false,
				locked: false
			}
		}
		const component = renderer.create(<Nav {...props} />)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders all list item types', () => {
		NavUtil.getOrderedList.mockReturnValueOnce([
			{
				id: 4,
				type: 'heading',
				label: 'label4'
			},
			{
				id: 5,
				type: 'link',
				label: 'label5',
				flags: {
					visited: false,
					complete: false,
					correct: false
				}
			},
			// test StyleableText
			{
				id: 5,
				type: 'link',
				label: new mockStylableText({ text: 'mockMe' }),
				flags: {
					visited: false,
					complete: false,
					correct: false
				}
			},
			// flip the flags
			{
				id: 56,
				type: 'link',
				label: 'label56',
				flags: {
					visited: true,
					complete: true,
					correct: true
				}
			},
			{
				id: 6,
				type: 'sub-link',
				label: 'label6',
				flags: {
					correct: false
				}
			},
			{
				type: 'seperator'
			}
		])
		let props = {
			navState: {
				open: false,
				locked: true,
				navTargetId: 56 // select this item
			}
		}
		const component = renderer.create(<Nav {...props} />)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('onClick link checks NavUtil.canNavigate and changes the page', () => {
		NavUtil.getOrderedList.mockReturnValueOnce([
			{
				id: 5,
				type: 'link',
				label: 'label',
				fullPath: 'mockFullPath',
				flags: {
					visited: false,
					complete: false,
					correct: false
				}
			}
		])
		let props = {
			navState: {
				open: false,
				locked: true,
				navTargetId: 5 // select this item
			}
		}
		const el = shallow(<Nav {...props} />)

		NavUtil.canNavigate.mockReturnValueOnce(false)
		expect(NavUtil.canNavigate).not.toHaveBeenCalled()
		el.find('li').simulate('click')
		expect(NavUtil.canNavigate).toHaveBeenCalledWith(props.navState)
		expect(NavUtil.gotoPath).not.toHaveBeenCalled()

		NavUtil.canNavigate.mockReset()
		expect(NavUtil.canNavigate).not.toHaveBeenCalled()
		NavUtil.canNavigate.mockReturnValueOnce(true)
		el.find('li').simulate('click')
		expect(NavUtil.canNavigate).toHaveBeenCalledWith(props.navState)
		expect(NavUtil.gotoPath).toHaveBeenCalledWith('mockFullPath')
	})

	test('onClick sub-link scrolls to the chunk', () => {
		NavUtil.getOrderedList.mockReturnValueOnce([
			{
				id: 5,
				type: 'sub-link',
				label: 'label',
				flags: {
					correct: false
				}
			}
		])
		let props = {
			navState: {
				open: false,
				locked: true,
				navTargetId: 5 // select this item
			}
		}

		const el = shallow(<Nav {...props} />)

		el.find('li').simulate('click')
		expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
	})

	test('mouseOver button applies expected styles when not open', () => {
		NavUtil.getOrderedList.mockReturnValue([])
		let props = {
			navState: {
				open: false,
				locked: true
			}
		}

		const el = shallow(<Nav {...props} />)
		expect(el.state()).toHaveProperty('hover', false)

		const button = el.find('.toggle-button')
		button.simulate('mouseover')

		expect(el.state()).toHaveProperty('hover', true)
		expect(button.prop('style')).toHaveProperty('transform', '')
	})

	test('mouseOver button applies expected styles when not open', () => {
		NavUtil.getOrderedList.mockReturnValue([])
		let props = {
			navState: {
				open: false,
				locked: true
			}
		}

		const el = shallow(<Nav {...props} />)
		expect(el.state()).toHaveProperty('hover', false)

		let button = el.find('.toggle-button')
		button.simulate('mouseover')

		// get the updated button
		button = el.find('.toggle-button')

		expect(el.state()).toHaveProperty('hover', true)
		expect(button.prop('style')).toHaveProperty('transform', 'rotate(180deg)')
	})
})
