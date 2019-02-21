/* eslint-disable no-undefined */
/* eslint-disable no-console */

import APIUtil from '../../../src/scripts/viewer/util/api-util'
import AssessmentStore from '../../../src/scripts/viewer/stores/assessment-store'
import Common from '../../../src/scripts/common'
import DOMUtil from '../../../src/scripts/common/page/dom-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import FocusStore from '../../../src/scripts/viewer/stores/focus-store'
import FocusUtil from '../../../src/scripts/viewer/util/focus-util'
import Header from '../../../src/scripts/viewer/components/header'
import MediaStore from '../../../src/scripts/viewer/stores/media-store'
import ModalStore from '../../../src/scripts/common/stores/modal-store'
import ModalUtil from '../../../src/scripts/common/util/modal-util'
import NavStore from '../../../src/scripts/viewer/stores/nav-store'
import NavUtil from '../../../src/scripts/viewer/util/nav-util'
import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'
import React from 'react'
import ReactDOM from 'react-dom'
import ViewerApp from '../../../src/scripts/viewer/components/viewer-app'
import { mount } from 'enzyme'
import testObject from '../../../test-object.json'

jest.mock('../../../src/scripts/viewer/util/api-util')
jest.mock('../../../src/scripts/viewer/stores/question-store')
jest.mock('../../../src/scripts/common/stores/modal-store')
jest.mock('../../../src/scripts/common/util/modal-util')
jest.mock('../../../src/scripts/viewer/stores/focus-store')
jest.mock('../../../src/scripts/viewer/stores/media-store')
jest.mock('../../../src/scripts/viewer/stores/nav-store')
jest.mock('../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../src/scripts/viewer/stores/assessment-store')
jest.mock('../../../src/scripts/viewer/components/nav')
jest.mock('../../../src/scripts/common/page/dom-util')

