import { mount, shallow } from 'enzyme'

import Assessment from './viewer-component'
import AssessmentUtil from 'obojobo-document-engine/src/scripts/viewer/util/assessment-util'
import Dispatcher from 'obojobo-document-engine/src/scripts/common/flux/dispatcher'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import NavUtil from 'obojobo-document-engine/src/scripts/viewer/util/nav-util'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import Dialog from 'obojobo-document-engine/src/scripts/common/components/modal/dialog'
import shuffle from 'obojobo-document-engine/src/scripts/common/util/shuffle'
import React from 'react'
import renderer from 'react-test-renderer'

jest.mock('obojobo-document-engine/src/scripts/viewer/util/assessment-util')
jest.mock('./components/pre-test')
jest.mock('./components/test')
jest.mock('./components/post-test')
jest.mock('obojobo-document-engine/src/scripts/viewer/util/nav-util')
jest.mock('obojobo-document-engine/src/scripts/common/flux/dispatcher')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('obojobo-document-engine/src/scripts/common/components/modal/dialog')

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
	beforeAll(() => {
		shuffle.mockImlpementation( a => a)
	})

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Assessment component', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(tree).toMatchSnapshot()
	})

	test('Assessment component in pre-test stage', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue({
			current: null,
			attempts: []
		})

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(tree).toMatchSnapshot()
	})

	test('Assessment component in test stage', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue({ current: true })
		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(false)

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(AssessmentUtil.isCurrentAttemptComplete).toHaveBeenCalledWith(
			'mockAssessmentState',
			'mockQuestionState',
			model,
			'mockContext'
		)
		expect(tree).toMatchSnapshot()
	})

	test('Assessment component in post-test stage', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue({
			current: null,
			attempts: [{}]
		})

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(tree).toMatchSnapshot()
	})

	test('Assessment component in post-test stage with score actions', () => {
		const model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce({})
		}
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue({
			current: null,
			attempts: [{}]
		})

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(tree).toMatchSnapshot()
	})

	test('Dispatcher viewer:scrollToTop is called appropriately in componentDidUpdate', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {},
			navState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)
		const component = shallow(<Assessment model={model} moduleData={moduleData} />)
		const instance = component.instance()

		let prevState = { curStep: 'pre-test' }
		instance.componentDidUpdate(null, prevState)
		expect(Dispatcher.trigger).not.toHaveBeenCalledWith('viewer:scrollToTop')

		prevState = { curStep: 'test' }
		instance.componentDidUpdate(null, prevState)
		expect(Dispatcher.trigger).toHaveBeenCalledWith('viewer:scrollToTop')
	})

	test('compontent listens to events and sets assessment context when mounted', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)
		AssessmentUtil.getCurrentAttemptForModel.mockReturnValue({
			assessmentId: 'mockAssessmentId',
			attemptId: 'mockAttemptId'
		})

		// establish a baseline
		expect(NavUtil.setContext).not.toHaveBeenCalled()
		expect(Dispatcher.on).not.toHaveBeenCalled()

		// mount!
		mount(<Assessment model={model} moduleData={moduleData} />)

		// make sure we're currently listening
		expect(Dispatcher.on).toHaveBeenCalledWith('assessment:endAttempt', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('assessment:attemptEnded', expect.any(Function))
		expect(Dispatcher.off).not.toHaveBeenCalled()

		// make sure setContext is called to notify we're in assessment!
		expect(NavUtil.setContext).toHaveBeenLastCalledWith('assessment:mockAssessmentId:mockAttemptId')
	})

	test('compontent listens to events and sets assessment context when RE-mounted', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)
		AssessmentUtil.getCurrentAttemptForModel.mockReturnValue({
			assessmentId: 'mockAssessmentId',
			attemptId: 'mockAttemptId'
		})

		// establish a baseline
		expect(NavUtil.setContext).not.toHaveBeenCalled()
		expect(Dispatcher.on).not.toHaveBeenCalled()

		// mount!
		const component = mount(<Assessment model={model} moduleData={moduleData} />)

		// unmount
		component.unmount()

		// clear all the mocks
		Dispatcher.on.mockClear()
		Dispatcher.off.mockClear()
		NavUtil.setContext.mockClear()

		// RE-mount
		component.mount()

		// make sure we're currently listening again
		expect(Dispatcher.on).toHaveBeenCalledWith('assessment:endAttempt', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('assessment:attemptEnded', expect.any(Function))
		expect(Dispatcher.off).not.toHaveBeenCalled()

		// make sure setContext is called to notify we're in assessment!
		expect(NavUtil.setContext).toHaveBeenLastCalledWith('assessment:mockAssessmentId:mockAttemptId')
	})

	test('unmounting calls dispatcher.off and resets NavUtil context', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = mount(<Assessment model={model} moduleData={moduleData} />)
		component.unmount()

		expect(NavUtil.resetContext).toHaveBeenCalled()
		expect(Dispatcher.off).toHaveBeenCalledWith('assessment:endAttempt', expect.any(Function))
		expect(Dispatcher.off).toHaveBeenCalledWith('assessment:attemptEnded', expect.any(Function))
	})

	test('compontent listens to events when mounted', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)
		AssessmentUtil.getCurrentAttemptForModel.mockReturnValue({
			assessmentId: 'mockAssessmentId',
			attemptId: 'mockAttemptId'
		})

		const component = mount(<Assessment model={model} moduleData={moduleData} />)

		// make sure we're currently listening!
		expect(Dispatcher.on).toHaveBeenCalledWith('assessment:endAttempt', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('assessment:attemptEnded', expect.any(Function))
		expect(Dispatcher.off).not.toHaveBeenCalled()

		// make sure setContext is called to notify we're in assessment!
		expect(NavUtil.setContext).toHaveBeenCalledTimes(1)
		expect(NavUtil.setContext).toHaveBeenCalledWith('assessment:mockAssessmentId:mockAttemptId')

		// unmount to verify
		component.unmount()
	})

	test('onEndAttempt alters the state', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		expect(component.instance().state.isFetching).toEqual(false)
		component.instance().onEndAttempt()
		expect(component.instance().state.isFetching).toEqual(true)
	})

	test('onAttemptEnded alters the state', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		expect(component.instance().state.isFetching).toEqual(false)
		component.instance().onEndAttempt()
		expect(component.instance().state.isFetching).toEqual(true)
		component.instance().onAttemptEnded()
		expect(component.instance().state.isFetching).toEqual(false)
	})

	test('isAttemptComplete calls AssessmentUtil', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce('mockComplete')

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		const complete = component.instance().isAttemptComplete()

		expect(AssessmentUtil.isCurrentAttemptComplete).toHaveBeenCalledWith(
			'mockAssessmentState',
			'mockQuestionState',
			model,
			'mockContext'
		)
		expect(complete).toEqual('mockComplete')
	})

	test('isAssessmentComplete calls AssessmentUtil', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		AssessmentUtil.hasAttemptsRemaining.mockReturnValueOnce(false)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		const complete = component.instance().isAssessmentComplete()

		expect(AssessmentUtil.hasAttemptsRemaining).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(complete).toEqual(true)
	})

	test('onClickSubmit cant be clicked multiple times', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(false)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		// set button to have already been clicked
		component.instance().state.isFetching = true

		component.instance().onClickSubmit()

		expect(AssessmentUtil.endAttempt).not.toHaveBeenCalled()
		expect(ModalUtil.show).not.toHaveBeenCalled()
	})

	test('onClickSubmit displays a Modal if attempt is not complete', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)
		// Attempt is not complete
		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(false)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		component.instance().onClickSubmit()

		expect(AssessmentUtil.endAttempt).not.toHaveBeenCalled()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('onClickSubmit displays the last attempt Modal for the last submission', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// Last attempt
		AssessmentUtil.getAttemptsRemaining.mockReturnValueOnce(1)
		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)
		// Attempt is completed
		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(true)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		component.instance().onClickSubmit()

		expect(ModalUtil.show).toHaveBeenCalledWith(
			<Dialog
				width="32rem"
				title="This is your last attempt"
				buttons={[
					{
						value: 'Cancel',
						altAction: true,
						default: true,
						onClick: ModalUtil.hide
					},
					{
						value: 'OK - Submit Last Attempt',
						onClick: component.instance().endAttempt
					}
				]}
			>
				<p>{"You won't be able to submit another attempt after this one."}</p>
			</Dialog>
		)
	})

	test('onClickSubmit() displays the confirm modal when submitting an assessment', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// 3 attempts remain
		AssessmentUtil.getAttemptsRemaining.mockReturnValueOnce(3)
		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)
		// Attempt is completed
		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(true)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		component.instance().onClickSubmit()

		expect(ModalUtil.show).toHaveBeenCalledWith(
			<Dialog
				width="32rem"
				title="Just to confirm..."
				buttons={[
					{
						value: 'Cancel',
						altAction: true,
						default: true,
						onClick: ModalUtil.hide
					},
					{
						value: 'OK - Submit',
						onClick: component.instance().endAttempt
					}
				]}
			>
				<p>Are you ready to submit?</p>
			</Dialog>
		)
	})

	test('endAttempt calls AssessmentUtil', () => {
		const model = OboModel.create(assessmentJSON)
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)
		// Attempt is complete
		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(true)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		component.instance().endAttempt()

		expect(AssessmentUtil.endAttempt).toHaveBeenCalled()
	})

	test('exitAssessment calls NavUtil and goes to location', () => {
		const model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce({ action: {} })
		}
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		component.instance().exitAssessment()

		expect(NavUtil.goto).toHaveBeenCalled()
	})

	test('exitAssessment calls NavUtil and goes to next', () => {
		const model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce({
				action: { value: '_next' }
			})
		}
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		component.instance().exitAssessment()

		expect(NavUtil.goNext).toHaveBeenCalled()
	})

	test('exitAssessment calls NavUtil and goes to next', () => {
		const model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce({
				action: { value: '_prev' }
			})
		}
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		component.instance().exitAssessment()

		expect(NavUtil.goPrev).toHaveBeenCalled()
	})

	test('getScoreAction calls AssessmentUtil and returns default', () => {
		const model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce(null)
		}
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		const action = component.instance().getScoreAction()

		expect(AssessmentUtil.getAssessmentScoreForModel).toHaveBeenCalledWith(
			'mockAssessmentState',
			model
		)
		expect(action).toEqual({
			from: 0,
			to: 100,
			message: '',
			action: {
				type: 'unlock',
				value: '_next'
			}
		})
	})

	test('getScoreAction calls AssessmentUtil and returns custom', () => {
		const model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce('mockAction')
		}
		const moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValue(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		const action = component.instance().getScoreAction()

		expect(AssessmentUtil.getAssessmentScoreForModel).toHaveBeenCalledWith(
			'mockAssessmentState',
			model
		)
		expect(action).toEqual('mockAction')
	})
	test('focusOnContent dispatches event', () => {
		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		Assessment.focusOnContent()

		expect(Dispatcher.trigger).toHaveBeenCalledWith(
			'ObojoboDraft.Sections.Assessment:focusOnContent'
		)
	})
})
