import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import { Transforms } from 'slate'
jest.mock('slate')
jest.mock('slate-react')

import Link from './link'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import ClipboardUtil from 'src/scripts/oboeditor/util/clipboard-util'
jest.mock('src/scripts/oboeditor/util/clipboard-util')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)

describe('Link', () => {
	beforeAll(() => {
		document.getSelection = jest.fn()
		document.execCommand = jest.fn()
	})
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('Link component', () => {
		const component = renderer.create(<Link element={{ href: 'http://mock href' }} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Link component edits', () => {
		const component = mount(<Link element={{ href: 'http://mock href' }} selected={true} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(ClipboardUtil.copyToClipboard).toHaveBeenCalled()
	})

	test('Link component edits', () => {
		const component = mount(<Link element={{ href: 'mock href' }} selected={true} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('Link component edits', () => {
		const component = mount(<Link element={{ href: 'mock href' }} selected={true} />)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(Transforms.unwrapNodes).toHaveBeenCalled()
	})

	test('changeLinkValue edits the href with empty href', () => {
		const component = mount(<Link element={{ href: 'mock href' }} />)

		component.instance().changeLinkValue(' ')

		expect(Transforms.unwrapNodes).toHaveBeenCalled()
	})

	test('changeLinkValue edits the href', () => {
		const component = mount(<Link element={{ href: 'mock href' }} />)

		component.instance().changeLinkValue('mock href')

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('componentDidUpdate calls stopObservering and resets menuTranslateX if props.selected transitions from true to false', () => {
		const thisValue = {
			props: {
				selected: false
			},
			startObservingForIntersectionChanges: jest.fn(),
			stopObserveringForIntersectionChanges: jest.fn(),
			setState: jest.fn()
		}

		// selected: false -> false
		Link.prototype.componentDidUpdate.bind(thisValue)({ selected: false })
		expect(thisValue.startObservingForIntersectionChanges).not.toHaveBeenCalled()
		expect(thisValue.stopObserveringForIntersectionChanges).not.toHaveBeenCalled()
		expect(thisValue.setState).not.toHaveBeenCalled()

		// selected: true -> false
		Link.prototype.componentDidUpdate.bind(thisValue)({ selected: true })
		expect(thisValue.startObservingForIntersectionChanges).not.toHaveBeenCalled()
		expect(thisValue.stopObserveringForIntersectionChanges).toHaveBeenCalled()
		expect(thisValue.setState).toHaveBeenCalledWith({ menuTranslateX: 0 })
	})

	test('componentDidUpdate calls startObservering if props.selected transitions from false to true', () => {
		const thisValue = {
			props: {
				selected: true
			},
			startObservingForIntersectionChanges: jest.fn(),
			stopObserveringForIntersectionChanges: jest.fn(),
			setState: jest.fn()
		}

		// selected: true -> true
		Link.prototype.componentDidUpdate.bind(thisValue)({ selected: true })
		expect(thisValue.startObservingForIntersectionChanges).not.toHaveBeenCalled()
		expect(thisValue.stopObserveringForIntersectionChanges).not.toHaveBeenCalled()
		expect(thisValue.setState).not.toHaveBeenCalled()

		// selected: false -> true
		Link.prototype.componentDidUpdate.bind(thisValue)({ selected: false })
		expect(thisValue.startObservingForIntersectionChanges).toHaveBeenCalled()
		expect(thisValue.stopObserveringForIntersectionChanges).not.toHaveBeenCalled()
		expect(thisValue.setState).not.toHaveBeenCalledWith()
	})

	test('stopObservingForIntersectionChanges disconnects and deletes any observers', () => {
		expect(Link.prototype.stopObserveringForIntersectionChanges.bind({})()).toBe(false)

		const mockDisconnect = jest.fn()
		const thisValue = {
			observer: {
				disconnect: mockDisconnect
			}
		}
		expect(Link.prototype.stopObserveringForIntersectionChanges.bind(thisValue)()).toBe(true)
		expect(thisValue.observer).not.toBeDefined()
	})

	test('startObservingForIntersectionChanges creates a new IntersectionObserver and calls observe', () => {
		const oldIntersectionObserver = window.IntersectionObserver

		// Mock IntersectionObserver
		window.IntersectionObserver = jest.fn()
		window.IntersectionObserver.prototype.observe = jest.fn()

		// Mock the component this
		const thisValue = {
			onIntersectionChange: jest.fn(),
			hrefMenuRef: {
				current: jest.fn()
			}
		}

		Link.prototype.startObservingForIntersectionChanges.bind(thisValue)()

		// Expect for this.observer to have been created and the observe method called
		expect(thisValue.observer).toBeDefined()
		expect(window.IntersectionObserver).toHaveBeenCalledWith(thisValue.onIntersectionChange, {
			root: null,
			rootMargin: '0px',
			threshold: 1
		})
		expect(thisValue.observer.observe).toHaveBeenCalledWith(thisValue.hrefMenuRef.current)

		// Restore the actual IntersectionObserver
		window.IntersectionObserver = oldIntersectionObserver
	})

	test('onIntersectionChange does nothing if state.menuTranslateX is > 0', () => {
		expect(
			Link.prototype.onIntersectionChange.bind({
				state: {
					menuTranslateX: 0.001
				}
			})()
		).toBe(false)
	})

	test('onIntersectionChange sets menuTranslateX to a calculated value if the intersectionRatio is below 1', () => {
		const thisValue = {
			state: {
				menuTranslateX: 0
			},
			setState: jest.fn(),
			hrefMenuRef: {
				current: {
					getBoundingClientRect: () => ({ width: 123 })
				}
			}
		}
		const changes = [
			{
				intersectionRatio: 0.9
			}
		]

		expect(Link.prototype.onIntersectionChange.bind(thisValue)(changes)).toBe(true)

		expect(thisValue.setState).toHaveBeenCalledWith({
			menuTranslateX: (1 - 0.9) * 123 + 1
		})
	})

	test('onIntersectionChange sets menuTranslateX to 0 if the intersectionRatio is 1 or higher', () => {
		const thisValue = {
			state: {
				menuTranslateX: 0
			},
			setState: jest.fn(),
			hrefMenuRef: {
				current: {
					getBoundingClientRect: () => ({ width: 123 })
				}
			}
		}
		const changes = [
			{
				intersectionRatio: 1
			}
		]

		expect(Link.prototype.onIntersectionChange.bind(thisValue)(changes)).toBe(true)

		expect(thisValue.setState).toHaveBeenCalledWith({
			menuTranslateX: 0
		})
	})
})
