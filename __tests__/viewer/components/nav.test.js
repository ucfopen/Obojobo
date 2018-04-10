import React from 'react'
import renderer from 'react-test-renderer'

const mockStylableText = props => <div {...props} className={'mockStylableText'} />

// Common
jest.mock('../../../src/scripts/common/index', () => ({
	models: {
		OboModel: {
			models: {}
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
})
