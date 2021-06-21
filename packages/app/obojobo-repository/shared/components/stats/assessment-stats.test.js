import React from 'react'
import { create, act } from 'react-test-renderer'
import AssessmentStats from './assessment-stats'

jest.mock('react-data-table-component', () => ({
	default: props => (
		<div {...props} className="react-data-table-component">
			react-data-table-component
		</div>
	)
}))

describe('AssessmentStats', () => {
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
		]
	})

	test('AssessmentStats renders correctly', () => {
		const component = create(<AssessmentStats {...getTestProps()} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()

		// Change the select to view attempts instead of final assessment score:
		act(() => {
			component.root.findByType('select').props.onChange({ target: { value: 'all-attempts' } })
		})

		const tree2 = component.toJSON()
		expect(tree2).toMatchSnapshot()

		expect(tree).not.toEqual(tree2)
	})

	test('AssessmentStats renders expected number of rows', () => {
		const component = create(<AssessmentStats {...getTestProps()} />)
		let DataGrid

		// Highest assessment scores should only be showing one row, with the proper highest score
		DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(1)
		expect(DataGrid.props.data[0].highestAssessmentScore).toEqual(0)

		// Change the filter controls to allow for incomplete attempts
		act(() => {
			component.root
				.findByProps({ className: 'show-incomplete-attempts' })
				.props.onChange({ target: { checked: true } })
		})
		act(() => {
			component.root
				.findByProps({ className: 'show-preview-attempts' })
				.props.onChange({ target: { checked: false } })
		})
		DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(1)
		expect(DataGrid.props.data[0].highestAssessmentScore).toEqual(100)

		// Remove incomplete attempts but enable preview attempts
		act(() => {
			component.root
				.findByProps({ className: 'show-incomplete-attempts' })
				.props.onChange({ target: { checked: false } })
		})
		act(() => {
			component.root
				.findByProps({ className: 'show-preview-attempts' })
				.props.onChange({ target: { checked: true } })
		})
		DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(1)
		expect(DataGrid.props.data[0].highestAssessmentScore).toEqual(10)

		// Both incomplete and preview attempts
		act(() => {
			component.root
				.findByProps({ className: 'show-incomplete-attempts' })
				.props.onChange({ target: { checked: true } })
		})
		act(() => {
			component.root
				.findByProps({ className: 'show-preview-attempts' })
				.props.onChange({ target: { checked: true } })
		})
		DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(1)
		expect(DataGrid.props.data[0].highestAssessmentScore).toEqual(100)

		// Reset filters, select to view attempts instead of final assessment score:
		act(() => {
			component.root
				.findByProps({ className: 'show-incomplete-attempts' })
				.props.onChange({ target: { checked: false } })
		})
		act(() => {
			component.root
				.findByProps({ className: 'show-preview-attempts' })
				.props.onChange({ target: { checked: false } })
			component.root.findByType('select').props.onChange({ target: { value: 'all-attempts' } })
		})
		DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(2)
		expect(DataGrid.props.data[0].assessmentScore).toEqual(null)
		expect(DataGrid.props.data[1].assessmentScore).toEqual(0)

		// Change the filter controls to allow for incomplete attempts
		act(() => {
			component.root
				.findByProps({ className: 'show-incomplete-attempts' })
				.props.onChange({ target: { checked: true } })
		})
		act(() => {
			component.root
				.findByProps({ className: 'show-preview-attempts' })
				.props.onChange({ target: { checked: false } })
		})
		DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(3)
		expect(DataGrid.props.data[0].assessmentScore).toEqual(null)
		expect(DataGrid.props.data[1].assessmentScore).toEqual(0)
		expect(DataGrid.props.data[2].assessmentScore).toEqual(100)

		// Remove incomplete attempts but enable preview attempts
		act(() => {
			component.root
				.findByProps({ className: 'show-incomplete-attempts' })
				.props.onChange({ target: { checked: false } })
		})
		act(() => {
			component.root
				.findByProps({ className: 'show-preview-attempts' })
				.props.onChange({ target: { checked: true } })
		})
		DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(3)
		expect(DataGrid.props.data[0].assessmentScore).toEqual(null)
		expect(DataGrid.props.data[1].assessmentScore).toEqual(10)
		expect(DataGrid.props.data[2].assessmentScore).toEqual(0)

		// Both incomplete and preview attempts
		act(() => {
			component.root
				.findByProps({ className: 'show-incomplete-attempts' })
				.props.onChange({ target: { checked: true } })
		})
		act(() => {
			component.root
				.findByProps({ className: 'show-preview-attempts' })
				.props.onChange({ target: { checked: true } })
		})
		DataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(DataGrid.props.data.length).toEqual(4)
		expect(DataGrid.props.data[0].assessmentScore).toEqual(null)
		expect(DataGrid.props.data[1].assessmentScore).toEqual(10)
		expect(DataGrid.props.data[2].assessmentScore).toEqual(0)
		expect(DataGrid.props.data[3].assessmentScore).toEqual(100)
	})
})
