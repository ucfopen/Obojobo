import React from 'react'
import { mount } from 'enzyme'
import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import {
	getAttemptStartServerResponse,
	getAttemptEndServerResponse
} from '../../../__mocks__/assessment-server.mock'
import {
	AssessmentStore,
	NavStore,
	QuestionStore,
	ModalStore,
	FocusStore,
	AssessmentUtil,
	NavUtil,
	QuestionUtil,
	ModalUtil,
	FocusUtil
} from '../../../__mocks__/viewer-state.mock'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import ViewerApp from '../../../src/scripts/viewer/components/viewer-app'
import '../../../__mocks__/_load-all-chunks'
import APIUtil from '../../../src/scripts/viewer/util/api-util'
import testObject from '../../../test-object.json'

let viewerEl

const _gotoAssessmentAndStartAttempt = () => {
	// navigate to assessment
	NavUtil.goto('my-assessment')

	viewerEl.update() // render

	// click start assessment
	viewerEl.find('.obojobo-draft--components--button button').simulate('click')
}

// this util helps flush promises that are in limbo w/o having to use timers
const flushPromises = () => new Promise(resolve => setImmediate(resolve))

describe('ViewerApp', () => {
	beforeEach(done => {
		jest.clearAllMocks()
		APIUtil.postEvent = jest.fn().mockResolvedValue({ status: 'ok' })
		APIUtil.startAttempt = jest.fn().mockResolvedValue(getAttemptStartServerResponse())
		APIUtil.endAttempt = jest.fn().mockResolvedValue(getAttemptEndServerResponse(100, 100))
		APIUtil.getDraft = jest.fn().mockResolvedValue({ value: testObject })
		APIUtil.requestStart = jest.fn().mockResolvedValue({
			status: 'ok',
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
		jest.spyOn(document, 'addEventListener')
		jest.spyOn(document, 'removeEventListener')
		jest.spyOn(Dispatcher, 'trigger')
		viewerEl = mount(<ViewerApp />)
		setTimeout(() => {
			// sometimes the veiwer needs a moment
			viewerEl.update()
			jest.spyOn(AssessmentStore, 'init')
			jest.spyOn(QuestionStore, 'init')
			done()
		})
	})

	afterEach(() => {
		AssessmentStore.init.mockRestore()
		QuestionStore.init.mockRestore()
		Dispatcher.trigger.mockRestore()
		document.addEventListener.mockRestore()
		document.removeEventListener.mockRestore()
		viewerEl.unmount()
	})

	test('ViewerApp triggers viewer:loading & viewer:loaded events', () => {
		return flushPromises().then(() => {
			expect(Dispatcher.trigger).toHaveBeenCalledWith('viewer:loading')
			expect(Dispatcher.trigger).toHaveBeenCalledWith('viewer:loaded', true)
		})
	})

	test('ViewerApp clears loading element', () => {
		expect(window.document.getElementById('viewer-app-loading')).toBe(null)
	})

	test('locking navigation removes the next and prev buttons', () => {
		expect(viewerEl.find('.viewer--components--inline-nav-button.is-prev').exists()).toBe(true)
		expect(viewerEl.find('.viewer--components--inline-nav-button.is-next').exists()).toBe(true)

		NavUtil.lock()
		viewerEl.update()

		expect(viewerEl.find('.viewer--components--inline-nav-button.is-prev').exists()).toBe(false)
		expect(viewerEl.find('.viewer--components--inline-nav-button.is-next').exists()).toBe(false)
	})

	test("Navigation doesn't navigate to a page that doesn't exist", () => {
		let initialHtml = viewerEl.html()

		// click next
		viewerEl.find('.viewer--components--inline-nav-button.is-next').simulate('click')
		viewerEl.update()
		expect(viewerEl.html()).not.toEqual(initialHtml)

		// goto assesment
		NavUtil.goto('my-assessment')
		viewerEl.update()
		let assessmentHtml = viewerEl.html()

		// click next
		viewerEl.find('.viewer--components--inline-nav-button.is-next').simulate('click')
		viewerEl.update()
		expect(viewerEl.html()).toEqual(assessmentHtml)
	})

	test('Prev/Next buttons go to prev/next page', () => {
		// grab a few page Ids from the test object
		const pageIds = testObject.children[0].children.map(c => c.id)
		const [page1, page2] = pageIds

		// grab the next and previous buttons
		const prevBtnEl = viewerEl.find('.viewer--components--inline-nav-button.is-prev')
		const nextBtnEl = viewerEl.find('.viewer--components--inline-nav-button.is-next')

		// first page should be visible
		expect(viewerEl.find('#obo-' + page1).exists()).toBe(true)

		// click back, should do nothing because theres no where to go
		prevBtnEl.simulate('click')
		expect(viewerEl.find('#obo-' + page1).exists()).toBe(true)

		// click next, should go to page 2
		nextBtnEl.simulate('click')
		expect(viewerEl.find('#obo-' + page2).exists()).toBe(true)

		// no back should go to page 1
		prevBtnEl.simulate('click')
		expect(viewerEl.find('#obo-' + page1).exists()).toBe(true)

		// click next once for each page to get the assessment
		pageIds.forEach(() => {
			nextBtnEl.simulate('click')
		})
		expect(viewerEl.find('#obo-my-assessment').exists()).toBe(true)

		// click next, should do nothing becuase there's no next page
		nextBtnEl.simulate('click')
		expect(viewerEl.find('#obo-my-assessment').exists()).toBe(true)
	})

	// TODO: move this to Question/viewer-component.test.js
	test('Clicking on a question shows it', () => {
		NavUtil.goto('questions-page')
		viewerEl.update()

		let questionEl = viewerEl.find('#obo-practice-question-1')
		expect(QuestionStore.getState().viewedQuestions).toEqual({})
		expect(QuestionStore.getState().viewing).toBe(null)

		questionEl.find('.blocker').simulate('click')

		expect(QuestionStore.getState().viewedQuestions).toEqual({
			'practice-question-1': true
		})
		expect(QuestionStore.getState().viewing).toBe('practice-question-1')
	})

	// TODO: move this to Question/viewer-component.test.js
	test("Answering a question incorrectly displays 'Incorrect' and shows feedback", () => {
		NavUtil.goto('questions-page')
		viewerEl.update()

		let questionEl = viewerEl.find('#obo-practice-question-1')

		// shows no correct label
		expect(questionEl.find('.result.correct').exists()).toBe(false)
		// shows no incorrect label
		expect(questionEl.find('.result.incorrect').exists()).toBe(false)
		// shows no feedback
		expect(questionEl.find('.obojobo-draft--chunks--mc-assessment--mc-feedback').exists()).toBe(
			false
		)
		// shows no solution button
		expect(questionEl.find('.show-explanation-button').exists()).toBe(false)

		// click the question
		questionEl.find('.flipper').simulate('click')
		// click on the wrong answer
		questionEl.find('#obo-pq1-answer-3').simulate('click')
		// submit the question

		questionEl.find('.submit button').simulate('click') // Check your answer button

		// Fetch the question again after updating
		questionEl = viewerEl.find('#obo-practice-question-1')

		// no correct flag to show, answer is wrong
		expect(questionEl.find('.result.correct').exists()).toBe(false)
		// shows incorrect
		expect(questionEl.find('.result.incorrect').exists()).toBe(true)
		// shows feedback
		expect(questionEl.find('.obojobo-draft--chunks--mc-assessment--mc-feedback').exists()).toBe(
			true
		)
		// shows solution button
		expect(questionEl.find('.show-explanation-button').exists()).toBe(true)
	})

	// @ADD BACK
	test("Answering a question correctly displays 'Correct' and doesn't show feedback if none exists", () => {
		NavUtil.goto('questions-page')
		viewerEl.update()

		let questionEl = viewerEl.find('#obo-practice-question-1')

		// shows no correct label
		expect(questionEl.find('.result.correct').exists()).toBe(false)
		// shows no incorrect label
		expect(questionEl.find('.result.incorrect').exists()).toBe(false)
		// shows no feedback
		expect(questionEl.find('.obojobo-draft--chunks--mc-assessment--mc-feedback').exists()).toBe(
			false
		)
		// shows no solution button
		expect(questionEl.find('.show-explanation-button').exists()).toBe(false)

		// click the question
		questionEl.find('.flipper').simulate('click')
		// click on the correct answer
		questionEl.find('#obo-pq1-answer-1').simulate('click')
		// submit the question
		questionEl.find('.submit button').simulate('click') // Check your answer button

		// check for the items
		questionEl = viewerEl.find('#obo-practice-question-1')

		// show correct
		expect(questionEl.find('.result.correct').exists()).toBe(true)
		// answer is right, no incorrect to show
		expect(questionEl.find('.result.incorrect').exists()).toBe(false)
		// ?
		expect(questionEl.find('.solution .score').textContent).toBe(undefined)
		// show solution button
		expect(questionEl.find('.show-explanation-button').exists()).toBe(true)
	})

	test('Clicking the button to show the solution will show the solution', () => {
		let questionEl
		NavUtil.goto('questions-page')

		let updateQuestion = () => {
			viewerEl.update()
			questionEl = viewerEl.find('#obo-practice-question-1')
		}

		updateQuestion()

		// make sure no solutions are shown
		expect(questionEl.find('.solution-container').exists()).toBe(false)

		// click the blocker/flipper
		questionEl.find('.blocker').simulate('click')
		updateQuestion()

		// wrong answer choice
		questionEl.find('#obo-pq1-answer-3').simulate('click')
		updateQuestion()

		// Check your answer button
		questionEl.find('.submit button').simulate('click')
		updateQuestion()

		questionEl
			.find('button')
			.at(1)
			.simulate('click') // Show solution button
		updateQuestion()

		expect(questionEl.find('.solution-container').exists()).toBe(true)
	})

	test('Clicking start assessment will lock out navigation and start the assessment', done => {
		Dispatcher.once('assessment:attemptStarted', () => {
			let firstPgLinkEl = viewerEl.find('.viewer--components--nav a').at(1)
			firstPgLinkEl.simulate('click')

			expect(viewerEl.find('#obo-my-assessment').exists()).toBe(true)
			expect(viewerEl.find('#obo-page-1').exists()).toBe(false)

			// preview mode allows us to unlock the navigation however
			let previewBannerEl = viewerEl.find('.preview-banner')
			let unlockButtonEl = previewBannerEl.find('button').at(0)

			unlockButtonEl.simulate('click')
			firstPgLinkEl.simulate('click')

			expect(viewerEl.find('#obo-assessment').exists()).toBe(false)
			expect(viewerEl.find('#obo-page-1').exists()).toBe(true)
			done()
		})

		_gotoAssessmentAndStartAttempt()
	})

	test('Finishing an assessment shows a score', done => {
		const testObjectAssessment = testObject.children[1]
		const questions = testObjectAssessment.children[1].children[0].children

		// after assessment starts
		Dispatcher.once('assessment:attemptStarted', () => {
			viewerEl.update() // render

			let id = questions[0].id
			let answer = questions[0].children[1].children[0].children[0].id
			// open a question
			viewerEl.find('#obo-' + id + ' .flipper').simulate('click')
			// click an answer
			viewerEl.find('#obo-' + answer).simulate('click')

			id = questions[1].id
			answer = questions[1].children[1].children[0].children[0].id
			// open a question
			viewerEl.find('#obo-' + id + ' .flipper').simulate('click')
			// click an answer
			viewerEl.find('#obo-' + answer).simulate('click')

			id = questions[2].id
			answer = questions[2].children[1].children[0].children[0].id
			// open a question
			viewerEl.find('#obo-' + id + ' .flipper').simulate('click')
			// click an answer
			viewerEl.find('#obo-' + answer).simulate('click')

			// click submit (not active unless an answer is chosen)
			viewerEl.find('.submit-button button').simulate('click')
		})

		// after assessment ends
		Dispatcher.once('assessment:attemptEnded', () => {
			viewerEl.update() // render

			// make sure the 100 score shows up on the score page
			expect(viewerEl.find('.recorded-score .value').text()).toBe('100')

			done() // finish test
		})

		_gotoAssessmentAndStartAttempt()
	})

	// @TODO - add click tests that fire nav:goto and nav:gotoPath
	// should be clicking the next / nav buttons
	// and checking to make sure the events are fired
	test('Emitting nav events produces the appropriate event for APIUtil.postEvent', () => {
		APIUtil.postEvent.mockReset()
		let prevBtnEl = viewerEl.find('.viewer--components--inline-nav-button.is-prev')
		let nextBtnEl = viewerEl.find('.viewer--components--inline-nav-button.is-next')
		let anything = expect.anything()

		// expect initial state
		expect(viewerEl.find('#obo-page-1').exists()).toBe(true)

		// click back, should not emit event
		prevBtnEl.simulate('click')
		expect(APIUtil.postEvent).not.toHaveBeenCalled()

		// click forward to page 2
		nextBtnEl.simulate('click')
		expect(APIUtil.postEvent).toHaveBeenLastCalledWith(anything, 'nav:next', anything, anything)

		// click back to page 1
		prevBtnEl.simulate('click')
		expect(APIUtil.postEvent).toHaveBeenLastCalledWith(anything, 'nav:prev', anything, anything)
	})

	test('Emitting answering assessment question fires the expected postEvents in order', done => {
		const testObjectAssessment = testObject.children[1]
		const questions = testObjectAssessment.children[1].children[0].children

		// executes after attempt starts
		Dispatcher.once('assessment:attemptStarted', () => {
			viewerEl.update() // render

			let id = questions[0].id
			let answer = questions[0].children[1].children[0].children[0].id
			// open a question
			viewerEl.find('#obo-' + id + ' .flipper').simulate('click')
			// click an answer
			viewerEl.find('#obo-' + answer).simulate('click')

			// collect the event names
			let orderedEvents = APIUtil.postEvent.mock.calls.map(c => c[1])

			// expect that the interface fires
			expect(orderedEvents).toEqual(['nav:goto', 'nav:goto', 'nav:lock', 'question:setResponse'])

			done()
		})

		_gotoAssessmentAndStartAttempt()
	})

	test('Emitting question events produces the appropriate event for APIUtil.postEvent', () => {
		const testObjectAssessment = testObject.children[1]
		const questions = testObjectAssessment.children[1].children[0].children
		const questionId = questions[0].id
		const answerId = questions[0].children[1].children[0].children[0].id

		APIUtil.postEvent = jest.fn()

		QuestionUtil.setResponse(questionId, { ids: [answerId] }, answerId)
		expect(APIUtil.postEvent).toHaveBeenCalledWith(
			OboModel.getRoot(),
			'question:setResponse',
			'2.1.0',
			{
				questionId: questionId,
				targetId: answerId,
				response: { ids: [answerId] }
			}
		)

		QuestionUtil.hideQuestion(questionId)
		expect(APIUtil.postEvent).toHaveBeenLastCalledWith(
			OboModel.getRoot(),
			'question:hide',
			'1.0.0',
			{
				questionId: questionId
			}
		)

		QuestionUtil.viewQuestion(questionId)
		expect(APIUtil.postEvent).toHaveBeenLastCalledWith(
			OboModel.getRoot(),
			'question:view',
			'1.0.0',
			{
				questionId: questionId
			}
		)
	})

	test('registers listener to onbeforeunload', () => {
		let ViewerApp = viewerEl.instance()
		expect(window.onbeforeunload).toBe(ViewerApp.onBeforeWindowClose)
		expect(window.onunload).toBe(ViewerApp.onWindowClose)
	})

	test('onWindowClose fires postEvent', () => {
		APIUtil.postEvent.mockReset()
		let ViewerApp = viewerEl.instance()
		ViewerApp.onWindowClose()
		expect(APIUtil.postEvent).toHaveBeenCalledTimes(1)
		expect(APIUtil.postEvent).toHaveBeenCalledWith(
			viewerEl.state('model'),
			'viewer:close',
			expect.any(String),
			{}
		)
	})

	test('onBeforeWindowClose triggers event and allows closing', () => {
		let ViewerApp = viewerEl.instance()
		expect(ViewerApp.onBeforeWindowClose()).toBe(undefined)
		expect(Dispatcher.trigger).toHaveBeenLastCalledWith(
			'viewer:closeAttempted',
			expect.any(Function)
		)
	})

	test('onBeforeWindowClose triggers event', () => {
		// calling preventClose should change the return value to true
		// which propmts the user before closing the window
		Dispatcher.on('viewer:closeAttempted', preventClose => {
			preventClose()
		})

		let ViewerApp = viewerEl.instance()
		expect(ViewerApp.onBeforeWindowClose()).toBe(true)
	})

	test('clearPreviewScores makes call to clearPreviewScores api', () => {
		APIUtil.clearPreviewScores = jest.fn().mockResolvedValue({ status: 'ok' })
		// click clear scores button
		viewerEl.find('.button-clear-scores').simulate('click')

		expect(APIUtil.clearPreviewScores).toHaveBeenCalledTimes(1)
	})

	test('clearPreviewScores resets stores and triggers events', () => {
		APIUtil.clearPreviewScores = jest.fn().mockResolvedValue({ status: 'ok' })
		// click clear scores button
		viewerEl.find('.button-clear-scores').simulate('click')

		return flushPromises().then(() => {
			expect(AssessmentStore.init).toHaveBeenCalledTimes(1)
			expect(QuestionStore.init).toHaveBeenCalledTimes(1)
			expect(Dispatcher.trigger).toHaveBeenCalledWith('modalstore:change')
			expect(Dispatcher.trigger).toHaveBeenCalledWith('questionStore:change')
		})
	})

	test('clearPreviewScores shows error dialog', () => {
		Dispatcher.trigger.mockReset()
		APIUtil.clearPreviewScores = jest.fn().mockResolvedValue({ status: 'error', value: 'whoops' })
		// click clear scores button
		viewerEl.find('.button-clear-scores').simulate('click')

		return flushPromises().then(() => {
			expect(AssessmentStore.init).not.toHaveBeenCalled()
			expect(QuestionStore.init).not.toHaveBeenCalled()
			expect(Dispatcher.trigger.mock.calls[0]).toMatchSnapshot()
		})
	})

	test('onVisibilityChange is registered to onVisibilityChange', () => {
		let ViewerApp = viewerEl.instance()
		expect(document.addEventListener).toHaveBeenCalledWith(
			'visibilitychange',
			ViewerApp.onVisibilityChange
		)
	})

	test('onVisibilityChange is removed to onVisibilityChange when unmounted', () => {
		let ViewerApp = viewerEl.instance()
		viewerEl.unmount()
		expect(document.addEventListener).toHaveBeenCalledWith(
			'visibilitychange',
			ViewerApp.onVisibilityChange
		)
	})

	test('onVisibilityChange post event when hidden', () => {
		document.hidden = true // indicates the browser tab is hidden
		let ViewerApp = viewerEl.instance()
		ViewerApp.onVisibilityChange()
		expect(APIUtil.postEvent).toHaveBeenLastCalledWith(
			viewerEl.state('model'),
			'viewer:leave',
			'1.0.0',
			{}
		)
	})

	test('onVisibilityChange post event when returning', () => {
		document.hidden = false // indicates the browser tab is not hidden
		let ViewerApp = viewerEl.instance()

		// leaveEvent is temporarily stored on the component
		ViewerApp.leaveEvent = { id: 'mockId' }

		ViewerApp.onVisibilityChange()
		expect(APIUtil.postEvent).toHaveBeenLastCalledWith(
			viewerEl.state('model'),
			'viewer:return',
			'1.0.0',
			{ relatedEventId: 'mockId' }
		)
	})

	test('idle posts event', () => {
		let ViewerApp = viewerEl.instance()
		ViewerApp.onIdle()
		expect(APIUtil.postEvent).toHaveBeenLastCalledWith(
			viewerEl.state('model'),
			'viewer:inactive',
			'2.0.0',
			expect.any(Object)
		)
	})

	test('returnFromIdle fires event', () => {
		let ViewerApp = viewerEl.instance()

		// inactiveEvent is temporarily stored on the component
		ViewerApp.inactiveEvent = { id: 'mockId' }

		ViewerApp.onReturnFromIdle()
		expect(APIUtil.postEvent).toHaveBeenLastCalledWith(
			viewerEl.state('model'),
			'viewer:returnFromInactive',
			'2.0.0',
			expect.any(Object)
		)
	})

	test('handles requestStart in a failure state', () => {
		APIUtil.requestStart.mockResolvedValueOnce({ status: 'error' })
		viewerEl = mount(<ViewerApp />)
		return flushPromises().then(() => {
			expect(Dispatcher.trigger).toHaveBeenLastCalledWith('viewer:loaded', false)
		})
	})
})
