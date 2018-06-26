import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount, unmount } from 'enzyme'

jest.mock('../../../../src/scripts/viewer/util/assessment-util')
jest.mock('../../../../ObojoboDraft/Sections/Assessment/components/pre-test')
jest.mock('../../../../ObojoboDraft/Sections/Assessment/components/test')
jest.mock('../../../../ObojoboDraft/Sections/Assessment/components/post-test')
jest.mock('../../../../src/scripts/viewer/util/nav-util')
jest.mock('../../../../src/scripts/common/flux/dispatcher')
jest.mock('../../../../src/scripts/common/util/modal-util')

import Assessment from '../../../../ObojoboDraft/Sections/Assessment/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import AssessmentUtil from '../../../../src/scripts/viewer/util/assessment-util'
import NavUtil from '../../../../src/scripts/viewer/util/nav-util'
import ModalUtil from '../../../../src/scripts/common/util/modal-util'
import Dispatcher from '../../../../src/scripts/common/flux/dispatcher'

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
		_.shuffle = a => a
	})

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Assessment component', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(null)
		AssessmentUtil.getLTIStateForModel.mockReturnValueOnce(null)
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(AssessmentUtil.getAssessmentScoreForModel).toHaveBeenCalledWith(
			'mockAssessmentState',
			model
		)
		expect(AssessmentUtil.getLTIStateForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(tree).toMatchSnapshot()
	})

	test('Assessment component in pre-test stage', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(null)
		AssessmentUtil.getLTIStateForModel.mockReturnValueOnce(null)
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			current: null,
			attempts: []
		})

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(AssessmentUtil.getAssessmentScoreForModel).toHaveBeenCalledWith(
			'mockAssessmentState',
			model
		)
		expect(AssessmentUtil.getLTIStateForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(tree).toMatchSnapshot()
	})

	test('Assessment component in test stage', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(null)
		AssessmentUtil.getLTIStateForModel.mockReturnValueOnce(null)
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({ current: true })
		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(false)

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(AssessmentUtil.getAssessmentScoreForModel).toHaveBeenCalledWith(
			'mockAssessmentState',
			model
		)
		expect(AssessmentUtil.getLTIStateForModel).toHaveBeenCalledWith('mockAssessmentState', model)
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
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(null)
		AssessmentUtil.getLTIStateForModel.mockReturnValueOnce(null)
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			current: null,
			attempts: [{}]
		})

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(AssessmentUtil.getAssessmentScoreForModel).toHaveBeenCalledWith(
			'mockAssessmentState',
			model
		)
		expect(AssessmentUtil.getLTIStateForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(tree).toMatchSnapshot()
	})

	test('Assessment component in post-test stage with score actions', () => {
		let model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce({})
		}
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentScoreForModel.mockReturnValueOnce(null)
		AssessmentUtil.getLTIStateForModel.mockReturnValueOnce(null)
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			current: null,
			attempts: [{}]
		})

		const component = renderer.create(<Assessment model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(AssessmentUtil.getAssessmentScoreForModel).toHaveBeenCalledWith(
			'mockAssessmentState',
			model
		)
		expect(AssessmentUtil.getLTIStateForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(tree).toMatchSnapshot()
	})

	test('getCurrentStep returns pre-test with no assessment', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		// clear out any render calls
		jest.resetAllMocks()
		// mock for getCurrentStep call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		let stage = component.instance().getCurrentStep()

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(stage).toEqual('pre-test')
	})

	test('getCurrentStep returns test when assignment is current', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		// clear out any render calls
		jest.resetAllMocks()
		// mock for getCurrentStep call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({ current: true })

		let stage = component.instance().getCurrentStep()

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(stage).toEqual('test')
	})

	test('getCurrentStep returns post-test when assignment has attempts', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		// clear out any render calls
		jest.resetAllMocks()
		// mock for getCurrentStep call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			current: null,
			attempts: [{}]
		})

		let stage = component.instance().getCurrentStep()

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(stage).toEqual('post-test')
	})

	test('getCurrentStep returns pre-test when assignment has no attempts', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		// clear out any render calls
		jest.resetAllMocks()
		// mock for getCurrentStep call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce({
			current: null,
			attempts: []
		})

		let stage = component.instance().getCurrentStep()

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(stage).toEqual('pre-test')
	})

	test('componentWillRecieveProps changes the state', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(
			<Assessment model={model} moduleData={moduleData} mode="assessment" />
		)

		expect(component.instance().state.step).toEqual(null)

		// clear out any render calls
		jest.resetAllMocks()
		// mock for getCurrentStep call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		// mock for second render call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		// calls componentWillRecieveProps()
		component.setProps({ model: model, moduleData: moduleData })

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(component.instance().state.step).toEqual('pre-test')
	})

	test('componentWillRecieveProps remains on the same state', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(
			<Assessment model={model} moduleData={moduleData} mode="assessment" />
		)

		expect(component.instance().state.step).toEqual(null)

		// clear out any render calls
		jest.resetAllMocks()
		// mock for getCurrentStep call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		// mock for second render call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		// calls componentWillRecieveProps()
		component.setProps({ model: model, moduleData: moduleData })

		expect(component.instance().state.step).toEqual('pre-test')

		// clear out any render calls
		jest.resetAllMocks()
		// mock for getCurrentStep call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		// mock for second render call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		// calls componentWillRecieveProps()
		component.setProps({ model: model, moduleData: moduleData })

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(component.instance().state.step).toEqual('pre-test')
	})

	test('componentWillMount calls dispatcher', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = mount(<Assessment model={model} moduleData={moduleData} />)

		expect(Dispatcher.on).toHaveBeenCalledWith('assessment:endAttempt', expect.any(Function))
		expect(Dispatcher.on).toHaveBeenCalledWith('assessment:attemptEnded', expect.any(Function))
	})

	test('componentWillUnmount calls dispatcher and NavUtil', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = mount(<Assessment model={model} moduleData={moduleData} />)
		component.unmount()

		expect(NavUtil.setContext).toHaveBeenCalledWith('practice')
		expect(Dispatcher.off).toHaveBeenCalledWith('assessment:endAttempt', expect.any(Function))
		expect(Dispatcher.off).toHaveBeenCalledWith('assessment:attemptEnded', expect.any(Function))
	})

	test('componentWillRecieveProps changes the state', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(
			<Assessment model={model} moduleData={moduleData} mode="assessment" />
		)

		expect(component.instance().state.step).toEqual(null)

		// clear out any render calls
		jest.resetAllMocks()
		// mock for getCurrentStep call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		// mock for second render call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		// calls componentDidUpdate()
		component.setProps({ model: model, moduleData: moduleData })

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(component.instance().state.step).toEqual('pre-test')
	})

	test('componentWillRecieveProps remains on the same state', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(
			<Assessment model={model} moduleData={moduleData} mode="assessment" />
		)

		expect(component.instance().state.step).toEqual(null)

		// clear out any render calls
		jest.resetAllMocks()
		// mock for getCurrentStep call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		// mock for second render call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		// calls componentDidUpdate()
		component.setProps({ model: model, moduleData: moduleData })

		expect(component.instance().state.step).toEqual('pre-test')

		// clear out any render calls
		jest.resetAllMocks()
		// mock for getCurrentStep call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		// mock for second render call
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		// calls componentDidUpdate()
		component.setProps({ model: model, moduleData: moduleData })

		expect(AssessmentUtil.getAssessmentForModel).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(component.instance().state.step).toEqual('pre-test')
	})

	test('onEndAttempt alters the state', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		expect(component.instance().state.isFetching).toEqual(false)
		component.instance().onEndAttempt()
		expect(component.instance().state.isFetching).toEqual(true)
	})

	test('onAttemptEnded alters the state', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		expect(component.instance().state.isFetching).toEqual(false)
		component.instance().onEndAttempt()
		expect(component.instance().state.isFetching).toEqual(true)
		component.instance().onAttemptEnded()
		expect(component.instance().state.isFetching).toEqual(false)
	})

	test('isAttemptComplete calls AssessmentUtil', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce('mockComplete')

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		let complete = component.instance().isAttemptComplete()

		expect(AssessmentUtil.isCurrentAttemptComplete).toHaveBeenCalledWith(
			'mockAssessmentState',
			'mockQuestionState',
			model,
			'mockContext'
		)
		expect(complete).toEqual('mockComplete')
	})

	test('isAssessmentComplete calls AssessmentUtil', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		AssessmentUtil.hasAttemptsRemaining.mockReturnValueOnce(false)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		let complete = component.instance().isAssessmentComplete()

		expect(AssessmentUtil.hasAttemptsRemaining).toHaveBeenCalledWith('mockAssessmentState', model)
		expect(complete).toEqual(true)
	})

	test('onClickSubmit cant be clicked multiple times', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(false)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		// set button to have already been clicked
		component.instance().state.isFetching = true

		let complete = component.instance().onClickSubmit()

		expect(AssessmentUtil.endAttempt).not.toHaveBeenCalled()
		expect(ModalUtil.show).not.toHaveBeenCalled()
	})

	test('onClickSubmit displays a Modal if attempt is not complete', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		// Attempt is not complete
		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(false)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		let complete = component.instance().onClickSubmit()

		expect(AssessmentUtil.endAttempt).not.toHaveBeenCalled()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('onClickSubmit calls endAttempt', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		// Attempt is complete
		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(true)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		let complete = component.instance().onClickSubmit()

		expect(AssessmentUtil.endAttempt).toHaveBeenCalled()
		expect(ModalUtil.show).not.toHaveBeenCalled()
	})

	test('endAttempt calls AssessmentUtil', () => {
		let model = OboModel.create(assessmentJSON)
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)
		// Attempt is complete
		AssessmentUtil.isCurrentAttemptComplete.mockReturnValueOnce(true)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		let complete = component.instance().endAttempt()

		expect(AssessmentUtil.endAttempt).toHaveBeenCalled()
	})

	test('exitAssessment calls NavUtil and goes to location', () => {
		let model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce({ action: {} })
		}
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		component.instance().exitAssessment()

		expect(NavUtil.goto).toHaveBeenCalled()
	})

	test('exitAssessment calls NavUtil and goes to next', () => {
		let model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce({
				action: { value: '_next' }
			})
		}
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		component.instance().exitAssessment()

		expect(NavUtil.goNext).toHaveBeenCalled()
	})

	test('exitAssessment calls NavUtil and goes to next', () => {
		let model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce({
				action: { value: '_prev' }
			})
		}
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		component.instance().exitAssessment()

		expect(NavUtil.goPrev).toHaveBeenCalled()
	})

	test('getScoreAction calls AssessmentUtil and returns default', () => {
		let model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce(null)
		}
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		let action = component.instance().getScoreAction()

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
		let model = OboModel.create(assessmentJSON)
		model.modelState.scoreActions = {
			getActionForScore: jest.fn().mockReturnValueOnce('mockAction')
		}
		let moduleData = {
			assessmentState: 'mockAssessmentState',
			questionState: 'mockQuestionState',
			navState: {
				context: 'mockContext'
			},
			focusState: {}
		}

		// mock for render
		AssessmentUtil.getAssessmentForModel.mockReturnValueOnce(null)

		const component = shallow(<Assessment model={model} moduleData={moduleData} />)

		let action = component.instance().getScoreAction()

		expect(AssessmentUtil.getAssessmentScoreForModel).toHaveBeenCalledWith(
			'mockAssessmentState',
			model
		)
		expect(action).toEqual('mockAction')
	})
})
