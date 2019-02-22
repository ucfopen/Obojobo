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
				animateScroll: false
			}
		})
	})

	test('focusComponent will dispatch the correct event with different options', () => {
		FocusUtil.focusComponent('testId', { fade: true })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				fade: true,
				animateScroll: false
			}
		})

		FocusUtil.focusComponent('testId', { animateScroll: true })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				fade: false,
				animateScroll: true
			}
		})

		FocusUtil.focusComponent('testId', { fade: true, animateScroll: true })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				fade: true,
				animateScroll: true
			}
		})
	})

	test('focusOnNavTarget will dispatch the correct event with defaults', () => {
		FocusUtil.focusOnNavTarget('testId')

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				fade: false,
				animateScroll: false
			}
		})
	})

	test('focusOnNavTarget will dispatch the correct event with different options', () => {
		FocusUtil.focusOnNavTarget('testId', { fade: true })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				fade: true,
				animateScroll: false
			}
		})

		FocusUtil.focusOnNavTarget('testId', { animateScroll: true })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				fade: false,
				animateScroll: true
			}
		})

		FocusUtil.focusOnNavTarget('testId', { fade: true, animateScroll: true })

		expect(Dispatcher.trigger).toHaveBeenCalledWith('focus:component', {
			value: {
				id: 'testId',
				fade: true,
				animateScroll: true
			}
		})
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
			animateScroll: false,
			visualFocusTarget: 'mock-target'
		}
		expect(FocusUtil.getFocussedItem(mockState)).toEqual({
			type: 'mock-type',
			target: 'mock-target',
			options: {
				animateScroll: false,
				fade: true
			}
		})
		expect(mockState).toEqual({
			type: 'mock-type',
			target: 'mock-target',
			animateScroll: false,
			visualFocusTarget: 'mock-target'
		})
	})

	test('getFocussedItemAndClear returns an object about the focussed item (but also clears the state at the same time - except for visualFocusTarget)', () => {
		const mockState = {
			type: 'mock-type',
			target: 'mock-target',
			animateScroll: false,
			visualFocusTarget: 'some-target'
		}
		expect(FocusUtil.getFocussedItemAndClear(mockState)).toEqual({
			type: 'mock-type',
			target: 'mock-target',
			options: {
				animateScroll: false,
				fade: false
			}
		})
		expect(mockState).toEqual({
			type: null,
			target: null,
			animateScroll: false,
			visualFocusTarget: 'some-target'
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
