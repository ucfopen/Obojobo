import React from 'react'
import renderer from 'react-test-renderer'
import AssessmentStatsSearchControls from './assessment-stats-filter-controls'

describe('AssessmentStatsSearchControls', () => {
	test('AssessmentStatsSearchControls renders correctly', () => {})

	test('Inputs and select tags work as expected', () => {
		const onChangeSearchSettings = jest.fn()
		const onChangeSearchContent = jest.fn()

		const component = renderer.create(
			<AssessmentStatsSearchControls
				onChangeSearchSettings={onChangeSearchSettings}
				onChangeSearchContent={onChangeSearchContent}
			/>
		)

		const select = component.root.findByProps({ id: 'search-by' })

		expect(onChangeSearchSettings).not.toHaveBeenCalled()
		expect(onChangeSearchContent).not.toHaveBeenCalled()

		// Change select option
		select.props.onChange({ target: { value: 'user-first-name' } })
		expect(onChangeSearchSettings).toHaveBeenCalledTimes(1)

		// Change input based on select option
		const textInput = component.root.findByProps({ type: 'text' })
		textInput.props.onChange({ target: { value: 'test' } })
		expect(onChangeSearchContent).toHaveBeenCalledTimes(1)

		// Change date inputs
		const dateStart = component.root.findAllByProps({ type: 'date' })[0]
		dateStart.props.onChange({ target : { value: new Date() } })
		expect(onChangeSearchContent).toHaveBeenCalledTimes(1)

		const dateEnd = component.root.findAllByProps({ type: 'date' })[1]
		dateEnd.props.onChange({ target : { value: new Date() } })
		expect(onChangeSearchContent).toHaveBeenCalledTimes(1)
	})
})
