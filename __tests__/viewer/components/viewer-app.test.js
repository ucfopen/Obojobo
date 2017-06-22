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
})