describe('ViewerApp', () => {
	let isDOMFocusInsideNavSpy

	const mocksForMount = (status = 'ok') => {
		APIUtil.requestStart.mockResolvedValueOnce({
			status: status,
			value: {
				visitId: 123,
				lti: {
					lisOutcomeServiceUrl: 'http://lis-outcome-service-url.test/example.php'
				},
				isPreviewing: true,
				extensions: {
					':ObojoboDraft.Sections.Assessment:attemptHistory': []
				}
			}
		})
		APIUtil.getDraft.mockResolvedValueOnce({ value: testObject })
		NavStore.getState.mockReturnValueOnce({})
		FocusStore.getState.mockReturnValueOnce({})
	}

	beforeEach(() => {
		jest.resetAllMocks()
		jest.restoreAllMocks()

		isDOMFocusInsideNavSpy = jest
			.spyOn(ViewerApp.prototype, 'isDOMFocusInsideNav')
			.mockReturnValue(false)

		FocusUtil.getFocussedItem = FocusUtil.getFocussedItemAndClear = () => ({
			type: null,
			target: null
		})
	})

	afterEach(() => {
		isDOMFocusInsideNavSpy.mockRestore()
	})

	test('viewer:alert calls ModalUtil', () => {
		Dispatcher.trigger('viewer:alert', {
			value: {
				title: 'mockTitle',
				message: 'mockMessage'
			}
		})

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('viewer:scrollTo calls ModalUtil', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			const spy = jest.spyOn(ReactDOM, 'findDOMNode')
			ReactDOM.findDOMNode.mockReturnValueOnce({ scrollTop: null })

			Dispatcher.trigger('viewer:scrollTo', { value: null })

			expect(ReactDOM.findDOMNode).toHaveBeenCalled()

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test("focusOnContent calls a passed in model's component class' focusOnContent method and returns true", done => {
		expect.assertions(3)
		mocksForMount()
		const component = mount(<ViewerApp />)
		const mockComponentFocusOnContent = jest.fn()
		const MockComponentClass = { focusOnContent: mockComponentFocusOnContent }

		setTimeout(() => {
			component.update()

			const mockModel = {
				getComponentClass: () => MockComponentClass
			}

			expect(component.instance().focusOnContent(mockModel)).toBe(true)

			expect(MockComponentClass.focusOnContent).toHaveBeenCalledTimes(1)
			expect(MockComponentClass.focusOnContent).toHaveBeenCalledWith(mockModel)

			component.unmount()
			done()
		})
	})

	test('focusOnContent does not call focus (and returns false) if element cannot be found', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			const mockFocus = jest.fn()
			const origGetElementById = document.getElementById
			document.getElementById = jest.fn()
			document.getElementById.mockReturnValueOnce(null)

			expect(component.instance().focusOnContent()).toBe(false)

			expect(mockFocus).not.toHaveBeenCalled()

			component.unmount()
			document.getElementById = origGetElementById
			done()
		})
	})

	test('focusOnContent returns false if a model has no component class', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			const mockModel = { getComponentClass: () => null }

			expect(component.instance().focusOnContent(mockModel)).toBe(false)

			component.unmount()
			done()
		})
	})

	test('ViewerApp component', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('ViewerApp component with invalid status', done => {
		expect.assertions(2)
		mocksForMount('not ok')

		// No visit or draft id
		const spy = jest.spyOn(String.prototype, 'split').mockReturnValueOnce([])

		// temporarily mock and unmock console.error to prevent logging to screen
		const originalError = console.error
		console.error = jest.fn()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			// restore important globals
			const errorMock = console.error
			console.error = originalError

			expect(component.html()).toMatchSnapshot()
			expect(errorMock).toHaveBeenCalled()

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('ViewerApp component with no update removal', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		// This will be reset by jestReset, and is called multiple times
		NavUtil.canNavigate.mockImplementation(() => {
			// keeps loading element
			component.instance().needsRemoveLoadingElement = false
			// Sets up scrolling
			return 'mockNav'
		})

		setTimeout(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('ViewerApp component with lti service', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.update()
			component.instance().setState({ requestStatus: 'invalid' })

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('ViewerApp component with navTarget', done => {
		expect.assertions(1)
		mocksForMount()

		NavUtil.getNavTarget.mockReturnValueOnce({ label: 'mockTarget' })
		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('ViewerApp component with nav models and titles', done => {
		expect.assertions(1)
		mocksForMount()

		NavUtil.isNavEnabled.mockReturnValueOnce(true)
		NavUtil.canNavigate.mockReturnValueOnce(true)
		NavUtil.getPrev.mockReturnValueOnce({ label: 'mockPrevTitle' })
		NavUtil.getNext.mockReturnValueOnce({ label: 'mockNextTitle' })
		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('ViewerApp component with nav models (no titles)', done => {
		expect.assertions(1)
		mocksForMount()

		NavUtil.isNavEnabled.mockReturnValueOnce(true)
		NavUtil.canNavigate.mockReturnValueOnce(true)
		NavUtil.getPrev.mockReturnValueOnce({})
		NavUtil.getNext.mockReturnValueOnce({})
		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('ViewerApp component without nav models', done => {
		expect.assertions(1)
		mocksForMount()

		NavUtil.isNavEnabled.mockReturnValueOnce(true)
		NavUtil.canNavigate.mockReturnValueOnce(true)
		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('ViewerApp component hidden', done => {
		expect.assertions(1)
		mocksForMount()

		ModalUtil.getCurrentModal.mockReturnValueOnce({ hideViewer: true })
		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('ViewerApp component with states', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.update()
			component.setState({
				navState: {
					locked: true,
					open: true,
					disabled: true
				},
				isPreviewing: false
			})

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('ViewerApp component with ModalContainer', done => {
		expect.assertions(1)
		mocksForMount()

		ModalUtil.getCurrentModal.mockReturnValueOnce({ component: [] })
		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('onNavStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		const spy = jest.spyOn(component.instance(), 'setState')
		NavStore.getState.mockReturnValueOnce({})

		setTimeout(() => {
			component.update()
			component.instance().onNavStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ navState: {} })

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('onQuestionStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			const spy = jest.spyOn(component.instance(), 'setState')
			QuestionStore.getState.mockReturnValueOnce({})

			component.update()
			component.instance().onQuestionStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ questionState: {} })

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('onAssessmentStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			const spy = jest.spyOn(component.instance(), 'setState')
			AssessmentStore.getState.mockReturnValueOnce({})

			component.update()
			component.instance().onAssessmentStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ assessmentState: {} })

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('onModalStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			const spy = jest.spyOn(component.instance(), 'setState')
			ModalStore.getState.mockReturnValueOnce({})

			component.update()
			component.instance().onModalStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ modalState: {} })

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('onFocusStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			const spy = jest.spyOn(component.instance(), 'setState')
			FocusStore.getState.mockReturnValueOnce({})

			component.update()
			component.instance().onFocusStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ focusState: {} })

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('onMediaStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			const spy = jest.spyOn(component.instance(), 'setState')
			MediaStore.getState.mockReturnValueOnce({})

			component.update()
			component.instance().onMediaStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ mediaState: {} })

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('onVisibilityChange calls APIUtil when leaving', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		const originalHidden = document.hidden
		document.hidden = true

		setTimeout(() => {
			APIUtil.postEvent.mockResolvedValueOnce({ value: null })
			component.update()

			component.instance().onVisibilityChange()

			expect(APIUtil.postEvent).toHaveBeenCalledWith({
				action: 'viewer:leave',
				draftId: undefined,
				eventVersion: '1.0.0',
				visitId: undefined
			})

			component.unmount()
			document.hidden = originalHidden
			done()
		})
	})

	test('onVisibilityChange calls APIUtil when returning', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			const dateSpy = jest.spyOn(Date, 'now').mockReturnValueOnce(1000)
			component.instance().leaveEvent = { extensions: { internalEventId: 'mock-id' } }
			component.instance().leftEpoch = 999
			APIUtil.postEvent.mockResolvedValueOnce({ value: null })
			component.update()

			component.instance().onVisibilityChange()

			expect(APIUtil.postEvent).toHaveBeenCalledWith({
				action: 'viewer:return',
				draftId: undefined,
				eventVersion: '2.0.0',
				payload: {
					relatedEventId: 'mock-id',
					leftTime: 999,
					duration: 1
				},
				visitId: undefined
			})

			dateSpy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('getTextForVariable calls Common.Registry', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			jest.spyOn(Common.Registry, 'getTextForVariable')
			component.update()

			component.instance().getTextForVariable({})

			expect(Common.Registry.getTextForVariable).toHaveBeenCalled()

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('scrollToTop returns with no container', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			const spy = jest.spyOn(ReactDOM, 'findDOMNode')
			ReactDOM.findDOMNode.mockReturnValueOnce(null)
			ReactDOM.findDOMNode.mockReturnValueOnce(null)

			component.update()

			component.instance().scrollToTop()

			expect(ReactDOM.findDOMNode).toHaveBeenCalledTimes(2)

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('scrollToTop sets container.scrollTop', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		const mockEl = {
			getBoundingClientRect: () => ({
				height: 'mock-height'
			})
		}
		const containerEl = {
			scrollTop: 0
		}

		setTimeout(() => {
			component.update()

			const spy = jest.spyOn(ReactDOM, 'findDOMNode')
			ReactDOM.findDOMNode.mockReturnValueOnce(mockEl)
			ReactDOM.findDOMNode.mockReturnValueOnce(containerEl)

			component.instance().scrollToTop()

			expect(containerEl.scrollTop).toBe('mock-height')

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('onMouseDown calls clearVisualFocus', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			const mockTarget = jest.fn()
			component.instance().clearVisualFocus = jest.fn()
			component.instance().onMouseDown({ target: mockTarget })
			expect(component.instance().clearVisualFocus).toHaveBeenCalledTimes(1)
			expect(component.instance().clearVisualFocus).toHaveBeenCalledWith(mockTarget)

			component.unmount()
			done()
		})
	})

	test('onFocus calls clearVisualFocus', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			const mockTarget = jest.fn()
			component.instance().clearVisualFocus = jest.fn()
			component.instance().onFocus({ target: mockTarget })
			expect(component.instance().clearVisualFocus).toHaveBeenCalledTimes(1)
			expect(component.instance().clearVisualFocus).toHaveBeenCalledWith(mockTarget)

			component.unmount()
			done()
		})
	})

	test('onScroll does nothing if no visualFocusTarget', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			component.instance().state.focusState.visualFocusTarget = null

			component.instance().onScroll()

			expect(FocusUtil.clearVisualFocus).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onScroll does nothing if no visually focused component', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			component.instance().state.focusState.visualFocusTarget = 'invalid-id'
			FocusUtil.getVisuallyFocussedModel = jest.fn()

			component.instance().onScroll()

			expect(FocusUtil.getFocussedComponent).toHaveBeenCalledTimes(2)
			expect(DOMUtil.isElementVisible).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onScroll does nothing if no element found for component', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			component.instance().state.focusState.visualFocusTarget = 'id'
			FocusUtil.getVisuallyFocussedModel = () => ({
				getDomEl: jest.fn()
			})

			component.instance().onScroll()

			expect(FocusUtil.getFocussedComponent).toHaveBeenCalledTimes(2)
			expect(mockFocused.getDomEl).toHaveBeenCalled()
			expect(DOMUtil.isElementVisible).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onScroll does nothing if element is visible', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			component.instance().state.focusState = { focussedId: 'mockFocused' }
			FocusUtil.getFocussedComponent
				.mockReturnValueOnce(mockFocused)
				.mockReturnValueOnce(mockFocused)
			DOMUtil.isElementVisible.mockReturnValueOnce(true)

			component.instance().onScroll()

			expect(FocusUtil.getFocussedComponent).toHaveBeenCalledTimes(2)
			expect(mockFocused.getDomEl).toHaveBeenCalled()
			expect(DOMUtil.isElementVisible).toHaveBeenCalled()
			expect(FocusUtil.unfocus).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onScroll calls FocusUtil.clearVisualFocus if a visually focused component is no longer visible', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			component.instance().state.focusState = { focussedId: 'mockFocused' }
			FocusUtil.getFocussedComponent
				.mockReturnValueOnce(mockFocused)
				.mockReturnValueOnce(mockFocused)
			DOMUtil.isElementVisible.mockReturnValueOnce(false)

			component.instance().onScroll()

			expect(FocusUtil.getFocussedComponent).toHaveBeenCalledTimes(2)
			expect(mockFocused.getDomEl).toHaveBeenCalled()
			expect(DOMUtil.isElementVisible).toHaveBeenCalled()
			expect(FocusUtil.unfocus).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onIdle posts an Event', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			APIUtil.postEvent.mockResolvedValueOnce({ value: {} })

			component.instance().onIdle()

			expect(APIUtil.postEvent).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onReturnFromIdle posts an Event', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			const dateSpy = jest.spyOn(Date, 'now').mockReturnValueOnce(1000)
			component.instance().inactiveEvent = { extensions: { internalEventId: 'mock-id' } }
			component.instance().lastActiveEpoch = 999
			APIUtil.postEvent.mockResolvedValueOnce({ value: null })
			component.update()

			component.instance().onReturnFromIdle()

			expect(APIUtil.postEvent).toHaveBeenCalledWith({
				action: 'viewer:returnFromInactive',
				draftId: undefined,
				eventVersion: '2.1.0',
				payload: {
					relatedEventId: 'mock-id',
					lastActiveTime: 999,
					inactiveDuration: 1
				},
				visitId: undefined
			})

			dateSpy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('onBeforeWindowClose returns undefined', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			const spy = jest.spyOn(Dispatcher, 'trigger')

			const close = component.instance().onBeforeWindowClose()

			expect(Dispatcher.trigger).toHaveBeenCalled()
			expect(close).toEqual(undefined)

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('onBeforeWindowClose calls closePrevented', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)
		const originalTrigger = Dispatcher.trigger
		Dispatcher.trigger = jest.fn()

		setTimeout(() => {
			component.update()
			Dispatcher.trigger.mockImplementationOnce((type, funct) => {
				funct()
			})

			const close = component.instance().onBeforeWindowClose()

			expect(Dispatcher.trigger).toHaveBeenCalled()
			expect(close).toEqual(true)

			component.unmount()
			Dispatcher.trigger = originalTrigger
			done()
		})
	})

	test('onWindowClose calls APIUtil', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			component.instance().onWindowClose()

			expect(APIUtil.postEvent).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('clearPreviewScores resets assessments and calls Modal.show', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			APIUtil.clearPreviewScores.mockResolvedValueOnce({
				status: 'ok'
			})

			component.instance().clearPreviewScores()

			expect(APIUtil.clearPreviewScores).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('clearPreviewScores Modal.show with error', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			APIUtil.clearPreviewScores.mockResolvedValueOnce({
				status: 'not ok',
				error: 'Not Authorized'
			})

			component.instance().clearPreviewScores()

			expect(APIUtil.clearPreviewScores).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('clearPreviewScores Modal.show with detailed error', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			APIUtil.clearPreviewScores.mockResolvedValueOnce({
				status: 'not ok',
				error: 'Not Authorized',
				value: {
					message: 'mockMessage'
				}
			})

			component.instance().clearPreviewScores()

			expect(APIUtil.clearPreviewScores).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('unlockNavigation calls NavUtil', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			component.instance().unlockNavigation()

			expect(NavUtil.unlock).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onResize dispatches viewer:contentAreaResized', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		Dispatcher.trigger = jest.fn()
		const spy = jest.spyOn(ReactDOM, 'findDOMNode')
		ReactDOM.findDOMNode.mockReturnValueOnce({
			getBoundingClientRect: () => ({ width: 'mocked-width' })
		})

		setTimeout(() => {
			component.update()
			component.instance().onResize()

			expect(Dispatcher.trigger).toHaveBeenCalledWith('viewer:contentAreaResized', 'mocked-width')

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('scrollToTop is called when navTargetId changes', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)
		NavUtil.canNavigate.mockReturnValue(false)
		const findDOMNodeSpy = jest.spyOn(ReactDOM, 'findDOMNode')
		// mock for coverage in scrollToTop
		findDOMNodeSpy.mockReturnValue({ scrollTop: 10, getBoundingClientRect: () => ({ height: 20 }) })

		setTimeout(() => {
			component.setState({ navState: { navTargetId: null } })
			// nav ids are different so scrollToTop should have been called
			expect(findDOMNodeSpy).toHaveBeenCalledTimes(2)
			findDOMNodeSpy.mockClear()
			// next time through
			// nav ids will be same
			// canNavigate and lastCanNavigate will be same
			// so scrollToTop won't be called
			component.setState({})
			expect(findDOMNodeSpy).toHaveBeenCalledTimes(0)

			done()
		})
	})

	test('onDelayResize calls onResize', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)
		component.instance().onResize = jest.fn()

		setTimeout(() => {
			jest.useFakeTimers()

			component.update()
			component.instance().onDelayResize()

			jest.runAllTimers()

			expect(component.instance().onResize).toHaveBeenCalledTimes(1)

			jest.useRealTimers()

			component.unmount()
			done()
		})
	})

	test('nav:open, nav:close and nav:toggle call onDelayResize', done => {
		Dispatcher.on = jest.fn()

		expect.assertions(3)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			expect(Dispatcher.on).toHaveBeenCalledWith(
				'nav:open',
				component.instance().boundOnDelayResize
			)
			expect(Dispatcher.on).toHaveBeenCalledWith(
				'nav:close',
				component.instance().boundOnDelayResize
			)
			expect(Dispatcher.on).toHaveBeenCalledWith(
				'nav:toggle',
				component.instance().boundOnDelayResize
			)

			component.unmount()
			done()
		})
	})

	test('isDOMFocusInsideNav does nothing in no nav ref exists', done => {
		Dispatcher.on = jest.fn()

		expect.assertions(1)
		mocksForMount()
		isDOMFocusInsideNavSpy.mockRestore()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.instance().refs = {}
			expect(component.instance().isDOMFocusInsideNav()).toBe(false)

			component.unmount()
			done()
		})
	})

	test('isDOMFocusInsideNav returns true if active element is inside the nav', done => {
		Dispatcher.on = jest.fn()

		expect.assertions(1)
		mocksForMount()
		isDOMFocusInsideNavSpy.mockRestore()

		const spy = jest.spyOn(ReactDOM, 'findDOMNode')
		ReactDOM.findDOMNode.mockReturnValue({ contains: () => true })
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			expect(component.instance().isDOMFocusInsideNav()).toBe(true)

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('isDOMFocusInsideNav returns false if active element is not inside the nav', done => {
		Dispatcher.on = jest.fn()

		expect.assertions(1)
		mocksForMount()
		isDOMFocusInsideNavSpy.mockRestore()

		const spy = jest.spyOn(ReactDOM, 'findDOMNode')
		ReactDOM.findDOMNode.mockReturnValue({ contains: () => false })
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			expect(component.instance().isDOMFocusInsideNav()).toBe(false)

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('updateDOMFocus does nothing if type of focus is not understood', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({ type: 'garbage' })
			expect(component.instance().updateDOMFocus()).toBe(false)

			component.unmount()
			done()
		})
	})

	test('updateDOMFocus for component type focus does nothing if target model not found', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'component',
				target: 'nothing-here'
			})
			expect(component.instance().updateDOMFocus()).toBe(false)

			component.unmount()
			done()
		})
	})

	test('updateDOMFocus for component type focus calls focus on dom element of found model', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)
		const mockDomEl = jest.fn()
		OboModel.models = { mockModelId: { getDomEl: () => mockDomEl } }

		setTimeout(() => {
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'component',
				target: 'mockModelId'
			})
			expect(component.instance().updateDOMFocus()).toBe(true)
			expect(focus).toHaveBeenCalledWith(mockDomEl)

			component.unmount()
			done()
		})
	})

	test('updateDOMFocus for navTargetContent type calls focusOnContent with the current nav target model', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)
		// const mockDomEl = jest.fn()
		// OboModel.models = { mockModelId: { getDomEl: () => mockDomEl } }
		NavUtil.getNavTargetModel = jest.fn(() => 'mock-nav-target')

		setTimeout(() => {
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'navTargetContent'
			})
			const spy = jest.spyOn(component.instance(), 'focusOnContent').mockImplementation(jest.fn())
			expect(component.instance().updateDOMFocus()).toBe(true)
			expect(spy).toHaveBeenCalledWith('mock-nav-target')

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('updateDOMFocus for content type focus calls focusOnContent for found model', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)
		const mockModel = jest.fn()
		OboModel.models = { mockModelId: mockModel }

		setTimeout(() => {
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'content',
				target: 'mockModelId'
			})
			const spy = jest.spyOn(component.instance(), 'focusOnContent').mockImplementation(jest.fn())
			expect(component.instance().updateDOMFocus()).toBe(true)
			expect(spy).toHaveBeenCalledWith(mockModel)

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('updateDOMFocus for viewer type does nothing if target is not understood', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'viewer',
				target: 'some-target'
			})
			const spy = jest.spyOn(component.instance(), 'focusOnContent').mockImplementation(jest.fn())
			expect(component.instance().updateDOMFocus()).toBe(false)

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('updateDOMFocus for viewer type (with navigation target) does nothing if nav is disabled and closed', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'viewer',
				target: 'navigation'
			})
			NavUtil.isNavEnabled.mockReturnValueOnce(false)
			NavUtil.isNavOpen.mockReturnValueOnce(false)
			const spy = jest.spyOn(component.instance(), 'focusOnContent').mockImplementation(jest.fn())
			expect(component.instance().updateDOMFocus()).toBe(false)

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('updateDOMFocus for viewer type (with navigation target) does nothing if nav is disabled', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'viewer',
				target: 'navigation'
			})
			NavUtil.isNavEnabled.mockReturnValueOnce(false)
			NavUtil.isNavOpen.mockReturnValueOnce(true)
			const spy = jest.spyOn(component.instance(), 'focusOnContent').mockImplementation(jest.fn())
			expect(component.instance().updateDOMFocus()).toBe(false)

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('updateDOMFocus for viewer type (with navigation target) does nothing if nav is closed', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'viewer',
				target: 'navigation'
			})
			NavUtil.isNavEnabled.mockReturnValueOnce(true)
			NavUtil.isNavOpen.mockReturnValueOnce(false)
			const spy = jest.spyOn(component.instance(), 'focusOnContent').mockImplementation(jest.fn())
			expect(component.instance().updateDOMFocus()).toBe(false)

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('updateDOMFocus for viewer type (with navigation target) focuses on the nav if nav is open and enabled', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'viewer',
				target: 'navigation'
			})
			NavUtil.isNavEnabled.mockReturnValueOnce(true)
			NavUtil.isNavOpen.mockReturnValueOnce(true)
			const spy = jest.spyOn(component.instance(), 'focusOnContent').mockImplementation(jest.fn())
			const mockFocus = jest.fn()
			component.instance().refs = {
				nav: {
					focus: mockFocus
				}
			}
			expect(component.instance().updateDOMFocus()).toBe(true)
			expect(mockFocus).toHaveBeenCalledTimes(1)

			spy.mockRestore()
			component.unmount()
			done()
		})
	})

	test('clearVisualFocus calls FocusUtil.clearVisualFocus if a component has visual focus and the passed in element is not contained by the component', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getVisuallyFocussedModel = jest.fn(() => ({
				getDomEl: () => ({
					contains: () => false
				})
			}))
			FocusUtil.clearVisualFocus = jest.fn()

			component.instance().clearVisualFocus(jest.fn())
			expect(FocusUtil.clearVisualFocus).toHaveBeenCalledTimes(1)

			component.unmount()
			done()
		})
	})

	test("clearVisualFocus calls FocusUtil.clearVisualFocus if a component has visual focus but the component's dom element does not exist", done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getVisuallyFocussedModel = jest.fn(() => ({
				getDomEl: () => null
			}))
			FocusUtil.clearVisualFocus = jest.fn()

			component.instance().clearVisualFocus(jest.fn())
			expect(FocusUtil.clearVisualFocus).toHaveBeenCalledTimes(1)

			component.unmount()
			done()
		})
	})

	test('clearVisualFocus does nothing if a component has visual focus but the passed in element IS contained by the component', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getVisuallyFocussedModel = jest.fn(() => ({
				getDomEl: () => ({
					contains: () => true
				})
			}))
			FocusUtil.clearVisualFocus = jest.fn()

			component.instance().clearVisualFocus(jest.fn())
			expect(FocusUtil.clearVisualFocus).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('clearVisualFocus does nothing if nothing has visual focus', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getVisuallyFocussedModel = jest.fn(() => false)
			FocusUtil.clearVisualFocus = jest.fn()

			component.instance().clearVisualFocus(jest.fn())
			expect(FocusUtil.clearVisualFocus).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('Nav target label is passed to the Header component', done => {
		expect.assertions(1)
		mocksForMount()

		NavUtil.getNavTarget = jest.fn(() => ({
			label: 'nav-target-label'
		}))
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			const headerComponent = component.find(Header)
			expect(headerComponent.props().location).toBe('nav-target-label')

			component.unmount()
			done()
		})
	})

	test('ViewerApp class is-focus-state-active if there is a visually focussed component', done => {
		expect.assertions(2)
		mocksForMount()

		FocusUtil.getVisuallyFocussedModel = jest.fn(() => jest.fn())
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			expect(component.find('.is-focus-state-inactive').length).toBe(0)
			expect(component.find('.is-focus-state-active').length).toBe(1)

			component.unmount()
			done()
		})
	})

	test('ViewerApp class is-focus-state-inactive if there is a visually focussed component', done => {
		expect.assertions(2)
		mocksForMount()

		FocusUtil.getVisuallyFocussedModel = jest.fn(() => null)
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			expect(component.find('.is-focus-state-inactive').length).toBe(1)
			expect(component.find('.is-focus-state-active').length).toBe(0)

			component.unmount()
			done()
		})
	})
})
