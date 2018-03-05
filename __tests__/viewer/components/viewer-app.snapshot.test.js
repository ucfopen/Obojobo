import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount } from 'enzyme'
import OboModel from '../../../__mocks__/_obo-model-with-chunks'
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
	ModalUtil,
	FocusUtil
} from '../../../__mocks__/viewer-state.mock'

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

describe('ViewerApp', () => {
	let json = require('../../../test-object.json')
	// let viewerEl;

	beforeEach(() => {
		jest.clearAllMocks()

		window.__oboGlobals.draft = json
		window.__oboGlobals.previewing = true
		window.__oboGlobals.ltiLaunch = {}
		window.__oboGlobals['ObojoboDraft.Sections.Assessment:attemptHistory'] = []

		// viewerEl = mount(<ViewerApp />)
	})

	test('ViewerApp', () => {
		const component = renderer.create(<ViewerApp />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
