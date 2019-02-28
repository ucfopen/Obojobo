import FocusUtil from '../../../src/scripts/viewer/util/focus-util'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import OboModel from '../../../src/scripts/common/models/obo-model'

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})

describe('FocusUtil', () => {
	test('focusComponent will dispatch the correct event with defaults', () => {
		FocusUtil.focusComponent('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				isVisuallyFocused: true
			}
		})
	})

	test('focusComponent will dispatch the correct event', () => {
		FocusUtil.focusComponent('testId', true)

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				isVisuallyFocused: true
			}
		})

		FocusUtil.focusComponent('testId', false)

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				isVisuallyFocused: false
			}
		})
	})

	test('focusOnContent will dispatch the correct event with defaults', () => {
		FocusUtil.focusOnContent('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				isVisuallyFocused: true
			}
		})
	})

	test('focusOnContent will dispatch the correct event', () => {
		FocusUtil.focusOnContent('testId', true)

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				isVisuallyFocused: true
			}
		})

		FocusUtil.focusOnContent('testId', false)

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				isVisuallyFocused: false
			}
		})
	})

	test('focusOnNavTargetContent will dispatch the correct event', () => {
		FocusUtil.focusOnNavTargetContent('testId')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:navTargetContent')
	})

	test('focusOnNavigation will dispatch the correct event', () => {
		FocusUtil.focusOnNavigation('testId')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:navigation')
	})

	test('clearVisualFocus will dispatch the correct event', () => {
		FocusUtil.clearVisualFocus('testId')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:clearVisualFocus')
	})

	test('getFocussedItem returns an object about the focussed item', () => {
		const mockState = { type: 'mock-type', target: 'mock-target' }
		expect(FocusUtil.getFocussedItem(mockState)).toEqual({
			type: 'mock-type',
			target: 'mock-target'
		})
		expect(mockState).toEqual({ type: 'mock-type', target: 'mock-target' })
	})

	test('getFocussedItemAndClear returns an object about the focussed item (but also clears the state at the same time)', () => {
		const mockState = { type: 'mock-type', target: 'mock-target' }
		expect(FocusUtil.getFocussedItemAndClear(mockState)).toEqual({
			type: 'mock-type',
			target: 'mock-target'
		})
		expect(mockState).toEqual({ type: null, target: null })
	})

	test('getVisuallyFocussedModel returns on OboModel of the component with visual focus', () => {
		const mockOboModel = {}
		OboModel.models = { 'mock-component-id': mockOboModel }

		const mockState = {
			visualFocusTarget: 'mock-component-id'
		}

		expect(FocusUtil.getVisuallyFocussedModel(mockState)).toBe(mockOboModel)
	})

	test('getVisuallyFocussedModel returns null if model with visual focus cannot be found', () => {
		OboModel.models = {}

		const mockState = { visualFocusTarget: 'mock-component-id' }

		expect(FocusUtil.getVisuallyFocussedModel(mockState)).toBe(null)
	})

	test('getVisuallyFocussedModel returns null if no visualFocusTarget', () => {
		const mockOboModel = {}
		OboModel.models = { 'mock-component-id': mockOboModel }

		const mockState = { visualFocusTarget: null }

		expect(FocusUtil.getVisuallyFocussedModel(mockState)).toBe(null)
	})
})
