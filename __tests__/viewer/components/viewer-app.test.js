import React from 'react'
import { mount } from 'enzyme'

jest.mock('../../../src/scripts/viewer/util/api-util')
jest.mock('../../../src/scripts/viewer/stores/question-store')
jest.mock('../../../src/scripts/common/stores/modal-store')
jest.mock('../../../src/scripts/common/util/modal-util')
jest.mock('../../../src/scripts/common/stores/focus-store')
jest.mock('../../../src/scripts/viewer/stores/media-store')
jest.mock('../../../src/scripts/common/util/focus-util')
jest.mock('../../../src/scripts/viewer/stores/nav-store')
jest.mock('../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../src/scripts/viewer/stores/assessment-store')
jest.mock('../../../src/scripts/viewer/components/nav')
jest.mock('../../../src/scripts/common/page/dom-util')
jest.mock('../../../src/scripts/common/page/screen')

import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import ViewerApp from '../../../src/scripts/viewer/components/viewer-app'

import APIUtil from '../../../src/scripts/viewer/util/api-util'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'
import ModalStore from '../../../src/scripts/common/stores/modal-store'
import ModalUtil from '../../../src/scripts/common/util/modal-util'
import FocusStore from '../../../src/scripts/common/stores/focus-store'
import FocusUtil from '../../../src/scripts/common/util/focus-util'
import MediaStore from '../../../src/scripts/viewer/stores/media-store'
import NavStore from '../../../src/scripts/viewer/stores/nav-store'
import NavUtil from '../../../src/scripts/viewer/util/nav-util'
import AssessmentStore from '../../../src/scripts/viewer/stores/assessment-store'
import DOMUtil from '../../../src/scripts/common/page/dom-util'
import Screen from '../../../src/scripts/common/page/screen'
import Common from '../../../src/scripts/common'

import testObject from '../../../test-object.json'

