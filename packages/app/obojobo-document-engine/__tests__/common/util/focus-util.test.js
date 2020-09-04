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
				fade: false,
				animateScroll: false,
				scroll: true,
				region: null
			}
		})
	})

	test('focusComponent will dispatch the correct event with different options', () => {
		FocusUtil.focusComponent('testId', {
			fade: true,
			scroll: false,
			animateScroll: true,
			region: 'mock-region'
		})

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				fade: true,
				animateScroll: true,
				scroll: false,
				region: 'mock-region'
			}
		})
	})

	test('focusOnNavTarget will dispatch the correct event with defaults', () => {
		FocusUtil.focusOnNavTarget()
		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:navTarget')
	})

	test('focusOnNavigation will dispatch the correct event', () => {
		FocusUtil.focusOnNavigation('testId')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:navigation')
	})

	test('clearFadeEffect will dispatch the correct event', () => {
		FocusUtil.clearFadeEffect('testId')
		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:clearFadeEffect')
	})

	test('getFocussedItem returns an object about the focussed item', () => {
		const mockState = {
			type: 'mock-type',
			target: 'mock-target',
			scroll: false,
			animateScroll: false,
			visualFocusTarget: 'mock-target',
			region: 'mock-region'
		}
		const initialMockState = { ...mockState }

		expect(FocusUtil.getFocussedItem(mockState)).toEqual({
			type: 'mock-type',
			target: 'mock-target',
			options: {
				animateScroll: false,
				fade: true,
				scroll: false,
				region: 'mock-region'
			}
		})
		expect(mockState).toEqual(initialMockState)
	})

	test('getFocussedItemAndClear returns an object about the focussed item (but also clears the state at the same time - except for visualFocusTarget)', () => {
		const mockState = {
			type: 'mock-type',
			target: 'mock-target',
			scroll: false,
			animateScroll: false,
			visualFocusTarget: 'mock-target',
			region: 'mock-region'
		}

		expect(FocusUtil.getFocussedItemAndClear(mockState)).toEqual({
			type: 'mock-type',
			target: 'mock-target',
			options: {
				animateScroll: false,
				fade: true,
				scroll: false,
				region: 'mock-region'
			}
		})
		expect(mockState).toEqual({
			type: null,
			target: null,
			scroll: true,
			animateScroll: false,
			region: null,
			visualFocusTarget: null
		})
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
