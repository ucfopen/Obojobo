import React from 'react'
import renderer from 'react-test-renderer'
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
	ScoreStore,
	ModalStore,
	FocusStore,
	AssessmentUtil,
	NavUtil,
	QuestionUtil,
	ScoreUtil,
	ModalUtil,
	FocusUtil
} from '../../../__mocks__/viewer-state.mock'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import ViewerApp from '../../../src/scripts/viewer/components/viewer-app'
// import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import '../../../__mocks__/_load-all-chunks'

import APIUtil from '../../../src/scripts/viewer/util/api-util'
// console.log('moduleData be all', moduleData.type)

jest.mock('../../../src/scripts/viewer/util/api-util', () => {
	return {
		get: jest.fn(),
		post: jest.fn(),
		postEvent: jest.fn(),
		saveState: jest.fn(),
		fetchDraft: jest.fn(),
		getAttempts: jest.fn(),
		startAttempt: jest.fn(),
		endAttempt: jest.fn()
	}
})

APIUtil.postEvent = () => {
	return Promise.resolve({ status: 'ok' })
}
APIUtil.startAttempt = () => {
	return Promise.resolve(getAttemptStartServerResponse())
}
APIUtil.endAttempt = () => {
	return Promise.resolve(getAttemptEndServerResponse(100))
}

