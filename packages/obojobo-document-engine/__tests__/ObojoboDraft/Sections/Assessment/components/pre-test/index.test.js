import React from 'react'
import renderer from 'react-test-renderer'

import PreTest from '../../../../../../ObojoboDraft/Sections/Assessment/components/pre-test/index'
import Dispatcher from '../../../../../../src/scripts/common/flux/dispatcher'
import { FOCUS_ON_ASSESSMENT_CONTENT } from '../../../../../../ObojoboDraft/Sections/Assessment/assessment-event-constants'

jest.mock('../../../../../../src/scripts/common/flux/dispatcher')

describe('PreTest', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('PreTest component', () => {
		const model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<PreTest model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Component listens to FOCUS_ON_ASSESSMENT_CONTENT events when mounted (and stops listening when unmounted)', () => {
		const model = { getComponentClass: jest.fn().mockReturnValueOnce('MockComponent') }
		const moduleData = { focusState: {} }

		expect(Dispatcher.on).not.toHaveBeenCalled()
		expect(Dispatcher.off).not.toHaveBeenCalled()

		const component = renderer.create(<PreTest model={model} moduleData={moduleData} />)

		const boundFocusOnContent = component.getInstance().boundFocusOnContent
		expect(Dispatcher.on).toHaveBeenCalledTimes(1)
		expect(Dispatcher.on).toHaveBeenCalledWith(FOCUS_ON_ASSESSMENT_CONTENT, boundFocusOnContent)
		expect(Dispatcher.off).not.toHaveBeenCalled()

		component.unmount()

		expect(Dispatcher.on).toHaveBeenCalledTimes(1)
		expect(Dispatcher.off).toHaveBeenCalledTimes(1)
		expect(Dispatcher.off).toHaveBeenCalledWith(FOCUS_ON_ASSESSMENT_CONTENT, boundFocusOnContent)
	})

	test('focusOnContent does nothing (and returns false) when no component class returned from model', () => {
		const model = { getComponentClass: jest.fn().mockReturnValueOnce('MockComponent') }
		const moduleData = { focusState: {} }

		const component = renderer.create(<PreTest model={model} moduleData={moduleData} />)

		expect(component.getInstance().focusOnContent()).toBe(false)
	})

	test('focusOnContent calls the component class focusOnContent method (and returns true)', () => {
		const mockComponent = () => <div />
		mockComponent.focusOnContent = jest.fn()
		const model = {
			getComponentClass: () => mockComponent
		}
		const moduleData = { focusState: {} }

		const component = renderer.create(<PreTest model={model} moduleData={moduleData} />)

		expect(component.getInstance().focusOnContent()).toBe(true)
		expect(mockComponent.focusOnContent).toHaveBeenCalledTimes(1)
	})
})
