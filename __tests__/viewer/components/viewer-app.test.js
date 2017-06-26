import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount } from 'enzyme'
import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import { AssessmentStore, NavStore, QuestionStore, ScoreStore, ModalStore, FocusStore, AssessmentUtil, NavUtil, QuestionUtil, ScoreUtil, ModalUtil, FocusUtil } from '../../../__mocks__/viewer-state.mock'

import ViewerApp from '../../../src/scripts/viewer/components/viewer-app'
// import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import '../../../__mocks__/_load-all-chunks'

import APIUtil from '../../../src/scripts/viewer/util/api-util'
// console.log('moduleData be all', moduleData.type)

jest.mock('../../../src/scripts/viewer/util/api-util', () => {
	return ({
		get: jest.fn(),
		post: jest.fn(),
		postEvent: jest.fn(),
		saveState: jest.fn(),
		fetchDraft: jest.fn(),
		getAttempts: jest.fn(),
		startAttempt: jest.fn(),
		endAttempt: jest.fn()
	})
})

describe('ViewerApp', () => {
	let json = require('../../../test-object.json');
	// let viewerEl;

	beforeEach(() => {
		jest.clearAllMocks();

		window.__oboGlobals.draft = json;
		window.__oboGlobals.previewing = 'false';
		window.__oboGlobals['ObojoboDraft.Sections.Assessment:attemptHistory'] = [];

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
	})

	test("Prev/Next buttons go to prev/next page", () => {
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
	})

	test("Clicking on a question shows it", () => {
		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('page-3')

		let questionEl = viewerEl.find('#obo-15d5f3a2-4db5-4306-92ae-49325f3eb8e2')

		expect(QuestionStore.getState().viewedQuestions).toEqual({})
		expect(QuestionStore.getState().viewing).toBe(null)

		questionEl.find('.blocker').simulate('click')

		expect(QuestionStore.getState().viewedQuestions).toEqual({
			'15d5f3a2-4db5-4306-92ae-49325f3eb8e2': true
		})
		expect(QuestionStore.getState().viewing).toBe('15d5f3a2-4db5-4306-92ae-49325f3eb8e2')
	})

	test("Answering a question incorrectly displays 'Incorrect' and shows feedback", () => {
		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('page-3')

		let questionEl = viewerEl.find('#obo-15d5f3a2-4db5-4306-92ae-49325f3eb8e2')

		expect(QuestionStore.getState().responses).toEqual({})
		expect(questionEl.find('.result.correct').length).toBe(0) // Correct label
		expect(questionEl.find('.result.incorrect').length).toBe(0) // Incorrect label
		expect(questionEl.find('#obo-31084ca3-199d-441c-9cff-59e9e44b3360').length).toBe(0) // Feedback
		expect(questionEl.find('button').length).toBe(2) // No 'Solution' button

		questionEl.find('.blocker').simulate('click')
		questionEl.find('#obo-6799d1ac-1d55-4c89-b503-58bf0b743096').simulate('click') // wrong answer choice
		questionEl.find('.submit button').simulate('click') // Check your answer button

		expect(questionEl.find('.result.correct').length).toBe(0)
		expect(questionEl.find('.result.incorrect').length).toBe(1)
		expect(questionEl.find('#obo-31084ca3-199d-441c-9cff-59e9e44b3360').length).toBe(1)
		expect(questionEl.find('button').length).toBe(3) // 'Solution' button

		expect(QuestionStore.getState().responses).toEqual({
			'6799d1ac-1d55-4c89-b503-58bf0b743096': { set:true },
			'd3e4cd69-e830-4b20-9e48-146fe1a8f13a': { set:false },
			'd46909e8-9b3e-41de-a1f8-c7f795f19689': { set:false },
		})
		expect(ScoreStore.getState().scores).toEqual({
			'15d5f3a2-4db5-4306-92ae-49325f3eb8e2': 0
		})
	})

	test.only("Answering a question correctly displays 'Correct' and doesn't show feedback", () => {
		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('page-3')

		let questionEl = viewerEl.find('#obo-15d5f3a2-4db5-4306-92ae-49325f3eb8e2')

		expect(QuestionStore.getState().responses).toEqual({})
		expect(questionEl.find('.result.correct').length).toBe(0) // Correct label
		expect(questionEl.find('.result.incorrect').length).toBe(0) // Incorrect label
		expect(questionEl.find('#obo-31084ca3-199d-441c-9cff-59e9e44b3360').length).toBe(0) // Feedback
		expect(questionEl.find('button').length).toBe(2) // No 'Solution' button

		questionEl.find('.blocker').simulate('click')
		questionEl.find('#obo-d46909e8-9b3e-41de-a1f8-c7f795f19689').simulate('click') // wrong answer choice
		questionEl.find('.submit button').simulate('click') // Check your answer button

		expect(questionEl.find('.result.correct').length).toBe(1)
		expect(questionEl.find('.result.incorrect').length).toBe(0)
		expect(questionEl.find('.solution .score').textContent).toBe(undefined)
		expect(questionEl.find('button').length).toBe(3) // 'Solution' button

		expect(QuestionStore.getState().responses).toEqual({
			'6799d1ac-1d55-4c89-b503-58bf0b743096': { set:false },
			'd3e4cd69-e830-4b20-9e48-146fe1a8f13a': { set:false },
			'd46909e8-9b3e-41de-a1f8-c7f795f19689': { set:true },
		})
		expect(ScoreStore.getState().scores).toEqual({
			'15d5f3a2-4db5-4306-92ae-49325f3eb8e2': 100
		})
	})

	test("Clicking the button to show the solution will show the solution", () => {
		let viewerEl = mount(<ViewerApp />)

		NavUtil.goto('page-3')

		let questionEl = viewerEl.find('#obo-15d5f3a2-4db5-4306-92ae-49325f3eb8e2')

		expect(questionEl.find('.solution-container').length).toBe(0)

		questionEl.find('.blocker').simulate('click')
		questionEl.find('#obo-d46909e8-9b3e-41de-a1f8-c7f795f19689').simulate('click') // wrong answer choice
		questionEl.find('.submit button').simulate('click') // Check your answer button
		// expect(questionEl.find('button').at(1)).toBe(1)
		questionEl.find('button').at(1).simulate('click') // Show solution button

		expect(questionEl.find('.solution-container').length).toBe(1)
	})
})