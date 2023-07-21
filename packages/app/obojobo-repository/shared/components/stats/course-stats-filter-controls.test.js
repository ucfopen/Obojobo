import React from 'react'
import { create, act } from 'react-test-renderer'
import CourseStatsFilterControls from './course-stats-filter-controls'

describe('CourseStatsFilterControls', () => {
	const standardProps = {
		filterSettings: {
			showIncompleteAttempts: false,
			showPreviewAttempts: false,
			showAdvancedFields: false
		},
		onChangeFilterSettings: jest.fn()
	}

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('filter controls element renders properly', () => {
		const component = create(<CourseStatsFilterControls {...standardProps} />)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('checking the controls calls the onChangeFilterSettings function', () => {
		const component = create(<CourseStatsFilterControls {...standardProps} />)

		const inputFields = component.root.findAllByType('input')
		act(() => {
			inputFields[0].props.onChange({ target: { checked: true } })
			inputFields[1].props.onChange({ target: { checked: true } })
			inputFields[2].props.onChange({ target: { checked: true } })
		})
		expect(standardProps.onChangeFilterSettings).toHaveBeenCalledTimes(3)
	})

	test('unchecking the controls calls the onChangeFilterSettings function', () => {
		const component = create(
			<CourseStatsFilterControls
				{...standardProps}
				filterSettings={{
					showIncompleteAttempts: true,
					showPreviewAttempts: true,
					showAdvancedFields: true
				}}
			/>
		)

		const inputFields = component.root.findAllByType('input')
		act(() => {
			inputFields[0].props.onChange({ target: { checked: false } })
			inputFields[1].props.onChange({ target: { checked: false } })
			inputFields[2].props.onChange({ target: { checked: false } })
		})
		expect(standardProps.onChangeFilterSettings).toHaveBeenCalledTimes(3)
	})
})
