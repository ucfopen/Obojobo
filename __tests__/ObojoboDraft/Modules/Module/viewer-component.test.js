import React from 'react'
import TestRenderer from 'react-test-renderer'
import { shallow } from 'enzyme'

jest.mock('../../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../../src/scripts/common/flux/dispatcher', () => ({
	trigger: jest.fn(),
	on: jest.fn()
}))

import Module from '../../../../ObojoboDraft/Modules/Module/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import NavUtil from '../../../../src/scripts/viewer/util/nav-util'
import Dispatcher from '../../../../src/scripts/common/flux/dispatcher'

const json = require('../../../../test-object.json')

describe('Module', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Module component', () => {
		const model = OboModel.create(json)
		const moduleData = {
			focusState: {},
			navState: {}
		}
		const renderer = TestRenderer.create(<Module model={model} moduleData={moduleData} />)
		const tree = renderer.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Module component with child', () => {
		const model = OboModel.create(json)
		const moduleData = {
			focusState: {},
			navState: {}
		}
		const mockGetComponentClass = jest.fn().mockReturnValueOnce('MockComponent')

		NavUtil.getNavTargetModel.mockReturnValueOnce({
			getComponentClass: mockGetComponentClass
		})

		const renderer = TestRenderer.create(<Module model={model} moduleData={moduleData} />)
		const tree = renderer.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Updated navTargetId causes viewer:focusOnContent to fire', () => {
		const model = OboModel.create(json)
		const moduleData = {
			focusState: {},
			navState: {
				navTargetId: 'mock-nav-target-id'
			}
		}
		const component = shallow(<Module model={model} moduleData={moduleData} />)

		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		component.setProps({
			moduleData: {
				focusState: {},
				navState: {
					navTargetId: 'mock-nav-target-id'
				}
			}
		})
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		component.setProps({
			moduleData: {
				focusState: {},
				navState: {
					navTargetId: 'new-nav-target-id'
				}
			}
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('viewer:focusOnContent')
		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
	})

	test('Component calls focus in componentDidUpdate on component with focus', () => {
		const mockPage1Element = {
			focus: jest.fn(),
			contains: jest.fn()
		}
		mockPage1Element.contains.mockReturnValueOnce(false)

		const model = OboModel.create(json)
		const moduleData = {
			focusState: {
				focussedId: 'page-1'
			},
			navState: {
				navTargetId: 'mock-nav-target-id'
			}
		}
		OboModel.prototype.getDomEl = jest.fn()
		OboModel.prototype.getDomEl.mockReturnValueOnce(mockPage1Element)

		// Mock document.getElementById:
		const origGetElementById = document.getElementById
		document.getElementById = jest.fn()
		document.getElementById.mockReturnValueOnce(mockPage1Element)

		// Mock document.activeElement:
		const origActiveElement = document.activeElement
		Object.defineProperty(document, 'activeElement', {
			value: null,
			enumerable: true,
			configurable: true
		})

		// Mock body.contains
		const origBodyContains = document.body.contains
		document.body.contains = jest.fn()
		document.body.contains.mockReturnValueOnce(true)

		const component = shallow(<Module model={model} moduleData={moduleData} />)
		component.instance().forceUpdate()

		expect(mockPage1Element.focus).toHaveBeenCalledTimes(1)

		// Restore overrides:
		Object.defineProperty(document, 'activeElement', {
			value: origActiveElement
		})
		document.body.contains = origBodyContains
		document.getElementById = origGetElementById
	})

	test('Component does not call focus in componentDidUpdate if no component has focus', () => {
		const mockPage1Element = {
			focus: jest.fn()
		}

		const model = OboModel.create(json)
		const moduleData = {
			focusState: {},
			navState: {
				navTargetId: 'mock-nav-target-id'
			}
		}
		OboModel.prototype.getDomEl = jest.fn()
		OboModel.prototype.getDomEl.mockReturnValueOnce(mockPage1Element)

		// Mock document.getElementById:
		const origGetElementById = document.getElementById
		document.getElementById = jest.fn()
		document.getElementById.mockReturnValueOnce(mockPage1Element)

		// Mock document.activeElement:
		const origActiveElement = document.activeElement
		Object.defineProperty(document, 'activeElement', {
			value: null,
			enumerable: true,
			configurable: true
		})

		// Mock body.contains
		const origBodyContains = document.body.contains
		document.body.contains = jest.fn()
		document.body.contains.mockReturnValueOnce(true)

		const component = shallow(<Module model={model} moduleData={moduleData} />)
		component.instance().forceUpdate()

		expect(mockPage1Element.focus).not.toHaveBeenCalled()

		// Restore overrides:
		Object.defineProperty(document, 'activeElement', {
			value: origActiveElement
		})
		document.body.contains = origBodyContains
		document.getElementById = origGetElementById
	})

	test('Component does not call focus in componentDidUpdate if body does not contain the element', () => {
		const mockPage1Element = {
			focus: jest.fn()
		}

		const model = OboModel.create(json)
		const moduleData = {
			focusState: {
				focussedId: 'page-1'
			},
			navState: {
				navTargetId: 'mock-nav-target-id'
			}
		}
		OboModel.prototype.getDomEl = jest.fn()
		OboModel.prototype.getDomEl.mockReturnValueOnce(mockPage1Element)

		// Mock document.getElementById:
		const origGetElementById = document.getElementById
		document.getElementById = jest.fn()
		document.getElementById.mockReturnValueOnce(mockPage1Element)

		// Mock document.activeElement:
		const origActiveElement = document.activeElement
		Object.defineProperty(document, 'activeElement', {
			value: null,
			enumerable: true,
			configurable: true
		})

		// Mock body.contains
		const origBodyContains = document.body.contains
		document.body.contains = jest.fn()
		document.body.contains.mockReturnValueOnce(false)

		const component = shallow(<Module model={model} moduleData={moduleData} />)
		component.instance().forceUpdate()

		expect(mockPage1Element.focus).not.toHaveBeenCalled()

		// Restore overrides:
		Object.defineProperty(document, 'activeElement', {
			value: origActiveElement
		})
		document.body.contains = origBodyContains
		document.getElementById = origGetElementById
	})

	test('Component does not call focus in componentDidUpdate if element already has focus', () => {
		const mockPage1Element = {
			focus: jest.fn(),
			contains: jest.fn()
		}
		mockPage1Element.contains.mockReturnValueOnce(true)

		const model = OboModel.create(json)
		const moduleData = {
			focusState: {
				focussedId: 'page-1'
			},
			navState: {
				navTargetId: 'mock-nav-target-id'
			}
		}
		OboModel.prototype.getDomEl = jest.fn()
		OboModel.prototype.getDomEl.mockReturnValueOnce(mockPage1Element)

		// Mock document.getElementById:
		const origGetElementById = document.getElementById
		document.getElementById = jest.fn()
		document.getElementById.mockReturnValueOnce(mockPage1Element)

		// Mock document.activeElement:
		const origActiveElement = document.activeElement
		Object.defineProperty(document, 'activeElement', {
			value: mockPage1Element,
			enumerable: true,
			configurable: true
		})

		// Mock body.contains
		const origBodyContains = document.body.contains
		document.body.contains = jest.fn()
		document.body.contains.mockReturnValueOnce(true)

		const component = shallow(<Module model={model} moduleData={moduleData} />)
		component.instance().forceUpdate()

		expect(mockPage1Element.focus).not.toHaveBeenCalled()

		// Restore overrides:
		Object.defineProperty(document, 'activeElement', {
			value: origActiveElement
		})
		document.body.contains = origBodyContains
		document.getElementById = origGetElementById
	})
})
