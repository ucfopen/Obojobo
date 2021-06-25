import React from 'react'
import renderer from 'react-test-renderer'
import AssessmentStatsFilterControls from './assessment-stats-filter-controls'

describe('AssessmentStatsFilterControls', () => {
	test('AssessmentStatsFilterControls renders correctly', () => {})

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
				<AssessmentStatsFilterControls
					onChangeFilterSettings={jest.fn()}
					filterSettings={{ showIncompleteAttempts, showPreviewAttempts, showAdvancedFields }}
				/>
			)
			const tree = component.toJSON()
			expect(tree).toMatchSnapshot()
		}
	)

	test('Inputs work as expected', () => {
		const onChangeFilterSettings = jest.fn()

		const component = renderer.create(
			<AssessmentStatsFilterControls
				onChangeFilterSettings={onChangeFilterSettings}
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
			/>
		)

		const checkboxShowIncomplete = component.root.findByProps({
			className: 'show-incomplete-attempts'
		})
		const checkboxShowPreview = component.root.findByProps({ className: 'show-preview-attempts' })
		const checkboxAdvanced = component.root.findByProps({ className: 'show-advanced-fields' })

		expect(onChangeFilterSettings).not.toHaveBeenCalled()

		// Click on checkboxShowIncomplete
		checkboxShowIncomplete.props.onChange({ target: { checked: true } })
		expect(onChangeFilterSettings).toHaveBeenCalledTimes(1)
		expect(onChangeFilterSettings).toHaveBeenCalledWith({
			showIncompleteAttempts: true,
			showPreviewAttempts: false,
			showAdvancedFields: false
		})

		// Click on checkboxShowPreview
		checkboxShowPreview.props.onChange({ target: { checked: true } })
		expect(onChangeFilterSettings).toHaveBeenCalledTimes(2)
		expect(onChangeFilterSettings).toHaveBeenCalledWith({
			showIncompleteAttempts: false,
			showPreviewAttempts: true,
			showAdvancedFields: false
		})

		// Click on showAdvancedFields
		checkboxAdvanced.props.onChange({ target: { checked: true } })
		expect(onChangeFilterSettings).toHaveBeenCalledTimes(3)
		expect(onChangeFilterSettings).toHaveBeenCalledWith({
			showIncompleteAttempts: false,
			showPreviewAttempts: false,
			showAdvancedFields: true
		})
	})
})
