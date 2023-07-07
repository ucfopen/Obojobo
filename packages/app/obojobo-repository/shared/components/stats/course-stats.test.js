import React from 'react'
import { create } from 'react-test-renderer'
import CourseStats from './course-stats'

const VIEW_MODE_FINAL_ASSESSMENT_SCORE = 'final-assessment-scores'
const VIEW_MODE_ALL_ATTEMPTS = 'all-attempts'

jest.mock('react-data-table-component', () => ({
	default: props => (
		<div {...props} className="react-data-table-component">
			react-data-table-component
		</div>
	)
}))

describe('CourseStats', () => {
	const getTestProps = () => ({
		attempts: [
			{
				draftId: 'Draft-A',
				draftContentId: 'Version-1',
				resourceLinkId: 'Resource-X',
				assessmentId: 'Assessment-1',
				userId: 'User-Alpha',
				assessmentScore: null,
				completedAt: 'mock-date',
				isPreview: false
			},
			{
				draftId: 'Draft-A',
				draftContentId: 'Version-1',
				resourceLinkId: 'Resource-X',
				assessmentId: 'Assessment-1',
				userId: 'User-Alpha',
				assessmentScore: 10,
				completedAt: 'mock-date',
				isPreview: true
			},
			{
				draftId: 'Draft-A',
				draftContentId: 'Version-1',
				resourceLinkId: 'Resource-X',
				assessmentId: 'Assessment-1',
				userId: 'User-Alpha',
				assessmentScore: 0,
				completedAt: 'mock-date',
				isPreview: false
			},
			{
				draftId: 'Draft-A',
				draftContentId: 'Version-1',
				resourceLinkId: 'Resource-X',
				assessmentId: 'Assessment-1',
				userId: 'User-Alpha',
				assessmentScore: 100,
				completedAt: null,
				isPreview: false
			}
		],
		viewMode: VIEW_MODE_FINAL_ASSESSMENT_SCORE,
		searchSettings: '',
		searchContent: '',
		filterSettings: {
			showIncompleteAttempts: false,
			showPreviewAttempts: false,
			showAdvancedFields: false
		}
	})

	test('CourseStats renders final assessment scores', () => {
		const component = create(<CourseStats {...getTestProps()} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
		const DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(1)
	})

	test('CourseStats renders all attempts scores', () => {
		const component = create(<CourseStats {...getTestProps()} viewMode={VIEW_MODE_ALL_ATTEMPTS} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
		const DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(2)
	})

	test('CourseStats renders preview scores', () => {
		const component = create(
			<CourseStats
				{...getTestProps()}
				viewMode={VIEW_MODE_ALL_ATTEMPTS}
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: true,
					showAdvancedFields: false
				}}
			/>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
		const DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(3)
	})

	test('CourseStats renders assessment scores', () => {
		const component = create(
			<CourseStats
				{...getTestProps()}
				viewMode={VIEW_MODE_ALL_ATTEMPTS}
				filterSettings={{
					showIncompleteAttempts: true,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
			/>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
		const DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(3)
	})

	test('CourseStats renders unfiltered scores', () => {
		const component = create(
			<CourseStats
				{...getTestProps()}
				viewMode={VIEW_MODE_ALL_ATTEMPTS}
				filterSettings={{
					showIncompleteAttempts: true,
					showPreviewAttempts: true,
					showAdvancedFields: true
				}}
			/>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
		const DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(4)
	})
})
