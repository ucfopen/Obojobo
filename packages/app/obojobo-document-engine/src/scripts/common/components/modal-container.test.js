import React from 'react'
import renderer from 'react-test-renderer'
import ReactDOM from 'react-dom'

import ModalContainer from './modal-container'

describe('ModalContainer', () => {
	test('ModalContainer component', () => {
		// Override watchForPortalContainerMutations so we bypass the MutationObserver
		const spy = jest
			.spyOn(ModalContainer.prototype, 'watchForPortalContainerMutations')
			.mockImplementation(jest.fn())
		const component = renderer.create(<ModalContainer />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		spy.mockRestore()
	})

	test('ModalContainer works with legacy modals', () => {
		// Override watchForPortalContainerMutations so we bypass the MutationObserver
		const spy = jest
			.spyOn(ModalContainer.prototype, 'watchForPortalContainerMutations')
			.mockImplementation(jest.fn())
		const component = renderer.create(
			<ModalContainer modalItem={{ component: <div>modalItem</div> }} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		spy.mockRestore()
	})

	test('ModalContainer works with portal modals', () => {
		// Override watchForPortalContainerMutations so we bypass the MutationObserver
		const spy = jest
			.spyOn(ModalContainer.prototype, 'watchForPortalContainerMutations')
			.mockImplementation(jest.fn())
		const component = renderer.create(
			<ModalContainer modalItem={{ component: <div>modalItem</div> }} />
		)

		component.getInstance().setState({ numPortalElements: 1 })

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		spy.mockRestore()
	})

	test('componentDidMount and onRefChanged call watchForPortalContainerMutations', () => {
		const mockWatchFn = jest.fn()

		ModalContainer.prototype.componentDidMount.bind({
			watchForPortalContainerMutations: mockWatchFn
		})()

		expect(mockWatchFn).toBeCalledTimes(1)

		ModalContainer.prototype.onRefChanged.bind({
			watchForPortalContainerMutations: mockWatchFn
		})()

		expect(mockWatchFn).toBeCalledTimes(2)
	})

	test('onMutation updates state with the number of portal elements', () => {
		const spy = jest
			.spyOn(ReactDOM, 'findDOMNode')
			.mockReturnValue({ children: { length: 'mock-length' } })

		const mockSetState = jest.fn()

		ModalContainer.prototype.onMutation.bind({
			setState: mockSetState
		})()

		expect(mockSetState).toHaveBeenCalledWith({ numPortalElements: 'mock-length' })

		spy.mockRestore()
	})

	test('watchForPortalContainerMutations creates a MutationObserver', () => {
		const originalMutationObserver = global.MutationObserver

		// Override MutationObserver
		const mockObserve = jest.fn()
		const mockDisconnect = jest.fn()
		const mockEl = jest.fn()

		Object.defineProperty(global, 'MutationObserver', {
			value: () => ({
				observe: mockObserve,
				disconnect: mockDisconnect
			}),
			enumerable: true,
			configurable: true
		})

		const spy = jest.spyOn(ReactDOM, 'findDOMNode').mockReturnValue(mockEl)

		const thisVal = {}
		ModalContainer.prototype.watchForPortalContainerMutations.bind(thisVal)()

		expect(thisVal).toEqual({ observer: { observe: mockObserve, disconnect: mockDisconnect } })
		expect(mockDisconnect).toHaveBeenCalled()
		expect(mockObserve).toHaveBeenCalledWith(mockEl, { childList: true })

		spy.mockRestore()
		// Restore MutationObserver
		Object.defineProperty(global, 'MutationObserver', {
			value: originalMutationObserver
		})
	})

	test('watchForPortalContainerMutations reuses a MutationObserver', () => {
		// Override MutationObserver
		const mockObserve = jest.fn()
		const mockDisconnect = jest.fn()
		const mockEl = jest.fn()

		const spy = jest.spyOn(ReactDOM, 'findDOMNode').mockReturnValue(mockEl)

		const thisVal = {
			observer: { observe: mockObserve, disconnect: mockDisconnect }
		}
		ModalContainer.prototype.watchForPortalContainerMutations.bind(thisVal)()

		expect(thisVal).toEqual({ observer: { observe: mockObserve, disconnect: mockDisconnect } })
		expect(mockDisconnect).toHaveBeenCalled()
		expect(mockObserve).toHaveBeenCalledWith(mockEl, { childList: true })

		spy.mockRestore()
	})
})
