import React from 'react'
import { create } from 'react-test-renderer'

import CourseScoreDataListItem from './course-score-data-list-item'

describe('CourseScoreDataListItem', () => {
	const standardProps = {
		courseTitle: 'Mock Course Title',
		courseLabel: 'MCT-101',
		courseUserCount: 10,
		courseLastAccessed: 'Apr 1st 2020 - 9:15 AM',
		courseClick: jest.fn(),
		isSelected: false,
		index: 3
	}

	test('renders with standard expected props', () => {
		const component = create(<CourseScoreDataListItem {...standardProps} />)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly when selected', () => {
		const component = create(<CourseScoreDataListItem {...standardProps} isSelected={true} />)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('user count displays properly without the "s" for 1 learner', () => {
		standardProps.courseUserCount = 1

		const component = create(<CourseScoreDataListItem {...standardProps} courseUserCount={1} />)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('onClick callback is called properly', () => {
		const component = create(<CourseScoreDataListItem {...standardProps} />)

		component.root.findByProps({ className: 'course-score-data-list--item' }).props.onClick()

		expect(standardProps.courseClick).toHaveBeenCalledTimes(1)
		expect(standardProps.courseClick).toHaveBeenCalledWith(standardProps.index)
	})
})
