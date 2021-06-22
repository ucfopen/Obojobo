import React from 'react'
import renderer, { act } from 'react-test-renderer'
import AssessmentStatsSearchControls from './assessment-stats-search-controls'

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

		const select = component.root.findByProps({ id: 'search-by' })

		expect(onChangeSearchSettings).not.toHaveBeenCalled()
		expect(onChangeSearchContent).not.toHaveBeenCalled()

		// Change select option
		act(() => {
			select.props.onChange({ target: { value: 'user-first-name' } })
		})
		expect(onChangeSearchSettings).toHaveBeenCalledTimes(1)

		// Change input based on select option
		const textInput = component.root.findByProps({ type: 'text' })
		act(() => {
			textInput.props.onChange({ target: { value: 'test' } })
		})
		expect(onChangeSearchContent).toHaveBeenCalledTimes(1)

		// Change date inputs
		const dateStart = component.root.findAllByProps({ type: 'date' })[0]
		act(() => {
			dateStart.props.onChange({ target : { value: new Date() } })
		})
		expect(onChangeSearchContent).toHaveBeenCalledTimes(2)

		const dateEnd = component.root.findAllByProps({ type: 'date' })[1]
		act(() => {
			dateEnd.props.onChange({ target : { value: new Date() } })
		})
		expect(onChangeSearchContent).toHaveBeenCalledTimes(3)
	})
})
