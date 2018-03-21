import React from 'react'
import { shallow, mount } from 'enzyme'
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

APIUtil.startAttempt = () => {
	return Promise.resolve(getAttemptStartServerResponse())
}
APIUtil.endAttempt = () => {
	return Promise.resolve(getAttemptEndServerResponse(100, 100))
}

APIUtil.requestStart = () => {
	return Promise.resolve({
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
}

APIUtil.postEvent = () => {
	return Promise.resolve({ status: 'ok' })
}

APIUtil.getDraft = () => {
	return Promise.resolve({ value: testObject })
}

let viewerEl
let viewerLoaded = false
let viewerLoading = false

Dispatcher.on('viewer:loading', () => (viewerLoading = true))
Dispatcher.on('viewer:loaded', () => (viewerLoaded = true))

describe('ViewerApp', () => {
	beforeEach(done => {
		jest.clearAllMocks()
		viewerEl = mount(<ViewerApp />)
		setTimeout(() => done())
	})

	afterEach(done => {
		viewerEl.unmount()
		setTimeout(() => done())
	})

	test('ViewerApp triggers viewer:loading & viewer:loaded events', () => {
		expect(viewerLoading).toBe(true)
		expect(viewerLoaded).toBe(true)
		Dispatcher.off('viewer:loading')
		Dispatcher.off('viewer:loaded')
	})

	test('ViewerApp renders correctly before and after fetching draft', () => {
		expect(viewerEl.find('.is-loading').length).toBe(1)
		viewerEl.update()
		expect(viewerEl.find('.is-loading').length).toBe(0)
	})

	test("Navigation doesn't change when navigation is locked but does when unlocked", () => {
		NavUtil.lock()
		let html1 = viewerEl.html()

		NavUtil.goPrev()
		let html2 = viewerEl.html()

		NavUtil.unlock()
		let html3 = viewerEl.html()

		NavUtil.goNext()
		let html4 = viewerEl.html()

		expect(html1).toEqual(html2)
		expect(html3).not.toEqual(html4)
	})

	test("Navigation doesn't navigate to a page that doesn't exist", () => {
		NavUtil.unlock()
		let html1 = viewerEl.html()

		NavUtil.goPrev()
		let html2 = viewerEl.html()

		NavUtil.goto('assessment') // last page
		let html3 = viewerEl.html()

		NavUtil.goNext()
		let html4 = viewerEl.html()

		expect(html1).toEqual(html2)
		expect(html3).toEqual(html4)
	})

	test('Prev/Next buttons go to prev/next page', () => {
		viewerEl.update()
		let prevBtnEl = viewerEl.find('.viewer--components--inline-nav-button.is-prev')
		let nextBtnEl = viewerEl.find('.viewer--components--inline-nav-button.is-next')

		expect(viewerEl.find('#obo-page-1').length).toBe(1) // click back, should do nothing

		prevBtnEl.simulate('click')
		expect(viewerEl.find('#obo-page-1').length).toBe(1) // click forward, should move forward

		nextBtnEl.simulate('click')
		expect(viewerEl.find('#obo-page-2').length).toBe(1) // click back, should go back
		prevBtnEl.simulate('click')
		expect(viewerEl.find('#obo-page-1').length).toBe(1) // go to the final page
		nextBtnEl.simulate('click')
		nextBtnEl.simulate('click')
		nextBtnEl.simulate('click')
		nextBtnEl.simulate('click')
		nextBtnEl.simulate('click')
		nextBtnEl.simulate('click')
		expect(viewerEl.find('#obo-assessment').length).toBe(1) // click next, should do nothing
		nextBtnEl.simulate('click')
		expect(viewerEl.find('#obo-assessment').length).toBe(1)
	})

	test('Clicking on a question shows it', () => {
		NavUtil.goto('page-3')
		viewerEl.update()

		let questionEl = viewerEl.find('#obo-pq1')
		expect(QuestionStore.getState().viewedQuestions).toEqual({})
		expect(QuestionStore.getState().viewing).toBe(null)

		questionEl.find('.blocker').simulate('click')

		expect(QuestionStore.getState().viewedQuestions).toEqual({
			pq1: true
		})
		expect(QuestionStore.getState().viewing).toBe('pq1')
	})

	// @ADD BACK
	test.skip("Answering a question incorrectly displays 'Incorrect' and shows feedback", () => {
		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('page-3')
		viewerEl.update()

		let questionEl
		questionEl = viewerEl.find('#obo-pq1')

		expect(QuestionStore.getState().responses).toEqual({})

		expect(questionEl.find('.result.correct').length).toBe(0) // Correct label
		expect(questionEl.find('.result.incorrect').length).toBe(0) // Incorrect label
		expect(questionEl.find('#obo-pq1-mca-mc3-fb').length).toBe(0) // Feedback
		expect(questionEl.find('button').length).toBe(2) // No 'Solution' button

		questionEl.find('.blocker').simulate('click')
		questionEl.find('#obo-pq1-mca-mc3').simulate('click') // wrong answer choice
		questionEl.find('.submit button').simulate('click') // Check your answer button

		viewerEl.update()
		questionEl = viewerEl.find('#obo-pq1')

		expect(questionEl.find('.result.correct').length).toBe(0)
		expect(questionEl.find('.result.incorrect').length).toBe(1)
		expect(questionEl.find('#obo-pq1-mca-mc3-fb').length).toBe(1)
		expect(questionEl.find('button').length).toBe(3) // 'Solution' button

		expect(QuestionStore.getState().responses).toEqual({
			pq1: { ids: ['pq1-mca-mc3'] }
		})

		expect(scores.pq1).toBeDefined()
		expect(Object.keys(scores.pq1).sort()).toEqual(['id', 'itemId', 'score'])
		expect(scores.pq1.itemId).toEqual('pq1')
		expect(scores.pq1.score).toEqual(0)
	})

	// @ADD BACK
	test.skip("Answering a question correctly displays 'Correct' and doesn't show feedback if none exists", () => {
		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('page-3')

		let questionEl = viewerEl.find('#obo-pq1')

		expect(QuestionStore.getState().responses).toEqual({})
		expect(questionEl.find('.result.correct').length).toBe(0) // Correct label
		expect(questionEl.find('.result.incorrect').length).toBe(0) // Incorrect label
		expect(questionEl.find('button').length).toBe(2) // No 'Solution' button

		questionEl.find('.blocker').simulate('click')
		questionEl.find('#obo-pq1-mca-mc1').simulate('click') // correct answer choice
		questionEl.find('.submit button').simulate('click') // Check your answer button

		expect(questionEl.find('.result.correct').length).toBe(1)
		expect(questionEl.find('.result.incorrect').length).toBe(0)
		expect(questionEl.find('.solution .score').textContent).toBe(undefined)
		expect(questionEl.find('button').length).toBe(3) // 'Solution' button

		expect(QuestionStore.getState().responses).toEqual({
			pq1: { ids: ['pq1-mca-mc1'] }
		})

		expect(scores.pq1).toBeDefined()
		expect(Object.keys(scores.pq1).sort()).toEqual(['id', 'itemId', 'score'])
		expect(scores.pq1.itemId).toEqual('pq1')
		expect(scores.pq1.score).toEqual(100)

		viewerEl.unmount()
	})

	test('Clicking the button to show the solution will show the solution', () => {
		NavUtil.goto('page-3')
		viewerEl.update()

		let questionEl
		questionEl = viewerEl.find('#obo-pq1')

		let updateQuestion = () => {
			viewerEl.update()
			questionEl = viewerEl.find('#obo-pq1')
		}

		expect(questionEl.find('.solution-container').length).toBe(0)

		questionEl.find('.blocker').simulate('click')
		updateQuestion()
		questionEl.find('#obo-pq1-mca-mc3').simulate('click') // wrong answer choice
		updateQuestion()
		questionEl.find('.submit button').simulate('click') // Check your answer button
		updateQuestion()
		questionEl
			.find('button')
			.at(1)
			.simulate('click') // Show solution button
		updateQuestion()

		expect(questionEl.find('.solution-container').length).toBe(1)
	})

	test('Clicking start assessment will lock out navigation and start the assessment', done => {
		let onAttemptStarted = () => {
			Dispatcher.off('assessment:attemptStarted', onAttemptStarted)

			let navEl = viewerEl.find('.viewer--components--nav')
			let firstPgLinkEl = navEl.find('a').at(1)
			firstPgLinkEl.simulate('click')

			expect(viewerEl.find('#obo-assessment').length).toBe(1)
			expect(viewerEl.find('#obo-page-1').length).toBe(0)

			// preview mode allows us to unlock the navigation however
			let previewBannerEl = viewerEl.find('.preview-banner')
			let unlockButtonEl = previewBannerEl.find('button').at(0)

			unlockButtonEl.simulate('click')
			firstPgLinkEl.simulate('click')

			expect(viewerEl.find('#obo-assessment').length).toBe(0)
			expect(viewerEl.find('#obo-page-1').length).toBe(1)
			done()
		}
		NavUtil.goto('assessment')
		viewerEl.update()

		Dispatcher.on('assessment:attemptStarted', onAttemptStarted)

		let buttonEl = viewerEl.find('#obo-start-assessment-button')
		buttonEl.find('button').simulate('click')
	})

	test.skip('Finishing an assessment shows a score', done => {
		let onAttemptStarted = () => {
			Dispatcher.off('assessment:attemptStarted', onAttemptStarted)
			viewerEl.update()
			let q1 = viewerEl.find('#obo-qb1-q1')
			q1.find('.flipper').simulate('click')

			let c1 = viewerEl.find('#obo-qb1-q1-mca-mc1')
			c1.simulate('click')

			viewerEl
				.find('.submit-button')
				.find('button')
				.simulate('click')
		}

		let onAttemptEnded = () => {
			Dispatcher.off('assessment:attemptEnded', onAttemptEnded)

			let assessmentEl = viewerEl.find('#obo-assessment')
			let score = assessmentEl.find('.score')
			let assessment = AssessmentStore.getState().assessments.assessment
			let attempt = assessment.attempts[0]

			expect(assessment.attempts.length).toBe(1)
			expect(attempt.result).toEqual({
				attemptScore: 100,
				assessmentScore: 100,
				questionScores: [
					{
						id: 'qb1-q1',
						score: 100
					}
				]
			})
			done()
		}
		NavUtil.goto('assessment')
		viewerEl.update()

		Dispatcher.on('assessment:attemptStarted', onAttemptStarted)
		Dispatcher.on('assessment:attemptEnded', onAttemptEnded)

		let buttonEl = viewerEl.find('#obo-start-assessment-button')
		buttonEl.find('button').simulate('click')
	})
})
