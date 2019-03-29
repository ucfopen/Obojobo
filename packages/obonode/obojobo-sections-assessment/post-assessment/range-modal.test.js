import RangeModal from './range-modal'
import React from 'react'
import { mount } from 'enzyme'

describe('Range Modal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('RangeModal component with single number', () => {
		const component = mount(<RangeModal for="100" />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component with a range', () => {
		const component = mount(<RangeModal for="[0,100]" />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component with a non-inclusive range', () => {
		const component = mount(<RangeModal for="(0,100)" />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component with no-score', () => {
		const component = mount(<RangeModal for="no-score" />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component with a no range', () => {
		const component = mount(<RangeModal />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('getValueFromInput returns the element value based on type', () => {
		expect(
			RangeModal.prototype.getValueFromInput({
				type: 'checkbox',
				checked: 'mock-checked',
				value: 'mock-value'
			})
		).toBe('mock-checked')

		expect(
			RangeModal.prototype.getValueFromInput({
				type: 'radio',
				checked: 'mock-checked',
				value: 'mock-value'
			})
		).toBe('mock-checked')

		expect(
			RangeModal.prototype.getValueFromInput({
				type: 'number',
				checked: 'mock-checked',
				value: 'mock-value'
			})
		).toBe('mock-value')

		expect(
			RangeModal.prototype.getValueFromInput({
				type: 'unrecognized-type',
				checked: 'mock-checked',
				value: 'mock-value'
			})
		).toBe(null)
	})

	test('updateSingleScoreFromEvent calls updateSingleScore', () => {
		const spy = jest.spyOn(RangeModal.prototype, 'updateSingleScore').mockImplementation(jest.fn())

		RangeModal.prototype.updateSingleScoreFromEvent({
			target: { type: 'number', value: 'mock-value' }
		})

		expect(spy).toHaveBeenLastCalledWith('mock-value')

		spy.mockRestore()
	})

	test('updateRangeFromEvent calls updateRange', () => {
		const spy = jest.spyOn(RangeModal.prototype, 'updateRange').mockImplementation(jest.fn())

		RangeModal.prototype.updateRangeFromEvent('propName', {
			target: { type: 'number', value: 'mock-value' }
		})

		expect(spy).toHaveBeenLastCalledWith({ propName: 'mock-value' })

		spy.mockRestore()
	})

	test('updateSingleScore updates the range as expected', () => {
		const spy = jest.spyOn(RangeModal.prototype, 'updateRange').mockImplementation(jest.fn())

		RangeModal.prototype.updateSingleScore('mock-single-score')

		expect(spy).toHaveBeenLastCalledWith({
			min: 'mock-single-score',
			max: 'mock-single-score',
			isMinInclusive: true,
			isMaxInclusive: true
		})

		spy.mockRestore()
	})

	test('generateRangeString generates expected strings', () => {
		expect(
			RangeModal.prototype.generateRangeString({
				min: '50',
				max: '50',
				isMinInclusive: true,
				isMaxInclusive: true
			})
		).toEqual('50')
		expect(
			RangeModal.prototype.generateRangeString({
				min: '50',
				max: '50',
				isMinInclusive: false,
				isMaxInclusive: false
			})
		).toEqual('50')
		expect(
			RangeModal.prototype.generateRangeString({
				min: '50',
				max: '50',
				isMinInclusive: true,
				isMaxInclusive: false
			})
		).toEqual('50')
		expect(
			RangeModal.prototype.generateRangeString({
				min: '50',
				max: '50',
				isMinInclusive: false,
				isMaxInclusive: true
			})
		).toEqual('50')
		expect(
			RangeModal.prototype.generateRangeString({
				min: '0',
				max: '100',
				isMinInclusive: true,
				isMaxInclusive: true
			})
		).toEqual('[0,100]')
		expect(
			RangeModal.prototype.generateRangeString({
				min: '0',
				max: '100',
				isMinInclusive: false,
				isMaxInclusive: true
			})
		).toEqual('(0,100]')
		expect(
			RangeModal.prototype.generateRangeString({
				min: '0',
				max: '100',
				isMinInclusive: true,
				isMaxInclusive: false
			})
		).toEqual('[0,100)')
		expect(
			RangeModal.prototype.generateRangeString({
				min: '0',
				max: '100',
				isMinInclusive: false,
				isMaxInclusive: false
			})
		).toEqual('(0,100)')
	})

	test('updateRange updates state.range, state.error and state.rangeString', () => {
		const component = mount(<RangeModal for="[0,100]" />)
		component.instance().setState({ error: 'mock-error' })
		component.update()

		expect(component.instance().state).toEqual({
			range: {
				min: '0',
				max: '100',
				isMinInclusive: true,
				isMaxInclusive: true
			},
			type: 'range',
			error: 'mock-error'
		})
		component.instance().updateRange({ min: '1', isMinInclusive: false })
		component.update()

		expect(component.instance().state).toEqual({
			range: {
				min: '1',
				max: '100',
				isMinInclusive: false,
				isMaxInclusive: true
			},
			type: 'range',
			error: null
		})
	})

	test('onChangeType updates state with defaults', () => {
		const component = mount(<RangeModal for="(0,100]" />)

		component.instance().onChangeType('single')
		component.update()
		expect(component.instance().state).toEqual({
			range: {
				min: '100',
				max: '100',
				isMinInclusive: true,
				isMaxInclusive: true
			},
			type: 'single',
			error: null
		})

		component.instance().onChangeType('range')
		component.update()
		expect(component.instance().state).toEqual({
			range: {
				min: '0',
				max: '100',
				isMinInclusive: true,
				isMaxInclusive: true
			},
			type: 'range',
			error: null
		})
	})

	test('onToggleNoScore updates state', () => {
		const spy = jest.spyOn(RangeModal.prototype, 'updateSingleScore').mockImplementation(jest.fn())

		RangeModal.prototype.onToggleNoScore({ target: { checked: true } })
		expect(spy).toHaveBeenLastCalledWith('no-score')

		RangeModal.prototype.onToggleNoScore({ target: { checked: false } })
		expect(spy).toHaveBeenLastCalledWith('')

		spy.mockRestore()
	})

	test('getError returns expected errors', () => {
		expect(
			RangeModal.prototype.getError({
				min: 'no-score',
				max: 'no-score'
			})
		).toBe(null)
		expect(RangeModal.prototype.getError({ min: 'no-score', max: 'no-score' })).toBe(null)
		expect(RangeModal.prototype.getError({ min: '-1', max: '-1' })).toBe(
			'Scores must be between 0 and 100'
		)
		expect(RangeModal.prototype.getError({ min: '101', max: '101' })).toBe(
			'Scores must be between 0 and 100'
		)
		expect(RangeModal.prototype.getError({ min: '0', max: '101' })).toBe(
			'Scores must be between 0 and 100'
		)
		expect(RangeModal.prototype.getError({ min: '-1', max: '100' })).toBe(
			'Scores must be between 0 and 100'
		)
		expect(RangeModal.prototype.getError({ min: '200', max: '-200' })).toBe(
			'Scores must be between 0 and 100'
		)
		expect(RangeModal.prototype.getError({ min: '0', max: 'ABC' })).toBe(
			'Scores must be between 0 and 100'
		)
		expect(RangeModal.prototype.getError({ min: 'false', max: '100' })).toBe(
			'Scores must be between 0 and 100'
		)
		expect(RangeModal.prototype.getError({ min: '50', max: '0' })).toBe(
			"Min can't be larger than max"
		)
		expect(RangeModal.prototype.getError({ min: '0', max: '100' })).toBe(null)
		expect(RangeModal.prototype.getError({ min: '100', max: '100' })).toBe(null)
		expect(RangeModal.prototype.getError({ min: '0', max: '100' })).toBe(null)
	})

	test('onConfirm sets error state and does not call props.onConfirm if there is an error', () => {
		const mockOnConfirm = jest.fn()
		const component = mount(<RangeModal for="[100,0]" onConfirm={mockOnConfirm} />)
		component.instance().onConfirm()

		expect(component.instance().state.error).toBe("Min can't be larger than max")
		expect(mockOnConfirm).not.toHaveBeenCalled()
	})

	test('onConfirm calls props.onConfirm if there is no error', () => {
		const mockOnConfirm = jest.fn()
		const component = mount(<RangeModal for="[0,100]" onConfirm={mockOnConfirm} />)
		component.instance().onConfirm()

		expect(component.instance().state.error).toBe(null)
		expect(mockOnConfirm).toHaveBeenCalled()
	})

	test('RangeModal component calls onConfirm from props', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('RangeModal component calls onConfirm from props with single value', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="100" onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
	})

	test('RangeModal component does not call confirm when for is above 100', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="10000" onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component does not call confirm when min or max are above 100', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,10000]" onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component does not call confirm when min is greater than max', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[80,30]" onConfirm={onConfirm} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('RangeModal component focuses on first element', () => {
		const component = mount(<RangeModal for="[0,100]" />)

		component.instance().focusOnFirstElement()

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes range type', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(1)
			.simulate('change', { target: { value: 'single' } })

		expect(component.html()).toMatchSnapshot()

		component
			.find('input')
			.at(2)
			.simulate('change', { target: { value: 'range' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes single score', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="100" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(2)
			.simulate('change', { target: { value: 'changed' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component sets single "no-score" score', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="100" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(3)
			.simulate('change', { target: { checked: true } })

		expect(component.html()).toMatchSnapshot()

		component
			.find('input')
			.at(3)
			.simulate('change', { target: { checked: false } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes first item of range', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(3)
			.simulate('change', { target: { value: '100' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes inclusivity of first part of range', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(4)
			.simulate('change', { target: { checked: false } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes second item of range', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(5)
			.simulate('change', { target: { value: '1' } })

		expect(component.html()).toMatchSnapshot()
	})

	test('RangeModal component changes inclusivity of second part of range', () => {
		const onConfirm = jest.fn()

		const component = mount(<RangeModal for="[0,100]" onConfirm={onConfirm} />)

		component
			.find('input')
			.at(6)
			.simulate('change', { target: { checked: false } })

		expect(component.html()).toMatchSnapshot()
	})
})
