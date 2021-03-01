import { mount, shallow } from 'enzyme'

import Assessment from './viewer-component'
import AssessmentUtil from 'obojobo-document-engine/src/scripts/viewer/util/assessment-util'
import Dispatcher from 'obojobo-document-engine/src/scripts/common/flux/dispatcher'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import NavUtil from 'obojobo-document-engine/src/scripts/viewer/util/nav-util'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import Dialog from 'obojobo-document-engine/src/scripts/common/components/modal/dialog'
import AssessmentNetworkStates from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-store/assessment-network-states'
import React from 'react'
import renderer from 'react-test-renderer'
const {
	NOT_IN_ATTEMPT,
	IN_ATTEMPT,
	SEND_RESPONSES_SUCCESSFUL,
	SEND_RESPONSES_FAILED,
	END_ATTEMPT_FAILED,
	STARTING_ATTEMPT,
	RESUMING_ATTEMPT,
	SENDING_RESPONSES,
	ENDING_ATTEMPT
} = AssessmentNetworkStates

jest.mock('obojobo-document-engine/src/scripts/viewer/util/assessment-util')
jest.mock('./components/pre-test')
jest.mock('./components/test')
jest.mock('./components/post-test')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/nav-util')
jest.mock('obojobo-document-engine/src/scripts/common/flux/dispatcher')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('obojobo-document-engine/src/scripts/common/components/modal/dialog')
jest.mock('obojobo-document-engine/src/scripts/common/util/shuffle', () => a => a)

require('./viewer') // used to register this oboModel
require('obojobo-pages-page/viewer')
require('obojobo-chunks-text/viewer')
require('obojobo-chunks-question-bank/viewer')

const assessmentJSON = {
	id: 'assessment',
	type: 'ObojoboDraft.Sections.Assessment',
	content: {
		attempts: 3
	},
	children: [
		{
			id: 'page',
			type: 'ObojoboDraft.Pages.Page',
			children: [
				{
					id: 'child',
					type: 'ObojoboDraft.Chunks.Text',
					content: {
						textGroup: [
							{
								text: {
									value:
										'You have {{assessment:attemptsRemaining}} attempts remaining out of {{assessment:attemptsAmount}}.'
								}
							}
						]
					}
				}
			]
		},
		{
			id: 'QuestionBank',
			type: 'ObojoboDraft.Chunks.QuestionBank'
		}
	]
}

describe('Assessment', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Assessment component is starting at attempt', () => {
		AssessmentUtil.getAssessmentMachineStateForModel.mockReturnValue(STARTING_ATTEMPT)
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: {},
			focusState: {},
			navState: {
				contexts: {}
			}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Assessment component is resuming an attempt', () => {
		AssessmentUtil.getAssessmentMachineStateForModel.mockReturnValue(RESUMING_ATTEMPT)
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: {},
			focusState: {},
			navState: {
				contexts: {}
			}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Pre-test page', () => {
		AssessmentUtil.getAssessmentMachineStateForModel.mockReturnValue(NOT_IN_ATTEMPT)
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: {
				assessments: {
					assessment: {
						id: 'assessment'
					}
				},
				assessmentSummaries: {
					assessment: {
						scores: []
					}
				}
			},
			focusState: {},
			navState: {
				contexts: {}
			}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
