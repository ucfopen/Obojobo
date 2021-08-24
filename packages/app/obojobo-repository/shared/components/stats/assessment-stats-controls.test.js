import React from 'react'
import renderer, { act } from 'react-test-renderer'
import Button from '../button'
import AssessmentStatsControls from './assessment-stats-controls'

jest.mock('use-debounce', () => ({
	useDebouncedCallback: cb => {
		const fn = () => {
			cb()
		}
		fn.flush = jest.fn()

		return fn
	}
}))

describe('AssessmentStatsControls', () => {
	test('AssessmentStatsControls renders correctly', () => {})

	test.each`
		showIncompleteAttempts | showPreviewAttempts | showAdvancedFields
		${false}               | ${false}            | ${false}
		${false}               | ${false}            | ${true}
		${false}               | ${true}             | ${false}
		${false}               | ${true}             | ${true}
		${true}                | ${false}            | ${false}
		${true}                | ${false}            | ${true}
		${true}                | ${true}             | ${false}
		${true}                | ${true}             | ${true}
	`(
		'<AssessmentStatsFilterControls showIncompleteAttempts=$showIncompleteAttempts showPreviewAttempts=$showPreviewAttempts showAdvancedFields=$showAdvancedFields /> matches snapshot',
		({ showIncompleteAttempts, showPreviewAttempts, showAdvancedFields }) => {
			const component = renderer.create(
				<AssessmentStatsControls
					onChangeControls={jest.fn()}
					controls={{ showIncompleteAttempts, showPreviewAttempts, showAdvancedFields }}
					dateBounds={{ start: null, end: null }}
					dropdownValues={['mock-student-one', 'mock-student-two']}
				/>
			)
			const tree = component.toJSON()
			expect(tree).toMatchSnapshot()
		}
	)

	test('Inputs work as expected', () => {
		const onChangeControls = jest.fn()

		const component = renderer.create(
			<AssessmentStatsControls
				onChangeControls={onChangeControls}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
				dateBounds={{ start: null, end: null }}
				dropdownValues={['mock-student-one', 'mock-student-two']}
			/>
		)

		const checkboxShowIncomplete = component.root.findByProps({
			className: 'show-incomplete-attempts'
		})
		const checkboxShowPreview = component.root.findByProps({ className: 'show-preview-attempts' })
		const checkboxAdvanced = component.root.findByProps({ className: 'show-advanced-fields' })

		expect(onChangeControls).not.toHaveBeenCalled()

		// Click on checkboxShowIncomplete
		checkboxShowIncomplete.props.onChange({ target: { checked: true } })
		expect(onChangeControls).toHaveBeenCalledTimes(1)
		expect(onChangeControls).toHaveBeenCalledWith({
			showIncompleteAttempts: true,
			showPreviewAttempts: false,
			showAdvancedFields: false
		})

		// Click on checkboxShowPreview
		checkboxShowPreview.props.onChange({ target: { checked: true } })
		expect(onChangeControls).toHaveBeenCalledTimes(2)
		expect(onChangeControls).toHaveBeenCalledWith({
			showIncompleteAttempts: false,
			showPreviewAttempts: true,
			showAdvancedFields: false
		})

		// Click on showAdvancedFields
		checkboxAdvanced.props.onChange({ target: { checked: true } })
		expect(onChangeControls).toHaveBeenCalledTimes(3)
		expect(onChangeControls).toHaveBeenCalledWith({
			showIncompleteAttempts: false,
			showPreviewAttempts: false,
			showAdvancedFields: true
		})
	})

	test('Inputs and select tags work as expected', () => {
		const onChangeControls = jest.fn()

		const component = renderer.create(
			<AssessmentStatsControls
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
				dateBounds={{ start: null, end: null }}
				onChangeControls={onChangeControls}
			/>
		)

		const select = component.root.findByProps({
			id: 'repository--assessment-stats-search-controls--search-by'
		})

		expect(onChangeControls).not.toHaveBeenCalled()

		// Change select option
		act(() => {
			select.props.onChange({ target: { value: 'user-first-name' } })
		})
		expect(onChangeControls).toHaveBeenCalledTimes(1)
	})

	test('Change input based on select option', () => {
		const onChangeControls = jest.fn()

		const component = renderer.create(
			<AssessmentStatsControls
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
				dateBounds={{ start: null, end: null }}
				onChangeControls={onChangeControls}
				dropdownValues={['mock-student-one', 'mock-student-two']}
			/>
		)

		expect(onChangeControls).toHaveBeenCalledTimes(0)
		const select = component.root.findByProps({
			id: 'repository--assessment-stats-search-controls--search-by'
		})
		// Change select option
		act(() => {
			select.props.onChange({ target: { value: 'user-first-name' } })
		})
		expect(onChangeControls).toHaveBeenCalledTimes(1)

		const textInput = component.root.findByProps({ type: 'text' })
		act(() => {
			textInput.props.onChange({ target: { value: 'test' } })
		})
		expect(onChangeControls).toHaveBeenCalledTimes(2)

		act(() => {
			textInput.props.onChange({ target: { value: '' } })
		})
		expect(onChangeControls).toHaveBeenCalledTimes(3)
	})

	test('Set and clear date start input', () => {
		const onChangeControls = jest.fn()

		const component = renderer.create(
			<AssessmentStatsControls
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
				dateBounds={{ start: null, end: null }}
				onChangeControls={onChangeControls}
				dropdownValues={['mock-student-one', 'mock-student-two']}
			/>
		)

		act(() => {
			component.root
				.findAllByProps({ type: 'date' })[0]
				.props.onChange({ target: { value: new Date() } })
		})
		expect(onChangeControls).toHaveBeenCalledTimes(1)
		expect(component.root.findAllByProps({ type: 'date' })[0].props.value).not.toBe('')
		act(() => {
			component.root.findAllByType(Button)[0].props.onClick()
		})
		expect(component.root.findAllByProps({ type: 'date' })[0].props.value).toBe('')
		expect(onChangeControls).toHaveBeenCalledTimes(2)
	})

	test('Set and clear date end input', () => {
		const onChangeControls = jest.fn()

		const component = renderer.create(
			<AssessmentStatsControls
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
				dateBounds={{ start: null, end: null }}
				onChangeControls={onChangeControls}
				dropdownValues={['mock-student-one', 'mock-student-two']}
			/>
		)

		act(() => {
			component.root
				.findAllByProps({ type: 'date' })[1]
				.props.onChange({ target: { value: new Date() } })
		})
		expect(onChangeControls).toHaveBeenCalledTimes(1)
		expect(component.root.findAllByProps({ type: 'date' })[1].props.value).not.toBe('')
		act(() => {
			component.root.findAllByType(Button)[1].props.onClick()
		})
		expect(component.root.findAllByProps({ type: 'date' })[1].props.value).toBe('')
		expect(onChangeControls).toHaveBeenCalledTimes(2)
	})
})