describe('ViewerApp', () => {
	let json = require('../../../test-object.json')
	// let viewerEl;

	beforeEach(() => {
		jest.clearAllMocks()

		window.__oboGlobals.draft = json
		window.__oboGlobals.previewing = 'false'
		window.__oboGlobals['ObojoboDraft.Sections.Assessment:attemptHistory'] = []

		// viewerEl = mount(<ViewerApp />)
	})

	test("Navigation doesn't change when navigation is locked but does when unlocked", () => {
		let viewerEl = mount(<ViewerApp />)

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

		viewerEl.unmount()
	})

	test("Navigation doesn't navigate to a page that doesn't exist", () => {
		let viewerEl = mount(<ViewerApp />)

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

		viewerEl.unmount()
	})

	test("Navigation doesn't navigate to a page that doesn't exist", () => {
		let viewerEl = mount(<ViewerApp />)

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

		viewerEl.unmount()
	})

	test('Prev/Next buttons go to prev/next page', () => {
		let viewerEl = mount(<ViewerApp />)
		let prevBtnEl = viewerEl.find('.viewer--components--inline-nav-button.is-prev')
		let nextBtnEl = viewerEl.find('.viewer--components--inline-nav-button.is-next')

		expect(viewerEl.find('#obo-page-1').length).toBe(1)

		// click back, should do nothing
		prevBtnEl.simulate('click')
		expect(viewerEl.find('#obo-page-1').length).toBe(1)

		// click forward, should move forward
		nextBtnEl.simulate('click')
		expect(viewerEl.find('#obo-page-2').length).toBe(1)

		// click back, should go back
		prevBtnEl.simulate('click')
		expect(viewerEl.find('#obo-page-1').length).toBe(1)

		// go to the final page
		nextBtnEl.simulate('click')
		nextBtnEl.simulate('click')
		nextBtnEl.simulate('click')
		nextBtnEl.simulate('click')
		nextBtnEl.simulate('click')
		nextBtnEl.simulate('click')
		expect(viewerEl.find('#obo-assessment').length).toBe(1)

		// click next, should do nothing
		nextBtnEl.simulate('click')
		expect(viewerEl.find('#obo-assessment').length).toBe(1)

		viewerEl.unmount()
	})

	test('Clicking on a question shows it', () => {
		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('page-3')

		let questionEl = viewerEl.find('#obo-pq1')

		expect(QuestionStore.getState().viewedQuestions).toEqual({})
		expect(QuestionStore.getState().viewing).toBe(null)

		questionEl.find('.blocker').simulate('click')

		expect(QuestionStore.getState().viewedQuestions).toEqual({
			pq1: true
		})
		expect(QuestionStore.getState().viewing).toBe('pq1')

		viewerEl.unmount()
	})

	test("Answering a question incorrectly displays 'Incorrect' and shows feedback", () => {
		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('page-3')

		let questionEl = viewerEl.find('#obo-pq1')

		expect(QuestionStore.getState().responses).toEqual({})
		expect(questionEl.find('.result.correct').length).toBe(0) // Correct label
		expect(questionEl.find('.result.incorrect').length).toBe(0) // Incorrect label
		expect(questionEl.find('#obo-pq1-mca-mc3-fb').length).toBe(0) // Feedback
		expect(questionEl.find('button').length).toBe(2) // No 'Solution' button

		questionEl.find('.blocker').simulate('click')
		questionEl.find('#obo-pq1-mca-mc3').simulate('click') // wrong answer choice
		questionEl.find('.submit button').simulate('click') // Check your answer button

		expect(questionEl.find('.result.correct').length).toBe(0)
		expect(questionEl.find('.result.incorrect').length).toBe(1)
		expect(questionEl.find('#obo-pq1-mca-mc3-fb').length).toBe(1)
		expect(questionEl.find('button').length).toBe(3) // 'Solution' button

		expect(QuestionStore.getState().responses).toEqual({
			pq1: { ids: ['pq1-mca-mc3'] }
		})

		let scores = ScoreStore.getState().scores
		expect(scores.pq1).toBeDefined()
		expect(Object.keys(scores.pq1).sort()).toEqual(['id', 'itemId', 'score'])
		expect(scores.pq1.itemId).toEqual('pq1')
		expect(scores.pq1.score).toEqual(0)

		viewerEl.unmount()
	})

	test("Answering a question correctly displays 'Correct' and doesn't show feedback if none exists", () => {
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

		let scores = ScoreStore.getState().scores
		expect(scores.pq1).toBeDefined()
		expect(Object.keys(scores.pq1).sort()).toEqual(['id', 'itemId', 'score'])
		expect(scores.pq1.itemId).toEqual('pq1')
		expect(scores.pq1.score).toEqual(100)

		viewerEl.unmount()
	})

	test('Clicking the button to show the solution will show the solution', () => {
		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('page-3')

		let questionEl = viewerEl.find('#obo-pq1')

		expect(questionEl.find('.solution-container').length).toBe(0)

		questionEl.find('.blocker').simulate('click')
		questionEl.find('#obo-pq1-mca-mc3').simulate('click') // wrong answer choice
		questionEl.find('.submit button').simulate('click') // Check your answer button
		// expect(questionEl.find('button').at(1)).toBe(1)
		questionEl.find('button').at(1).simulate('click') // Show solution button

		expect(questionEl.find('.solution-container').length).toBe(1)

		viewerEl.unmount()
	})

	test('Clicking start assessment will lock out navigation and start the assessment', done => {
		let onAttemptStarted = () => {
			Dispatcher.off('assessment:attemptStarted', onAttemptStarted)

			expect(viewerEl.find('#obo-assessment').length).toBe(1)
			expect(viewerEl.find('#obo-page-1').length).toBe(0)

			// preview mode allows us to unlock the navigation however
			let previewBannerEl = viewerEl.find('.preview-banner')
			let unlockButtonEl = previewBannerEl.find('button').at(0)

			unlockButtonEl.simulate('click')
			firstPgLinkEl.simulate('click')

			expect(viewerEl.find('#obo-assessment').length).toBe(0)
			expect(viewerEl.find('#obo-page-1').length).toBe(1)

			viewerEl.unmount()

			done()
		}
		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('assessment')

		let buttonEl = viewerEl.find('#obo-start-assessment-button')

		buttonEl.find('button').simulate('click')

		expect(viewerEl.find('#obo-assessment').length).toBe(1)
		expect(viewerEl.find('#obo-page-1').length).toBe(0)

		let navEl = viewerEl.find('.viewer--components--nav')
		let firstPgLinkEl = navEl.find('a').at(1)

		Dispatcher.on('assessment:attemptStarted', onAttemptStarted)
		firstPgLinkEl.simulate('click')
	})

	test('Finishing an assessment shows a score', done => {
		let onAttemptStarted = () => {
			Dispatcher.off('assessment:attemptStarted', onAttemptStarted)

			let q1 = viewerEl.find('#obo-qb1-q1')
			q1.find('.flipper').simulate('click')

			let c1 = viewerEl.find('#obo-qb1-q1-mca-mc1')

			c1.simulate('click')

			viewerEl.find('.submit-button').find('button').simulate('click')
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
				scores: [
					{
						id: 'qb1-q1',
						score: 100
					}
				]
			})

			viewerEl.unmount()

			done()
		}

		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('assessment')

		Dispatcher.on('assessment:attemptStarted', onAttemptStarted)
		Dispatcher.on('assessment:attemptEnded', onAttemptEnded)

		let buttonEl = viewerEl.find('#obo-start-assessment-button')
		buttonEl.find('button').simulate('click')
	})
})
