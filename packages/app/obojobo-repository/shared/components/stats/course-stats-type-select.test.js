import React from 'react'
import { create, act } from 'react-test-renderer'

const VIEW_MODE_FINAL_ASSESSMENT_SCORE = 'final-assessment-scores'
const VIEW_MODE_ALL_ATTEMPTS = 'all-attempts'

import CourseStatsTypeSelect from './course-stats-type-select'

describe('CourseStatsTypeSelect', () => {
	const standardProps = {
		viewMode: VIEW_MODE_FINAL_ASSESSMENT_SCORE,
		onChangeViewMode: jest.fn()
	}

	test('mode selection element renders properly', () => {
		const component = create(<CourseStatsTypeSelect {...standardProps} />)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('changing the selection triggers onChangeViewMode', () => {
		const component = create(<CourseStatsTypeSelect {...standardProps} />)

		act(() => {
			component.root
				.findByType('select')
				.props.onChange({ target: { value: VIEW_MODE_ALL_ATTEMPTS } })
		})
		expect(standardProps.onChangeViewMode).toHaveBeenCalledTimes(1)
	})
})
