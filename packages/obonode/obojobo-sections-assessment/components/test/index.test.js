import Common from 'obojobo-document-engine/src/scripts/common'
import Dispatcher from 'obojobo-document-engine/src/scripts/common/flux/dispatcher'
import { FOCUS_ON_ASSESSMENT_CONTENT } from '../../assessment-event-constants'
import React from 'react'
import Test from './index'
import renderer from 'react-test-renderer'

const { Button } = Common.components

jest.mock('obojobo-document-engine/src/scripts/common/flux/dispatcher')
jest.mock('obojobo-document-engine/src/scripts/common/page/focus')

describe('Test', () => {
	let model
	let moduleData

	beforeEach(() => {
		jest.resetAllMocks()

		model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent'),
			parent: {
				attributes: {
					id: 'mockAssessmentId',
					content: {}
				}
			}
		}
		moduleData = {
			focusState: {}
		}
	})

	test('Test component', () => {
		const component = renderer.create(<Test model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		// check the button's labels to make sure they're correct
		const buttonElement = component.root.findByType(Button)
		expect(buttonElement.props.value).toBe('Submit')
		expect(buttonElement.props.ariaLabel).toBe('Submit (Not all questions have been saved)')

		// by default the value checked for 'all questions answered' should be false, so a warning
		//  should appear saying not all questions are complete
		const incompleteNoticeElement = component.root.findAllByProps({
			className: 'incomplete-notice'
		})
		expect(incompleteNoticeElement.length).toBe(1)

		expect(tree).toMatchSnapshot()
	})

	test('Test component (isAttemptSubmitting)', () => {
		const reusableComponent = (
			<Test
				model={model}
				moduleData={moduleData}
				isAttemptSubmitting={true}
				onSubmitClick={mockOnSubmitClick}
				onNextClick={mockOnNextClick}
			/>
		)

		const mockOnSubmitClick = jest.fn()
		const mockOnNextClick = jest.fn()
		const component = renderer.create(reusableComponent)
		const tree = component.toJSON()

		// check the button's labels to make sure they're correct
		const buttonElement = component.root.findByType(Button)
		expect(buttonElement.props.value).toBe('Loading ...')
		expect(buttonElement.props.ariaLabel).toBe('Loading ...')

		// by default the value checked for 'all questions answered' should be false, so a warning
		//  should appear saying not all questions are complete
		const incompleteNoticeElement = component.root.findAllByProps({
			className: 'incomplete-notice'
		})
		expect(incompleteNoticeElement.length).toBe(0)

		renderer.act(() => {
			buttonElement.props.onClick()
			component.update(reusableComponent)
		})

		// make sure neither of the possible click callbacks are called when clicking
		expect(mockOnSubmitClick).not.toHaveBeenCalled()
		expect(mockOnNextClick).not.toHaveBeenCalled()

		expect(tree).toMatchSnapshot()
	})

	test('Test component (isAttemptReadyToSubmit)', () => {
		const component = renderer.create(
			<Test model={model} moduleData={moduleData} isAttemptReadyToSubmit={true} />
		)
		const tree = component.toJSON()

		// check the button's labels to make sure they're correct
		const buttonElement = component.root.findByType(Button)
		expect(buttonElement.props.value).toBe('Submit')
		expect(buttonElement.props.ariaLabel).toBe('Submit')

		// by default the value checked for 'all questions answered' should be false, so a warning
		//  should appear saying not all questions are complete
		const incompleteNoticeElement = component.root.findAllByProps({
			className: 'incomplete-notice'
		})
		expect(incompleteNoticeElement.length).toBe(0)

		expect(tree).toMatchSnapshot()
	})

	// dev/29 - not sure what this test is meant to do, nothing in the component even checks for this
	// assuming it's to make sure it appears the same as in a 'default' case?
	test('Test component with completeAttempt', () => {
		const component = renderer.create(
			<Test model={model} moduleData={moduleData} isAttemptComplete={true} />
		)
		const tree = component.toJSON()

		// check the button's labels to make sure they're correct
		const buttonElement = component.root.findByType(Button)
		expect(buttonElement.props.value).toBe('Submit')
		expect(buttonElement.props.ariaLabel).toBe('Submit (Not all questions have been saved)')

		// by default the value checked for 'all questions answered' should be false, so a warning
		//  should appear saying not all questions are complete
		const incompleteNoticeElement = component.root.findAllByProps({
			className: 'incomplete-notice'
		})
		expect(incompleteNoticeElement.length).toBe(1)

		expect(tree).toMatchSnapshot()
	})

	// dev/29 - not sure what this test is meant to do, nothing in the component even checks for this
	// assuming it's to make sure it appears the same as in a 'default' case?
	test('Test component fetching score', () => {
		const component = renderer.create(
			<Test model={model} moduleData={moduleData} isAttemptComplete={true} isFetching={true} />
		)
		const tree = component.toJSON()

		// check the button's labels to make sure they're correct
		const buttonElement = component.root.findByType(Button)
		expect(buttonElement.props.value).toBe('Submit')
		expect(buttonElement.props.ariaLabel).toBe('Submit (Not all questions have been saved)')

		// by default the value checked for 'all questions answered' should be false, so a warning
		//  should appear saying not all questions are complete
		const incompleteNoticeElement = component.root.findAllByProps({
			className: 'incomplete-notice'
		})
		expect(incompleteNoticeElement.length).toBe(1)

		expect(tree).toMatchSnapshot()
	})

	test('Component listens to FOCUS_ON_ASSESSMENT_CONTENT events when mounted (and stops listening when unmounted)', () => {
		expect(Dispatcher.on).not.toHaveBeenCalled()
		expect(Dispatcher.off).not.toHaveBeenCalled()

		const component = renderer.create(<Test model={model} moduleData={moduleData} />)

		const boundFocusOnContent = component.getInstance().boundFocusOnContent
		expect(Dispatcher.on).toHaveBeenCalledTimes(1)
		expect(Dispatcher.on).toHaveBeenCalledWith(FOCUS_ON_ASSESSMENT_CONTENT, boundFocusOnContent)
		expect(Dispatcher.off).not.toHaveBeenCalled()

		component.unmount()

		expect(Dispatcher.on).toHaveBeenCalledTimes(1)
		expect(Dispatcher.off).toHaveBeenCalledTimes(1)
		expect(Dispatcher.off).toHaveBeenCalledWith(FOCUS_ON_ASSESSMENT_CONTENT, boundFocusOnContent)
	})

	test('focusOnContent does nothing (and returns false) when no child model present', () => {
		model.children = { at: () => null }

		const component = renderer.create(<Test model={model} moduleData={moduleData} />)

		expect(component.getInstance().focusOnContent()).toBe(false)
	})

	test('focusOnContent does nothing (and returns false) when no child component class exists', () => {
		model.children = {
			at: () => ({
				getComponentClass: () => false
			})
		}

		const component = renderer.create(<Test model={model} moduleData={moduleData} />)

		expect(component.getInstance().focusOnContent()).toBe(false)
	})

	test('focusOnContent calls the first child focusOnContent method (and returns true) when child model(s) are present', () => {
		const mockFocusOnContent = jest.fn()
		const mockFirstChild = {
			getComponentClass: () => ({
				focusOnContent: mockFocusOnContent
			})
		}
		model.children = {
			at: () => mockFirstChild
		}

		const component = renderer.create(<Test model={model} moduleData={moduleData} />)

		expect(component.getInstance().focusOnContent()).toBe(true)
		expect(mockFocusOnContent).toHaveBeenCalledWith(mockFirstChild)
	})

	test('Test component does not render Next button with questionIndex but no pace setting on assessment model', () => {
		const component = renderer.create(
			<Test model={model} moduleData={moduleData} questionIndex={1} />
		)

		// check the button's labels to make sure they're correct
		const buttonElement = component.root.findByType(Button)
		expect(buttonElement.props.value).toBe('Submit')
		expect(buttonElement.props.ariaLabel).toBe('Submit (Not all questions have been saved)')

		// by default the value checked for 'all questions answered' should be false, so a warning
		//  should appear saying not all questions are complete
		const incompleteNoticeElement = component.root.findAllByProps({
			className: 'incomplete-notice'
		})
		expect(incompleteNoticeElement.length).toBe(1)
	})

	test('Test component does not render Next button with questionIndex and pace setting on assessment model exists but is not "single"', () => {
		model.parent.attributes.content.pace = 'all'
		const component = renderer.create(
			<Test model={model} moduleData={moduleData} questionIndex={1} />
		)

		// check the button's labels to make sure they're correct
		const buttonElement = component.root.findByType(Button)
		expect(buttonElement.props.value).toBe('Submit')
		expect(buttonElement.props.ariaLabel).toBe('Submit (Not all questions have been saved)')

		// by default the value checked for 'all questions answered' should be false, so a warning
		//  should appear saying not all questions are complete
		const incompleteNoticeElement = component.root.findAllByProps({
			className: 'incomplete-notice'
		})
		expect(incompleteNoticeElement.length).toBe(1)
	})

	test('Test component renders Next button with questionIndex and pace setting on assessment model is "single"', () => {
		model.children = { models: [] }
		model.parent.attributes.content.pace = 'single'
		moduleData.assessmentState = {
			assessments: {
				// this has to match the assessment ID in model.parent.attributes
				// consider setting it on the next line and using a variable for both?
				mockAssessmentId: {
					current: {
						state: {
							questionIndex: 0
						}
					}
				}
			}
		}
		const component = renderer.create(
			<Test model={model} moduleData={moduleData} questionIndex={1} />
		)

		// check the button's labels to make sure they're correct
		const buttonElement = component.root.findByType(Button)
		expect(buttonElement.props.value).toBe('Next')
		expect(buttonElement.props.ariaLabel).toBe('Next Question')

		// when the 'Next' button is displayed, the incomplete notice should not be displayed
		const incompleteNoticeElement = component.root.findAllByProps({
			className: 'incomplete-notice'
		})
		expect(incompleteNoticeElement.length).toBe(0)
	})
})
