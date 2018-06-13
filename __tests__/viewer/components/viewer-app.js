import React from 'react'
import { mount, shallow } from 'enzyme'

jest.mock('../../../src/scripts/viewer/util/api-util')
jest.mock('../../../src/scripts/viewer/stores/question-store')
jest.mock('../../../src/scripts/common/stores/modal-store')
jest.mock('../../../src/scripts/common/util/modal-util')
jest.mock('../../../src/scripts/common/stores/focus-store')
jest.mock('../../../src/scripts/viewer/stores/nav-store')
jest.mock('../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../src/scripts/viewer/stores/assessment-store')
jest.mock('../../../src/scripts/viewer/components/nav')

import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import ViewerApp from '../../../src/scripts/viewer/components/viewer-app'

import APIUtil from '../../../src/scripts/viewer/util/api-util'
import QuestionStore from '../../../src/scripts/viewer/stores/question-store'
import ModalStore from '../../../src/scripts/common/stores/modal-store'
import ModalUtil from '../../../src/scripts/common/util/modal-util'
import FocusStore from '../../../src/scripts/common/stores/focus-store'
import NavStore from '../../../src/scripts/viewer/stores/nav-store'
import NavUtil from '../../../src/scripts/viewer/util/nav-util'
import AssessmentStore from '../../../src/scripts/viewer/stores/assessment-store'

import testObject from '../../../test-object.json'

describe.skip('ViewerApp', () => {
	let mocksForMount = () => {
		APIUtil.requestStart.mockResolvedValueOnce({
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
		APIUtil.getDraft.mockResolvedValueOnce({ value: testObject })
		NavStore.getState.mockReturnValueOnce({})
		FocusStore.getState.mockReturnValueOnce({})
	}

	test('ViewerApp component', () => {
		mocksForMount()

		let component = mount(<ViewerApp />)

		expect(component.html()).toMatchSnapshot()

		component.unmount()
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

	test.skip('viewer:scrollTo calls ModalUtil', () => {
		mocksForMount()

		let component = mount(<ViewerApp />)

		ReactDOM.findDOMNode = jest.fn().mockReturnValueOnce({ scrollTop: null })

		Dispatcher.trigger('viewer:scrollTo', { value: null })

		expect(ReactDOM.findDOMNode).toHaveBeenCalled()

		component.unmount()
	})
})
