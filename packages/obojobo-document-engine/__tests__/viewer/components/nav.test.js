import { mount, shallow } from 'enzyme'

import FocusUtil from '../../../src/scripts/viewer/util/focus-util'
import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('../../../src/scripts/common/page/focus')
jest.mock('../../../src/scripts/viewer/util/focus-util')

class MockStylableText {
	constructor(text) {
		this.value = text
	}
}
const mockStylableComponent = props => <div {...props} className={'mockStylableText'} />
const mockScrollIntoView = jest.fn()
const mockFocus = jest.fn()
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
		StyleableText: MockStylableText,
		StyleableTextComponent: mockStylableComponent
	},
	components: {
		Button: require('../../../src/scripts/common/components/button').default
	},
	flux: {
		Dispatcher: {
			trigger: jest.fn()
		}
	},
	page: {
		focus: mockFocus
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

const NavUtil = require('../../../src/scripts/viewer/util/nav-util')
const Nav = require('../../../src/scripts/viewer/components/nav').default

describe('Nav', () => {
	const navItems = [
		{ id: 4, type: 'heading', label: 'label4' },
		{
			id: 5,
			type: 'link',
			label: 'label5',
			flags: { visited: false, complete: false, correct: false }
		}, // content type
		{
			id: 300,
			type: 'link',
			label: 'label300',
			contentType: 'Mock Content Type',
			flags: { visited: false, complete: false, correct: false }
		},
		// subLink with parent
		{
			id: 301,
			type: 'sub-link',
			label: 'label301',
			parent: {
				type: 'link',
				label: 'Parent Label'
			},
			contentType: 'Mock Content Type',
			flags: { visited: false, complete: false, correct: false }
		},
		// test StyleableText
		{
			id: 5,
			type: 'link',
			label: new MockStylableText('mockMe'),
			flags: { visited: false, complete: false, correct: false }
		}, // no label
		{ id: 6, type: 'link', flags: { visited: false, complete: false, correct: false } }, // flip the flags
		{
			id: 56,
			type: 'link',
			label: 'label56',
			flags: { visited: true, complete: true, correct: true }
		},
		{ id: 678, type: 'non-existant-type', label: 'label678', flags: { correct: false } },
		{ id: 6, type: 'sub-link', label: 'label6', flags: { correct: false } }
	]

	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('renders opened', () => {
		NavUtil.getOrderedList.mockReturnValueOnce([])
		const props = {
			navState: {
				open: false,
				locked: true
			}
		}
		const component = renderer.create(<Nav {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders closed', () => {
		NavUtil.getOrderedList.mockReturnValueOnce([])
		const props = {
			navState: {
				open: true,
				locked: true
			}
		}
		const component = renderer.create(<Nav {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders unlocked', () => {
		NavUtil.getOrderedList.mockReturnValueOnce([])
		const props = {
			navState: {
				open: false,
				locked: false
			}
		}
		const component = renderer.create(<Nav {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders all list item types (locked=true)', () => {
		NavUtil.getOrderedList.mockReturnValueOnce(navItems)
		const props = {
			navState: {
				open: false,
				locked: true,
				navTargetId: 56 // select this item
			}
		}
		const component = renderer.create(<Nav {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders all list item types (locked=false)', () => {
		NavUtil.getOrderedList.mockReturnValueOnce(navItems)
		const props = {
			navState: {
				open: false,
				locked: false,
				navTargetId: 56 // select this item
			}
		}
		const component = renderer.create(<Nav {...props} />)
		const tree = component.toJSON()
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
					complete: false,
					correct: false
				}
			}
		])
		const props = {
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
		const props = {
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

	test('onClickSkipNavigation calls FocusUtil.focusOnNavTargetContent', () => {
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
		const props = {
			navState: {
				open: false,
				locked: true,
				navTargetId: 5 // select this item
			}
		}
		const el = shallow(<Nav {...props} />)

		expect(FocusUtil.focusOnNavTargetContent).not.toHaveBeenCalled()
		el.find('.skip-nav-button').simulate('click')
		expect(FocusUtil.focusOnNavTargetContent).toHaveBeenCalledTimes(1)
	})

	test('Clicking on a link calls FocusUtil.focusOnNavigation', () => {
		NavUtil.getOrderedList.mockReturnValue([
			{
				id: 'mock-id',
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
		const props = {
			navState: {
				open: false,
				locked: false,
				navTargetId: 'mock-id' // select this item
			}
		}
		const el = mount(<Nav {...props} />)

		NavUtil.canNavigate.mockReturnValueOnce(true)
		const li = el.find('li')

		expect(FocusUtil.focusOnNavigation).not.toHaveBeenCalled()
		li.simulate('click')
		expect(FocusUtil.focusOnNavigation).toHaveBeenCalledTimes(1)
	})

	test('focus calls focus ', () => {
		NavUtil.getOrderedList.mockReturnValueOnce([])
		const props = {
			navState: {
				open: false,
				locked: true
			}
		}
		const component = renderer.create(<Nav {...props} />)

		const mockSelfRef = jest.fn()
		component.getInstance().refs.self = mockSelfRef
		component.getInstance().focus()
		expect(mockFocus).toHaveBeenCalledWith(mockSelfRef)
	})
})
