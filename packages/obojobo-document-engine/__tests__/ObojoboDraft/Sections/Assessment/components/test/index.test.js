import React from 'react'
import renderer from 'react-test-renderer'

import Test from '../../../../../../ObojoboDraft/Sections/Assessment/components/test/index'
import Dispatcher from '../../../../../../src/scripts/common/flux/dispatcher'
import focus from '../../../../../../src/scripts/common/page/focus'
import { FOCUS_ON_ASSESSMENT_CONTENT } from '../../../../../../ObojoboDraft/Sections/Assessment/assessment-event-constants'

jest.mock('../../../../../../src/scripts/common/flux/dispatcher')
jest.mock('../../../../../../src/scripts/common/page/focus')

describe('Test', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Test component', () => {
		const model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<Test model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Test component with completeAttempt', () => {
		const model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(
			<Test model={model} moduleData={moduleData} isAttemptComplete={true} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Test component fetching score', () => {
		const model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(
			<Test model={model} moduleData={moduleData} isAttemptComplete={true} isFetching={true} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Component listens to FOCUS_ON_ASSESSMENT_CONTENT events when mounted (and stops listening when unmounted)', () => {
		const model = { getComponentClass: jest.fn().mockReturnValueOnce('MockComponent') }
		const moduleData = { focusState: {} }

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
		const model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent'),
			children: { at: () => null }
		}
		const moduleData = { focusState: {} }

		const component = renderer.create(<Test model={model} moduleData={moduleData} />)

		expect(component.getInstance().focusOnContent()).toBe(false)
	})

	test('focusOnContent focuses on the dom element of the first child (and returns true) when no child model present', () => {
		const mockDomEl = jest.fn()
		const model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent'),
			children: {
				at: () => ({
					getDomEl: () => mockDomEl
				})
			}
		}
		const moduleData = { focusState: {} }

		const component = renderer.create(<Test model={model} moduleData={moduleData} />)

		expect(component.getInstance().focusOnContent()).toBe(true)
		expect(focus).toHaveBeenCalledWith(mockDomEl)
	})
})