describe('ViewerApp', () => {
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
			jest.spyOn(ReactDOM, 'findDOMNode')
			ReactDOM.findDOMNode.mockReturnValueOnce({ scrollTop: null })

			Dispatcher.trigger('viewer:scrollTo', { value: null })

			expect(ReactDOM.findDOMNode).toHaveBeenCalled()
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
		jest.spyOn(String.prototype, 'split').mockReturnValueOnce([])

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

		NavUtil.getNavTargetModel.mockReturnValueOnce({ title: 'mockTarget' })
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

		NavUtil.canNavigate.mockReturnValueOnce(true)
		NavUtil.getPrevModel.mockReturnValueOnce({ title: 'mockPrevTitle' })
		NavUtil.getNextModel.mockReturnValueOnce({ title: 'mockNextTitle' })
		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.update()

			expect(component.html()).toMatchSnapshot()

			component.unmount()
			done()
		})
	})

	test('ViewerApp component with nav models', done => {
		expect.assertions(1)
		mocksForMount()

		NavUtil.canNavigate.mockReturnValueOnce(true)
		NavUtil.getPrevModel.mockReturnValueOnce({ title: null })
		NavUtil.getNextModel.mockReturnValueOnce({ title: null })
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

		jest.spyOn(component.instance(), 'setState')
		NavStore.getState.mockReturnValueOnce({})

		setTimeout(() => {
			component.update()
			component.instance().onNavStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ navState: {} })

			component.unmount()
			done()
		})
	})

	test('onQuestionStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			jest.spyOn(component.instance(), 'setState')
			QuestionStore.getState.mockReturnValueOnce({})

			component.update()
			component.instance().onQuestionStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ questionState: {} })

			component.unmount()
			done()
		})
	})

	test('onAssessmentStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			jest.spyOn(component.instance(), 'setState')
			AssessmentStore.getState.mockReturnValueOnce({})

			component.update()
			component.instance().onAssessmentStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ assessmentState: {} })

			component.unmount()
			done()
		})
	})

	test('onModalStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			jest.spyOn(component.instance(), 'setState')
			ModalStore.getState.mockReturnValueOnce({})

			component.update()
			component.instance().onModalStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ modalState: {} })

			component.unmount()
			done()
		})
	})

	test('onFocusStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			jest.spyOn(component.instance(), 'setState')
			FocusStore.getState.mockReturnValueOnce({})

			component.update()
			component.instance().onFocusStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ focusState: {} })

			component.unmount()
			done()
		})
	})

	test('onMediaStoreChange calls setState', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			jest.spyOn(component.instance(), 'setState')
			MediaStore.getState.mockReturnValueOnce({})

			component.update()
			component.instance().onMediaStoreChange()

			expect(component.instance().setState).toHaveBeenCalledWith({ mediaState: {} })

			component.unmount()
			done()
		})
	})

	test('onVisibilityChange calls APIUtil when leaving', done => {
		document.hidden = true

		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		NavStore.getState.mockReturnValueOnce({ visitId: 'mockVisitId' })

		setTimeout(() => {
			APIUtil.postEvent.mockResolvedValueOnce({ value: null })
			component.update()

			component.instance().onVisibilityChange()

			expect(APIUtil.postEvent).toHaveBeenCalledWith({
				action: 'viewer:leave',
				eventVersion: '2.0.0',
				payload: {},
				visitId: 'mockVisitId'
			})

			component.unmount()
			done()
		})
	})

	test('onVisibilityChange calls APIUtil when returning', done => {
		document.hidden = false

		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		NavStore.getState.mockReturnValueOnce({ visitId: 'mockVisitId' })

		setTimeout(() => {
			component.instance().leaveEvent = { id: 'mockId' }
			APIUtil.postEvent.mockResolvedValueOnce({ value: null })
			component.update()

			component.instance().onVisibilityChange()

			expect(APIUtil.postEvent).toHaveBeenCalledWith({
				action: 'viewer:return',
				eventVersion: '2.0.0',
				payload: { relatedEventId: 'mockId' },
				visitId: 'mockVisitId'
			})

			component.unmount()
			done()
		})
	})

	test('getTextForVariable calls Common.Store', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			jest.spyOn(Common.Store, 'getTextForVariable')
			component.update()

			component.instance().getTextForVariable({})

			expect(Common.Store.getTextForVariable).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('scrollToTop returns with no container', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			jest.spyOn(ReactDOM, 'findDOMNode')
			ReactDOM.findDOMNode.mockReturnValueOnce(null)
			ReactDOM.findDOMNode.mockReturnValueOnce(null)

			component.update()

			component.instance().scrollToTop()

			expect(ReactDOM.findDOMNode).toHaveBeenCalledTimes(2)

			component.unmount()
			done()
		})
	})

	test('onMouseDown returns with no focus', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			component.instance().onMouseDown()

			expect(DOMUtil.findParentComponentIds).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onMouseDown returns when clicking on focus', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			component.instance().state.focusState = { focussedId: 'mockFocused' }
			DOMUtil.findParentComponentIds.mockReturnValueOnce({
				has: jest.fn().mockReturnValueOnce(true)
			})

			component.instance().onMouseDown({ target: 'mockFocused' })

			expect(DOMUtil.findParentComponentIds).toHaveBeenCalled()
			expect(FocusUtil.unfocus).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onMouseDown calls FocusUtil when not clicking on focus', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			component.instance().state.focusState = { focussedId: 'mockFocused' }
			DOMUtil.findParentComponentIds.mockReturnValueOnce({
				has: jest.fn().mockReturnValueOnce(false)
			})

			component.instance().onMouseDown({ target: 'mockClicked' })

			expect(DOMUtil.findParentComponentIds).toHaveBeenCalled()
			expect(FocusUtil.unfocus).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onScroll returns with no focus', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			component.instance().onScroll()

			expect(FocusUtil.getFocussedComponent).toHaveBeenCalledTimes(1)

			component.unmount()
			done()
		})
	})

	test('onScroll returns with no component', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			component.instance().state.focusState = { focussedId: 'mockFocused' }

			component.instance().onScroll()

			expect(FocusUtil.getFocussedComponent).toHaveBeenCalledTimes(2)
			expect(Screen.isElementVisible).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onScroll returns with no element', done => {
		expect.assertions(3)
		mocksForMount()
		const component = mount(<ViewerApp />)
		const mockFocused = {
			getDomEl: jest.fn()
		}

		setTimeout(() => {
			component.update()
			component.instance().state.focusState = { focussedId: 'mockFocused' }
			FocusUtil.getFocussedComponent
				.mockReturnValueOnce(mockFocused)
				.mockReturnValueOnce(mockFocused)

			component.instance().onScroll()

			expect(FocusUtil.getFocussedComponent).toHaveBeenCalledTimes(2)
			expect(mockFocused.getDomEl).toHaveBeenCalled()
			expect(Screen.isElementVisible).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onScroll returns with visible Element', done => {
		expect.assertions(4)
		mocksForMount()
		const component = mount(<ViewerApp />)
		const mockFocused = {
			getDomEl: jest.fn().mockReturnValueOnce(true)
		}

		setTimeout(() => {
			component.update()
			component.instance().state.focusState = { focussedId: 'mockFocused' }
			FocusUtil.getFocussedComponent
				.mockReturnValueOnce(mockFocused)
				.mockReturnValueOnce(mockFocused)
			Screen.isElementVisible.mockReturnValueOnce(true)

			component.instance().onScroll()

			expect(FocusUtil.getFocussedComponent).toHaveBeenCalledTimes(2)
			expect(mockFocused.getDomEl).toHaveBeenCalled()
			expect(Screen.isElementVisible).toHaveBeenCalled()
			expect(FocusUtil.unfocus).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onScroll unfocuses with non-visible Element', done => {
		expect.assertions(4)
		mocksForMount()
		const component = mount(<ViewerApp />)
		const mockFocused = {
			getDomEl: jest.fn().mockReturnValueOnce(true)
		}

		setTimeout(() => {
			component.update()
			component.instance().state.focusState = { focussedId: 'mockFocused' }
			FocusUtil.getFocussedComponent
				.mockReturnValueOnce(mockFocused)
				.mockReturnValueOnce(mockFocused)
			Screen.isElementVisible.mockReturnValueOnce(false)

			component.instance().onScroll()

			expect(FocusUtil.getFocussedComponent).toHaveBeenCalledTimes(2)
			expect(mockFocused.getDomEl).toHaveBeenCalled()
			expect(Screen.isElementVisible).toHaveBeenCalled()
			expect(FocusUtil.unfocus).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('onIdle posts an Event', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		NavStore.getState.mockReturnValueOnce({ visitId: 'mockVisitId' })

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

		NavStore.getState.mockReturnValueOnce({ visitId: 'mockVisitId' })

		setTimeout(() => {
			component.update()
			component.instance().inactiveEvent = { id: 'mockEventId' }

			component.instance().onReturnFromIdle()

			expect(APIUtil.postEvent).toHaveBeenCalled()

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
			jest.spyOn(Dispatcher, 'trigger')

			const close = component.instance().onBeforeWindowClose()

			expect(Dispatcher.trigger).toHaveBeenCalled()
			expect(close).toEqual(undefined)

			component.unmount()
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

		NavStore.getState.mockReturnValueOnce({ visitId: 'mockVisitId' })

		setTimeout(() => {
			component.update()

			const close = component.instance().onWindowClose()

			expect(APIUtil.postEvent).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('clearPreviewScores resets assessments and calls Modal.show', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		NavStore.getState.mockReturnValueOnce({ visitId: 'mockVisitId' })

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

		NavStore.getState.mockReturnValueOnce({ visitId: 'mockVisitId' })

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

		NavStore.getState.mockReturnValueOnce({ visitId: 'mockVisitId' })

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

			const close = component.instance().unlockNavigation()

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
		jest.spyOn(ReactDOM, 'findDOMNode')
		ReactDOM.findDOMNode.mockReturnValueOnce({
			getBoundingClientRect: () => ({ width: 'mocked-width' })
		})

		setTimeout(() => {
			component.update()
			component.instance().onResize()

			expect(Dispatcher.trigger).toHaveBeenCalledWith('viewer:contentAreaResized', 'mocked-width')

			component.unmount()
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
})
