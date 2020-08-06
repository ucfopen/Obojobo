/* eslint-disable no-undefined */
/* eslint-disable no-console */

import APIUtil from 'obojobo-document-engine/src/scripts/viewer/util/api-util'
import AssessmentStore from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-store'
import Common from 'obojobo-document-engine/src/scripts/common'
import focus from 'obojobo-document-engine/src/scripts/common/page/focus'
import Dispatcher from 'obojobo-document-engine/src/scripts/common/flux/dispatcher'
import FocusStore from 'obojobo-document-engine/src/scripts/viewer/stores/focus-store'
import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'
import Header from 'obojobo-document-engine/src/scripts/viewer/components/header'
import MediaStore from 'obojobo-document-engine/src/scripts/viewer/stores/media-store'
import ModalStore from 'obojobo-document-engine/src/scripts/common/stores/modal-store'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import NavStore from 'obojobo-document-engine/src/scripts/viewer/stores/nav-store'
import NavUtil from 'obojobo-document-engine/src/scripts/viewer/util/nav-util'
import OboModel from 'obojobo-document-engine/__mocks__/_obo-model-with-chunks'
import QuestionStore from 'obojobo-document-engine/src/scripts/viewer/stores/question-store'
import React from 'react'
import ReactDOM from 'react-dom'
import ViewerApp from 'obojobo-document-engine/src/scripts/viewer/components/viewer-app'
import { mount } from 'enzyme'
import testObject from 'obojobo-document-engine/test-object.json'
import mockConsole from 'jest-mock-console'
import injectKatexIfNeeded from 'obojobo-document-engine/src/scripts/common/util/inject-katex-if-needed'

jest.mock('obojobo-document-engine/src/scripts/common/util/inject-katex-if-needed')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/api-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/stores/question-store')
jest.mock('obojobo-document-engine/src/scripts/common/page/focus')
jest.mock('obojobo-document-engine/src/scripts/common/stores/modal-store')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/stores/focus-store')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/focus-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/stores/media-store')
jest.mock('obojobo-document-engine/src/scripts/viewer/stores/nav-store')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/nav-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/stores/assessment-store')
jest.mock('obojobo-document-engine/src/scripts/viewer/components/nav')
jest.mock('obojobo-document-engine/src/scripts/common/page/dom-util')
jest.mock('obojobo-document-engine/src/scripts/common/util/insert-dom-tag')

