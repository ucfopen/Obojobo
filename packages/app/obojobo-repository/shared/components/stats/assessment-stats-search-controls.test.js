import React from 'react'
import renderer, { act } from 'react-test-renderer'
import Button from '../button'
import AssessmentStatsSearchControls from './assessment-stats-search-controls'

jest.mock('use-debounce', () => ({
	useDebouncedCallback: cb => {
		const fn = () => {
			cb()
		}
		fn.flush = jest.fn()

		return fn
	}
}))

describe('AssessmentStatsSearchControls', () => {
	test('AssessmentStatsSearchControls renders correctly', () => {})

	test('Inputs and select tags work as expected', () => {
		const onChangeSearchSettings = jest.fn()
		const onChangeSearchContent = jest.fn()

		const component = renderer.create(
			<AssessmentStatsSearchControls
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
				onChangeSearchSettings={onChangeSearchSettings}
				onChangeSearchContent={onChangeSearchContent}
			/>
		)

		const select = component.root.findByProps({
			id: 'repository--assessment-stats-search-controls--search-by'
		})

		expect(onChangeSearchSettings).not.toHaveBeenCalled()
		expect(onChangeSearchContent).not.toHaveBeenCalled()

		// Change select option
		act(() => {
			select.props.onChange({ target: { value: 'user-first-name' } })
		})
		expect(onChangeSearchSettings).toHaveBeenCalledTimes(1)
		expect(onChangeSearchContent).not.toHaveBeenCalled()
	})

	test('Change input based on select option', () => {
		const onChangeSearchSettings = jest.fn()
		const onChangeSearchContent = jest.fn()

		const component = renderer.create(
			<AssessmentStatsSearchControls
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
				onChangeSearchSettings={onChangeSearchSettings}
				onChangeSearchContent={onChangeSearchContent}
			/>
		)

		expect(onChangeSearchContent).toHaveBeenCalledTimes(0)
		const select = component.root.findByProps({
			id: 'repository--assessment-stats-search-controls--search-by'
		})
		// Change select option
		act(() => {
			select.props.onChange({ target: { value: 'user-first-name' } })
		})

		expect(onChangeSearchContent).toHaveBeenCalledTimes(0)
		const textInput = component.root.findByProps({ type: 'text' })
		act(() => {
			textInput.props.onChange({ target: { value: 'test' } })
		})
		expect(onChangeSearchContent).toHaveBeenCalledTimes(1)

		act(() => {
			textInput.props.onChange({ target: { value: '' } })
		})
		expect(onChangeSearchContent).toHaveBeenCalledTimes(2)
	})

	test('Set and clear date start input', () => {
		const onChangeSearchSettings = jest.fn()
		const onChangeSearchContent = jest.fn()

		const component = renderer.create(
			<AssessmentStatsSearchControls
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
				onChangeSearchSettings={onChangeSearchSettings}
				onChangeSearchContent={onChangeSearchContent}
			/>
		)

		act(() => {
			component.root
				.findAllByProps({ type: 'date' })[0]
				.props.onChange({ target: { value: new Date() } })
		})
		expect(onChangeSearchContent).toHaveBeenCalledTimes(1)
		expect(component.root.findAllByProps({ type: 'date' })[0].props.value).not.toBe('')
		act(() => {
			component.root.findAllByType(Button)[0].props.onClick()
		})
		expect(component.root.findAllByProps({ type: 'date' })[0].props.value).toBe('')
		expect(onChangeSearchContent).toHaveBeenCalledTimes(2)
	})

	test('Set and clear date end input', () => {
		const onChangeSearchSettings = jest.fn()
		const onChangeSearchContent = jest.fn()

		const component = renderer.create(
			<AssessmentStatsSearchControls
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
				onChangeSearchSettings={onChangeSearchSettings}
				onChangeSearchContent={onChangeSearchContent}
			/>
		)

		act(() => {
			component.root
				.findAllByProps({ type: 'date' })[1]
				.props.onChange({ target: { value: new Date() } })
		})
		expect(onChangeSearchContent).toHaveBeenCalledTimes(1)
		expect(component.root.findAllByProps({ type: 'date' })[1].props.value).not.toBe('')
		act(() => {
			component.root.findAllByType(Button)[1].props.onClick()
		})
		expect(component.root.findAllByProps({ type: 'date' })[1].props.value).toBe('')
		expect(onChangeSearchContent).toHaveBeenCalledTimes(2)
	})
})
