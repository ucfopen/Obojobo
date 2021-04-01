import Assessment from './viewer-component'
import AssessmentUtil from 'obojobo-document-engine/src/scripts/viewer/util/assessment-util'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import AssessmentNetworkStates from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-store/assessment-network-states'
import React from 'react'
import renderer from 'react-test-renderer'
import Dispatcher from 'obojobo-document-engine/src/scripts/common/flux/dispatcher'
import NavUtil from 'obojobo-document-engine/src/scripts/viewer/util/nav-util'
import FocusUtil from 'obojobo-document-engine/src/scripts/viewer/util/focus-util'
const {
	NOT_IN_ATTEMPT,
	IN_ATTEMPT,
	STARTING_ATTEMPT,
	RESUMING_ATTEMPT,
	ENDING_ATTEMPT
} = AssessmentNetworkStates

jest.mock('obojobo-document-engine/src/scripts/viewer/util/assessment-util')
jest.mock('./components/pre-test')
jest.mock('./components/test')
jest.mock('./components/post-test')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/nav-util')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/focus-util')
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

	test('Test page (Not ready to submit)', () => {
		AssessmentUtil.getAssessmentMachineStateForModel.mockReturnValue(IN_ATTEMPT)
		AssessmentUtil.getCurrentAttemptStatus.mockReturnValue('hasQuestionsUnanswered')
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

	test('Test page (Ready to submit)', () => {
		AssessmentUtil.getAssessmentMachineStateForModel.mockReturnValue(IN_ATTEMPT)
		AssessmentUtil.getCurrentAttemptStatus.mockReturnValue('readyToSubmit')
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

	test('Test page (Submitting)', () => {
		AssessmentUtil.getAssessmentMachineStateForModel.mockReturnValue(ENDING_ATTEMPT)
		AssessmentUtil.getCurrentAttemptStatus.mockReturnValue('readyToSubmit')
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

	test.each`
		state                        | numAttemptsTaken | step
		${'inAttempt'}               | ${0}             | ${'test'}
		${'sendResponsesSuccessful'} | ${0}             | ${'test'}
		${'sendResponsesFailed'}     | ${0}             | ${'test'}
		${'endAttemptFailed'}        | ${0}             | ${'test'}
		${'sendingResponses'}        | ${0}             | ${'test'}
		${'endingAttempt'}           | ${0}             | ${'test'}
		${'startingAttempt'}         | ${0}             | ${'loading'}
		${'resumingAttempt'}         | ${0}             | ${'loading'}
		${'importingAttempt'}        | ${0}             | ${'loading'}
		${'init'}                    | ${0}             | ${'pre-test'}
		${'notInAttempt'}            | ${0}             | ${'pre-test'}
		${'promptingForImport'}      | ${0}             | ${'pre-test'}
		${'promptingForResume'}      | ${0}             | ${'pre-test'}
		${'startAttemptFailed'}      | ${0}             | ${'pre-test'}
		${'resumeAttemptFailed'}     | ${0}             | ${'pre-test'}
		${'importAttemptFailed'}     | ${0}             | ${'pre-test'}
		${'endAttemptSuccessful'}    | ${0}             | ${'pre-test'}
		${'fetchingAttemptHistory'}  | ${0}             | ${'pre-test'}
		${'fetchHistoryFailed'}      | ${0}             | ${'pre-test'}
		${'inAttempt'}               | ${1}             | ${'test'}
		${'sendResponsesSuccessful'} | ${1}             | ${'test'}
		${'sendResponsesFailed'}     | ${1}             | ${'test'}
		${'endAttemptFailed'}        | ${1}             | ${'test'}
		${'sendingResponses'}        | ${1}             | ${'test'}
		${'endingAttempt'}           | ${1}             | ${'test'}
		${'startingAttempt'}         | ${1}             | ${'loading'}
		${'resumingAttempt'}         | ${1}             | ${'loading'}
		${'importingAttempt'}        | ${1}             | ${'loading'}
		${'init'}                    | ${1}             | ${'post-test'}
		${'notInAttempt'}            | ${1}             | ${'post-test'}
		${'promptingForImport'}      | ${1}             | ${'post-test'}
		${'promptingForResume'}      | ${1}             | ${'post-test'}
		${'startAttemptFailed'}      | ${1}             | ${'post-test'}
		${'resumeAttemptFailed'}     | ${1}             | ${'post-test'}
		${'importAttemptFailed'}     | ${1}             | ${'post-test'}
		${'endAttemptSuccessful'}    | ${1}             | ${'post-test'}
		${'fetchingAttemptHistory'}  | ${1}             | ${'post-test'}
		${'fetchHistoryFailed'}      | ${1}             | ${'post-test'}
	`(
		'getStep state="$state", numAttemptsTaken="$numAttemptsTaken" = "$step"',
		({ state, numAttemptsTaken, step }) => {
			AssessmentUtil.getAssessmentMachineStateForModel.mockReturnValue(state)
			AssessmentUtil.getNumberOfAttemptsCompletedForModel.mockReturnValue(numAttemptsTaken)

			expect(Assessment.getStep({ moduleData: jest.fn() })).toBe(step)
		}
	)

	test('focusOnContent fires event', () => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		Assessment.focusOnContent()

		expect(Dispatcher.trigger).toHaveBeenCalledWith(
			'ObojoboDraft.Sections.Assessment:focusOnContent'
		)
	})

	test('onClickSubmit calls expected method', () => {
		const thisValue = {
			props: {
				model: jest.fn(),
				moduleData: {
					navState: {
						context: jest.fn()
					}
				}
			}
		}

		expect(AssessmentUtil.forceSendResponsesForCurrentAttempt).not.toHaveBeenCalled()
		Assessment.prototype.onClickSubmit.bind(thisValue)()
		expect(AssessmentUtil.forceSendResponsesForCurrentAttempt).toHaveBeenCalledWith(
			thisValue.props.model,
			thisValue.props.moduleData.navState.context
		)
	})

	test('endAttempt calls expected method', () => {
		const thisValue = {
			props: {
				model: jest.fn(),
				moduleData: {
					navState: {
						context: jest.fn(),
						visitId: jest.fn()
					}
				}
			}
		}

		expect(AssessmentUtil.endAttempt).not.toHaveBeenCalled()
		Assessment.prototype.endAttempt.bind(thisValue)()
		expect(AssessmentUtil.endAttempt).toHaveBeenCalledWith({
			model: thisValue.props.model,
			context: thisValue.props.moduleData.navState.context,
			visitId: thisValue.props.moduleData.navState.visitId
		})
	})

	test('componentWillUnmount resets the context', () => {
		expect(NavUtil.resetContext).not.toHaveBeenCalled()
		Assessment.prototype.componentWillUnmount()
		expect(NavUtil.resetContext).toHaveBeenCalled()
	})

	test('When the step changes the scroll and focus are changed', () => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
		expect(FocusUtil.focusOnNavTarget).not.toHaveBeenCalled()

		Assessment.prototype.componentDidUpdate.bind({
			state: {
				curStep: 'someStep'
			}
		})(null, {
			curStep: 'someStep'
		})

		expect(Dispatcher.trigger).not.toHaveBeenCalled()
		expect(FocusUtil.focusOnNavTarget).not.toHaveBeenCalled()

		Assessment.prototype.componentDidUpdate.bind({
			state: {
				curStep: 'newStep'
			}
		})(null, {
			curStep: 'someStep'
		})

		expect(Dispatcher.trigger).toHaveBeenCalledWith('viewer:scrollToTop')
		expect(FocusUtil.focusOnNavTarget).toHaveBeenCalled()
	})
})
