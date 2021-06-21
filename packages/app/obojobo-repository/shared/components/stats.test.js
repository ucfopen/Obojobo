import React from 'react'
import { create, act } from 'react-test-renderer'
import Button from './button'

import Stats from './stats'
import DataGridDrafts from './stats/data-grid-drafts'

jest.mock('react-data-table-component', () => ({
	default: props => (
		<div {...props} className="react-data-table-component">
			react-data-table-component
		</div>
	)
}))

describe('Stats', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	const getTestProps = () => ({
		currentUser: {
			id: 99,
			avatarUrl: '/path/to/avatar',
			firstName: 'firstName',
			lastName: 'lastName',
			perms: [
				'canViewEditor',
				'canEditDrafts',
				'canDeleteDrafts',
				'canCreateDrafts',
				'canPreviewDrafts'
			]
		},
		assessmentStats: {
			isFetching: true,
			hasFetched: false
		}
	})

	test('Renders loading state correctly', () => {
		const component = create(<Stats {...getTestProps()} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Renders loaded state correctly', () => {
		const component = create(
			<Stats
				{...getTestProps()}
				assessmentStats={{ isFetching: false, hasFetched: true, items: [] }}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Renders non-loaded non-fetching state correctly', () => {
		const component = create(
			<Stats
				{...getTestProps()}
				assessmentStats={{ isFetching: false, hasFetched: false, items: [] }}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Clicking on the load stats button calls loadModuleAssessmentAnalytics', () => {
		const loadModuleAssessmentAnalytics = jest.fn()
		const component = create(
			<Stats
				{...getTestProps()}
				isFetching={false}
				hasFetched={true}
				loadModuleAssessmentAnalytics={loadModuleAssessmentAnalytics}
			/>
		)

		// Click on the Load drafts button:
		component.root.findByType(Button).props.onClick()
		expect(loadModuleAssessmentAnalytics).toHaveBeenCalledWith([])

		// Change what drafts are selected:
		act(() => {
			component.root
				.findByType(DataGridDrafts)
				.props.onSelectedDraftsChanged(['draft-id-1', 'draft-id-2'])
		})

		// Click on the load drafts button again:
		component.root.findByType(Button).props.onClick()
		expect(loadModuleAssessmentAnalytics).toHaveBeenCalledWith(['draft-id-1', 'draft-id-2'])
	})
})