describe('ViewerApp', () => {
	let restoreConsole
	let isDOMFocusInsideNavSpy
	const isDOMFocusInsideNavOriginal = ViewerApp.prototype.isDOMFocusInsideNav

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
		injectKatexIfNeeded.mockImplementation(async x => x.value)
		restoreConsole = mockConsole('error')

		isDOMFocusInsideNavSpy = jest
			.spyOn(ViewerApp.prototype, 'isDOMFocusInsideNav')
			.mockReturnValue(false)

		FocusUtil.getFocussedItem = FocusUtil.getFocussedItemAndClear = () => ({
			type: null,
			target: null
		})
	})

	afterEach(() => {
		restoreConsole()
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
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()
			expect(component.html()).toMatchSnapshot()
			expect(console.error).toHaveBeenCalled()

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

	test('ViewerApp component displays error when the requestStatus is invalid', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)
		setTimeout(() => {
			component.instance().setState({ requestStatus: 'invalid' })
			component.update()

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

			expect(component.instance().setState).toHaveBeenCalledWith({
				navState: {}
			})

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

			expect(component.instance().setState).toHaveBeenCalledWith({
				questionState: {}
			})

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

			expect(component.instance().setState).toHaveBeenCalledWith({
				assessmentState: {}
			})

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

			expect(component.instance().setState).toHaveBeenCalledWith({
				modalState: {}
			})

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

			expect(component.instance().setState).toHaveBeenCalledWith({
				focusState: {}
			})

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

			expect(component.instance().setState).toHaveBeenCalledWith({
				mediaState: {}
			})

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
			component.instance().leaveEvent = {
				extensions: { internalEventId: 'mock-id' }
			}
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
			done()
		})
	})

	test('ViewerApp calls scrollToTop when event is heard', done => {
		expect.assertions(10)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			const spy = jest.spyOn(Common.Registry, 'getTextForVariable')
			component.update()

			component.instance().scrollToTop = jest.fn()

			Dispatcher.trigger('viewer:scrollToTop')
			expect(component.instance().scrollToTop).toHaveBeenCalledTimes(1)
			expect(component.instance().scrollToTop).toHaveBeenCalledWith(false)

			Dispatcher.trigger('viewer:scrollToTop', {})
			expect(component.instance().scrollToTop).toHaveBeenCalledTimes(2)
			expect(component.instance().scrollToTop).toHaveBeenCalledWith(false)

			Dispatcher.trigger('viewer:scrollToTop', { value: {} })
			expect(component.instance().scrollToTop).toHaveBeenCalledTimes(3)
			expect(component.instance().scrollToTop).toHaveBeenCalledWith(false)

			Dispatcher.trigger('viewer:scrollToTop', { value: { animateScroll: false } })
			expect(component.instance().scrollToTop).toHaveBeenCalledTimes(4)
			expect(component.instance().scrollToTop).toHaveBeenCalledWith(false)

			Dispatcher.trigger('viewer:scrollToTop', { value: { animateScroll: true } })
			expect(component.instance().scrollToTop).toHaveBeenCalledTimes(5)
			expect(component.instance().scrollToTop).toHaveBeenCalledWith(true)

			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('scrollToTop returns false if no Module dom element', done => {
		expect.assertions(3)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			component.instance().state.model = null
			expect(component.instance().scrollToTop()).toBe(false)

			component.instance().state.model = {}
			expect(component.instance().scrollToTop()).toBe(false)

			component.instance().state.model = { getDomEl: () => null }
			expect(component.instance().scrollToTop()).toBe(false)

			component.unmount()
			done()
		})
	})

	test('scrollToTop calls scrollIntoView on Module dom element', done => {
		expect.assertions(4)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			const mockScrollIntoView = jest.fn()
			component.instance().state.model = {
				getDomEl: () => ({
					scrollIntoView: mockScrollIntoView
				})
			}

			expect(component.instance().scrollToTop()).toBe(true)
			expect(mockScrollIntoView).toHaveBeenCalledWith()

			expect(component.instance().scrollToTop(true)).toBe(true)
			expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })

			component.unmount()
			done()
		})
	})

	test('scrollToTopIfNavTargetChanging calls scrollToTop if navTarget changes', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			const scrollToTopSpy = jest
				.spyOn(component.instance(), 'scrollToTop')
				.mockImplementation(jest.fn())

			const isNavTargetChangingSpy = jest
				.spyOn(component.instance(), 'isNavTargetChanging')
				.mockReturnValue(false)
			component.instance().scrollToTopIfNavTargetChanging({})
			expect(scrollToTopSpy).not.toHaveBeenCalled()

			isNavTargetChangingSpy.mockReturnValue(true)
			component.instance().scrollToTopIfNavTargetChanging({})
			expect(scrollToTopSpy).toHaveBeenCalledTimes(1)

			scrollToTopSpy.mockRestore()
			isNavTargetChangingSpy.mockRestore()

			done()
		})
	})

	test('onMouseDown calls clearFadeEffect', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			const mockTarget = jest.fn()
			component.instance().clearFadeEffect = jest.fn()
			component.instance().onMouseDown({ target: mockTarget })
			expect(component.instance().clearFadeEffect).toHaveBeenCalledTimes(1)
			expect(component.instance().clearFadeEffect).toHaveBeenCalledWith(mockTarget)

			component.unmount()
			done()
		})
	})

	test('onFocus calls clearFadeEffect', done => {
		expect.assertions(2)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			const mockTarget = jest.fn()
			component.instance().clearFadeEffect = jest.fn()
			component.instance().onFocus({ target: mockTarget })
			expect(component.instance().clearFadeEffect).toHaveBeenCalledTimes(1)
			expect(component.instance().clearFadeEffect).toHaveBeenCalledWith(mockTarget)

			component.unmount()
			done()
		})
	})

	test('startObservingForIntersectionChanges does nothing if no visualFocusTarget', () => {
		const oldIntersectionObserver = window.IntersectionObserver

		const thisValue = {
			state: {
				focusState: {
					visualFocusTarget: null
				}
			}
		}

		ViewerApp.prototype.startObservingForIntersectionChanges.bind(thisValue)()

		expect(thisValue.observer).not.toBeDefined()

		// Restore the actual IntersectionObserver
		window.IntersectionObserver = oldIntersectionObserver
	})

	test('startObservingForIntersectionChanges does nothing if no visually focused component', () => {
		const oldIntersectionObserver = window.IntersectionObserver

		const thisValue = {
			state: {
				focusState: {
					visualFocusTarget: 'invalid-id'
				}
			}
		}

		FocusUtil.getVisuallyFocussedModel = jest.fn()

		ViewerApp.prototype.startObservingForIntersectionChanges.bind(thisValue)()

		expect(thisValue.observer).not.toBeDefined()

		// Restore the actual IntersectionObserver
		window.IntersectionObserver = oldIntersectionObserver
	})

	test('startObservingForIntersectionChanges does nothing if no element found for component', () => {
		const oldIntersectionObserver = window.IntersectionObserver

		const thisValue = {
			state: {
				focusState: {
					visualFocusTarget: 'id'
				}
			}
		}

		FocusUtil.getVisuallyFocussedModel = () => ({
			getDomEl: jest.fn()
		})

		ViewerApp.prototype.startObservingForIntersectionChanges.bind(thisValue)()

		expect(thisValue.observer).not.toBeDefined()

		// Restore the actual IntersectionObserver
		window.IntersectionObserver = oldIntersectionObserver
	})

	test('startObservingForIntersectionChanges creates new IntersectionObserver and calls observe if focused element exists', () => {
		const oldIntersectionObserver = window.IntersectionObserver

		// Mock IntersectonObserver
		window.IntersectionObserver = jest.fn()
		window.IntersectionObserver.prototype.observe = jest.fn()

		const thisValue = {
			onIntersectionChange: jest.fn(),
			state: {
				focusState: {
					visualFocusTarget: 'id'
				}
			}
		}

		FocusUtil.getVisuallyFocussedModel = () => ({
			getDomEl: () => true
		})

		ViewerApp.prototype.startObservingForIntersectionChanges.bind(thisValue)()

		expect(thisValue.observer).toBeDefined()
		expect(window.IntersectionObserver).toHaveBeenCalledWith(thisValue.onIntersectionChange, {
			root: null,
			rootMargin: '0px',
			threshhold: 0
		})
		expect(thisValue.observer.observe).toHaveBeenCalledWith(
			FocusUtil.getVisuallyFocussedModel().getDomEl()
		)

		window.IntersectionObserver = oldIntersectionObserver
	})

	test('onIntersectionChange does nothing if intersectionRatio is higher than 0', () => {
		const thisValue = {}
		const changes = [
			{
				intersectionRatio: 0.9
			}
		]

		expect(ViewerApp.prototype.onIntersectionChange.bind(thisValue)(changes)).toBe(false)
	})

	test('onIntersectionChange calls FocusUtil.clearFadeEffect if intersectionRation reaches 0', () => {
		const thisValue = {}
		const changes = [
			{
				intersectionRatio: 0.0
			}
		]

		expect(ViewerApp.prototype.onIntersectionChange.bind(thisValue)(changes)).toBe(true)
		expect(FocusUtil.clearFadeEffect).toHaveBeenCalledTimes(1)
	})

	test('onIdle posts an Event', done => {
		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
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
			component.instance().inactiveEvent = {
				extensions: { internalEventId: 'mock-id' }
			}
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

		global.navigator.sendBeacon = jest.fn()

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

	test('sendCloseEvent calls navigator.sendBeacon', done => {
		global.navigator.sendBeacon = jest.fn()

		expect.assertions(1)
		mocksForMount()
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.update()

			component.instance().sendCloseEvent()

			expect(navigator.sendBeacon).toHaveBeenCalled()

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

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.instance().navRef = { current: false }
			component.instance().isDOMFocusInsideNav = isDOMFocusInsideNavOriginal
			expect(component.instance().isDOMFocusInsideNav()).toBe(false)

			component.unmount()
			done()
		})
	})

	test('isDOMFocusInsideNav returns true if active element is inside the nav', done => {
		Dispatcher.on = jest.fn()

		expect.assertions(1)
		mocksForMount()

		jest.spyOn(ReactDOM, 'findDOMNode').mockReturnValue({ contains: () => true })
		const component = mount(<ViewerApp />)

		setTimeout(() => {
			component.instance().isDOMFocusInsideNav = isDOMFocusInsideNavOriginal
			component.instance().navRef = { current: true }
			expect(component.instance().isDOMFocusInsideNav()).toBe(true)

			component.unmount()
			done()
		})
	})

	test('isDOMFocusInsideNav returns false if active element is not inside the nav', done => {
		Dispatcher.on = jest.fn()

		expect.assertions(1)
		mocksForMount()

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

	test('updateDOMFocus calls correct method for component type focus', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			// Put in our fake model in the OboModel.models global array:
			const oboModelModels = OboModel.models
			OboModel.models['mock-id'] = 'mock-model'

			// Force a return value of ViewerApp's focusComponent method:
			const spy = jest
				.spyOn(component.instance(), 'focusComponent')
				.mockImplementation(() => 'mock-return-value')

			// Mock return of getFocussedItemAndClear
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'component',
				target: 'mock-id',
				options: {
					animateScroll: 'mock-animate-scroll',
					fade: false
				}
			})

			// Expect updateDOMFocus to call focusComponent and return its value
			expect(component.instance().updateDOMFocus()).toBe('mock-return-value')
			expect(spy).toHaveBeenCalledWith('mock-model', {
				animateScroll: 'mock-animate-scroll',
				fade: false
			})

			// Undo our mocks and spies
			component.unmount()
			spy.mockRestore()
			OboModel.models = oboModelModels
			done()
		})
	})

	test('updateDOMFocus calls correct method for navTarget type focus', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			// Put in our fake model in the OboModel.models global array:
			const oboModelModels = OboModel.models
			OboModel.models['mock-id'] = 'mock-model'

			// Force a return value of ViewerApp's focusComponent method:
			const spy = jest
				.spyOn(component.instance(), 'focusComponent')
				.mockImplementation(() => 'mock-return-value')

			// Force a return value of NavUtil.getNavTargetModel
			const navTargetSpy = jest
				.spyOn(NavUtil, 'getNavTargetModel')
				.mockImplementation(() => 'mock-model')

			// Mock return of getFocussedItemAndClear
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'navTarget',
				target: 'mock-id',
				options: {
					animateScroll: 'mock-animate-scroll',
					fade: false
				}
			})

			// Expect updateDOMFocus to call focusComponent and return its value
			expect(component.instance().updateDOMFocus()).toBe('mock-return-value')
			expect(spy).toHaveBeenCalledWith('mock-model', {
				animateScroll: 'mock-animate-scroll',
				fade: false
			})

			// Undo our mocks and spies
			component.unmount()
			spy.mockRestore()
			navTargetSpy.mockRestore()
			OboModel.models = oboModelModels
			done()
		})
	})

	test('updateDOMFocus for viewer type focus calls focusViewer', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			// Force a return value of ViewerApp's focusViewer method:
			const spy = jest
				.spyOn(component.instance(), 'focusViewer')
				.mockImplementation(() => 'mock-return-value')

			// Mock return of getFocussedItemAndClear
			FocusUtil.getFocussedItemAndClear = jest.fn()
			FocusUtil.getFocussedItemAndClear.mockReturnValueOnce({
				type: 'viewer',
				target: 'mock-target'
			})

			// Expect updateDOMFocus to call focusViewer and return its value
			expect(component.instance().updateDOMFocus()).toBe('mock-return-value')
			expect(spy).toHaveBeenCalledWith('mock-target')

			// Undo our mocks and spies
			component.unmount()
			spy.mockRestore()
			done()
		})
	})

	test('focusComponent does nothing if no model given', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			expect(component.instance().focusComponent()).toBe(false)
			done()
		})
	})

	test('focusComponent calls focus on component element if model.getComponentClass is not defined', done => {
		expect.assertions(6)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			// Mock component dom elements:
			const mockScrollIntoView = jest.fn()
			const mockDomEl = {
				scrollIntoView: mockScrollIntoView
			}
			const model = {
				getDomEl: () => mockDomEl
			}

			// Force focus() to modify the container scrollTop value (to fake browser focus)
			component.instance().containerRef.current.scrollTop = 0
			const spy = jest.spyOn(Common.page, 'focus').mockImplementation(() => {
				component.instance().containerRef.current.scrollTop = 9999
			})

			expect(component.instance().containerRef.current.scrollTop).not.toBe(9999)
			expect(component.instance().focusComponent(model, false)).toBe(true)
			expect(focus).toHaveBeenCalledTimes(1)
			expect(focus).toHaveBeenCalledWith(mockDomEl)
			expect(mockScrollIntoView).not.toHaveBeenCalled()
			expect(component.instance().containerRef.current.scrollTop).toBe(9999)

			spy.mockRestore()
			done()
		})
	})

	test('focusComponent calls focus on component element if model.getComponentClass returns nothing', done => {
		expect.assertions(6)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			// Mock component dom elements:
			const mockScrollIntoView = jest.fn()
			const mockDomEl = {
				scrollIntoView: mockScrollIntoView
			}
			const model = {
				getDomEl: () => mockDomEl,
				getComponentClass: () => null
			}

			// Force focus() to modify the container scrollTop value (to fake browser focus)
			component.instance().containerRef.current.scrollTop = 0
			const spy = jest.spyOn(Common.page, 'focus').mockImplementation(() => {
				component.instance().containerRef.current.scrollTop = 9999
			})

			expect(component.instance().containerRef.current.scrollTop).not.toBe(9999)
			expect(component.instance().focusComponent(model, false)).toBe(true)
			expect(focus).toHaveBeenCalledTimes(1)
			expect(focus).toHaveBeenCalledWith(mockDomEl)
			expect(mockScrollIntoView).not.toHaveBeenCalled()
			expect(component.instance().containerRef.current.scrollTop).toBe(9999)

			spy.mockRestore()
			done()
		})
	})

	test('focusComponent calls focus on component element if models ComponentClass does not have a focusOnContent method', done => {
		expect.assertions(6)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			// Mock component dom elements:
			const mockScrollIntoView = jest.fn()
			const mockDomEl = {
				scrollIntoView: mockScrollIntoView
			}
			const model = {
				getDomEl: () => mockDomEl,
				getComponentClass: () => jest.fn()
			}

			// Force focus() to modify the container scrollTop value (to fake browser focus)
			component.instance().containerRef.current.scrollTop = 0
			const spy = jest.spyOn(Common.page, 'focus').mockImplementation(() => {
				component.instance().containerRef.current.scrollTop = 9999
			})

			expect(component.instance().containerRef.current.scrollTop).not.toBe(9999)
			expect(component.instance().focusComponent(model, false)).toBe(true)
			expect(focus).toHaveBeenCalledTimes(1)
			expect(focus).toHaveBeenCalledWith(mockDomEl)
			expect(mockScrollIntoView).not.toHaveBeenCalled()
			expect(component.instance().containerRef.current.scrollTop).toBe(9999)

			spy.mockRestore()
			done()
		})
	})

	test('focusComponent calls model ComponentClass focusOnContent method if it exists', done => {
		expect.assertions(7)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			// Mock component dom elements:
			const mockScrollIntoView = jest.fn()
			const mockFocusOnContent = jest.fn()
			const mockDomEl = {
				scrollIntoView: mockScrollIntoView
			}
			const model = {
				getDomEl: () => mockDomEl,
				getComponentClass: () => ({
					focusOnContent: mockFocusOnContent
				})
			}
			const mockOpts = jest.fn()

			// Force focus() to modify the container scrollTop value (to fake browser focus)
			component.instance().containerRef.current.scrollTop = 0
			const spy = jest.spyOn(Common.page, 'focus').mockImplementation(() => {
				component.instance().containerRef.current.scrollTop = 9999
			})

			expect(component.instance().containerRef.current.scrollTop).not.toBe(9999)
			expect(component.instance().focusComponent(model, mockOpts)).toBe(true)
			expect(focus).toHaveBeenCalledTimes(0)
			expect(mockFocusOnContent).toHaveBeenCalledTimes(1)
			expect(mockFocusOnContent).toHaveBeenCalledWith(model, mockOpts)
			expect(mockScrollIntoView).not.toHaveBeenCalled()
			expect(component.instance().containerRef.current.scrollTop).toBe(0)

			spy.mockRestore()
			done()
		})
	})

	test('focusComponent calls focus on component element if models ComponentClass does not have a focusOnContent method (and calls scrollIntoView if animateScroll=true)', done => {
		expect.assertions(7)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			// Mock component dom elements:
			const mockScrollIntoView = jest.fn()
			const mockDomEl = {
				scrollIntoView: mockScrollIntoView
			}
			const model = {
				getDomEl: () => mockDomEl,
				getComponentClass: () => jest.fn()
			}

			// Force focus() to modify the container scrollTop value (to fake browser focus)
			component.instance().containerRef.current.scrollTop = 0
			const spy = jest.spyOn(Common.page, 'focus').mockImplementation(() => {
				component.instance().containerRef.current.scrollTop = 9999
			})

			expect(component.instance().containerRef.current.scrollTop).not.toBe(9999)
			expect(component.instance().focusComponent(model, { animateScroll: true })).toBe(true)
			expect(focus).toHaveBeenCalledTimes(1)
			expect(focus).toHaveBeenCalledWith(mockDomEl)
			expect(mockScrollIntoView).toHaveBeenCalledTimes(1)
			expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
			expect(component.instance().containerRef.current.scrollTop).toBe(0)

			spy.mockRestore()
			done()
		})
	})

	test('focusComponent calls model ComponentClass focusOnContent method if it exists (and calls scrollIntoView if animateScroll=true)', done => {
		expect.assertions(8)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			// Mock component dom elements:
			const mockScrollIntoView = jest.fn()
			const mockFocusOnContent = jest.fn()
			const mockDomEl = {
				scrollIntoView: mockScrollIntoView
			}
			const model = {
				getDomEl: () => mockDomEl,
				getComponentClass: () => ({
					focusOnContent: mockFocusOnContent
				})
			}

			// Force focus() to modify the container scrollTop value (to fake browser focus)
			component.instance().containerRef.current.scrollTop = 0
			const spy = jest.spyOn(Common.page, 'focus').mockImplementation(() => {
				component.instance().containerRef.current.scrollTop = 9999
			})

			expect(component.instance().containerRef.current.scrollTop).not.toBe(9999)
			expect(component.instance().focusComponent(model, { animateScroll: true })).toBe(true)
			expect(focus).toHaveBeenCalledTimes(0)
			expect(mockFocusOnContent).toHaveBeenCalledTimes(1)
			expect(mockFocusOnContent).toHaveBeenCalledWith(model, {
				animateScroll: true
			})
			expect(mockScrollIntoView).toHaveBeenCalledTimes(1)
			expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
			expect(component.instance().containerRef.current.scrollTop).toBe(0)

			spy.mockRestore()
			done()
		})
	})

	test('focusViewer (with invalid target) does nothing', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			expect(component.instance().focusViewer('invalid-target')).toBe(false)

			component.unmount()
			done()
		})
	})

	test('focusViewer (with navigation target) does nothing if nav is disabled and closed', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			NavUtil.isNavEnabled.mockReturnValueOnce(false)
			NavUtil.isNavOpen.mockReturnValueOnce(false)

			expect(component.instance().focusViewer('navigation')).toBe(false)
			expect(component.instance().navRef.current.focus).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('focusViewer (with navigation target) does nothing if nav is disabled and open', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			NavUtil.isNavEnabled.mockReturnValueOnce(false)
			NavUtil.isNavOpen.mockReturnValueOnce(true)

			expect(component.instance().focusViewer('navigation')).toBe(false)
			expect(component.instance().navRef.current.focus).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('focusViewer (with navigation target) does nothing if nav is enabled and closed', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			NavUtil.isNavEnabled.mockReturnValueOnce(true)
			NavUtil.isNavOpen.mockReturnValueOnce(false)

			expect(component.instance().focusViewer('navigation')).toBe(false)
			expect(component.instance().navRef.current.focus).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('focusViewer (with navigation target) calls focus on nav element if nav is enabled and open', done => {
		expect.assertions(2)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			NavUtil.isNavEnabled.mockReturnValueOnce(true)
			NavUtil.isNavOpen.mockReturnValueOnce(true)

			expect(component.instance().focusViewer('navigation')).toBe(true)
			expect(component.instance().navRef.current.focus).toHaveBeenCalledTimes(1)

			component.unmount()
			done()
		})
	})

	test('clearFadeEffect calls FocusUtil.clearFadeEffect if a component has visual focus and the passed in element is not contained by the component', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getVisuallyFocussedModel = jest.fn(() => ({
				getDomEl: () => ({
					contains: () => false
				})
			}))
			FocusUtil.clearFadeEffect = jest.fn()

			component.instance().clearFadeEffect(jest.fn())
			expect(FocusUtil.clearFadeEffect).toHaveBeenCalledTimes(1)

			component.unmount()
			done()
		})
	})

	test("clearFadeEffect calls FocusUtil.clearFadeEffect if a component has visual focus but the component's dom element does not exist", done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getVisuallyFocussedModel = jest.fn(() => ({
				getDomEl: () => null
			}))
			FocusUtil.clearFadeEffect = jest.fn()

			component.instance().clearFadeEffect(jest.fn())
			expect(FocusUtil.clearFadeEffect).toHaveBeenCalledTimes(1)

			component.unmount()
			done()
		})
	})

	test('clearFadeEffect does nothing if a component has visual focus but the passed in element IS contained by the component', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getVisuallyFocussedModel = jest.fn(() => ({
				getDomEl: () => ({
					contains: () => true
				})
			}))
			FocusUtil.clearFadeEffect = jest.fn()

			component.instance().clearFadeEffect(jest.fn())
			expect(FocusUtil.clearFadeEffect).not.toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('clearFadeEffect does nothing if nothing has visual focus', done => {
		expect.assertions(1)
		mocksForMount()

		const component = mount(<ViewerApp />)

		setTimeout(() => {
			FocusUtil.getVisuallyFocussedModel = jest.fn(() => false)
			FocusUtil.clearFadeEffect = jest.fn()

			component.instance().clearFadeEffect(jest.fn())
			expect(FocusUtil.clearFadeEffect).not.toHaveBeenCalled()

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
