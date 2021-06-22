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
		},
		allModules: [
			{
				draftId: 'mock-draft-id-1',
				title: 'mock-title-1',
				createdAt: 'mock-created-at',
				updatedAt: 'mock-updated-at',
				latestVersion: 'mock-latest-version',
				revisionCount: 1
			},
			{
				draftId: 'mock-draft-id-2',
				title: 'mock-title-2',
				createdAt: 'mock-created-at',
				updatedAt: 'mock-updated-at',
				latestVersion: 'mock-latest-version',
				revisionCount: 1
			}
		]
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

	test('Clicking on the load stats button calls loadModuleAssessmentDetails', () => {
		const loadModuleAssessmentDetails = jest.fn()
		const component = create(
			<Stats
				{...getTestProps()}
				isFetching={false}
				hasFetched={true}
				loadModuleAssessmentDetails={loadModuleAssessmentDetails}
			/>
		)

		// Click on the Load drafts button:
		component.root.findByType(Button).props.onClick()
		expect(loadModuleAssessmentDetails).toHaveBeenCalledWith([])

		// Change what drafts are selected:
		act(() => {
			component.root
				.findByType(DataGridDrafts)
				.props.onSelectedDraftsChanged(['draft-id-1', 'draft-id-2'])
		})

		// Click on the load drafts button again:
		component.root.findByType(Button).props.onClick()
		expect(loadModuleAssessmentDetails).toHaveBeenCalledWith(['draft-id-1', 'draft-id-2'])
	})

	test('Selecting over 20 drafts disables the Load stats button', () => {
		const loadModuleAssessmentDetails = jest.fn()
		const component = create(
			<Stats
				{...getTestProps()}
				isFetching={false}
				hasFetched={true}
				loadModuleAssessmentDetails={loadModuleAssessmentDetails}
			/>
		)

		// Click on the Load drafts button:
		component.root.findByType(Button).props.onClick()
		expect(loadModuleAssessmentDetails).toHaveBeenCalledWith([])

		// Change what drafts are selected:
		act(() => {
			component.root
				.findByType(DataGridDrafts)
				.props.onSelectedDraftsChanged([
					'draft-id-1',
					'draft-id-2',
					'draft-id-3',
					'draft-id-4',
					'draft-id-5',
					'draft-id-6',
					'draft-id-7',
					'draft-id-8',
					'draft-id-9',
					'draft-id-10',
					'draft-id-11',
					'draft-id-12',
					'draft-id-13',
					'draft-id-14',
					'draft-id-15',
					'draft-id-16',
					'draft-id-17',
					'draft-id-18',
					'draft-id-19',
					'draft-id-20',
					'draft-id-21'
				])
		})

		// Load drafts button should be disabled:
		expect(component.root.findByType(Button).props.disabled).toBe(true)
	})

	test('Search filters drafts as expected', () => {
		const component = create(<Stats {...getTestProps()} isFetching={false} hasFetched={true} />)

		let dataGrid
		dataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(dataGrid.props.data.length).toBe(2)

		// Search by draftId
		act(() => {
			component.root
				.findByProps({ className: 'repository--drafts-search' })
				.props.onChange({ target: { value: 'ID-1' } })
		})

		dataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(dataGrid.props.data.length).toBe(1)
		expect(dataGrid.props.data[0].draftId).toBe('mock-draft-id-1')

		// Search by title
		act(() => {
			component.root
				.findByProps({ className: 'repository--drafts-search' })
				.props.onChange({ target: { value: 'TITLE-2' } })
		})

		dataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(dataGrid.props.data.length).toBe(1)
		expect(dataGrid.props.data[0].title).toBe('mock-title-2')

		// No results
		act(() => {
			component.root
				.findByProps({ className: 'repository--drafts-search' })
				.props.onChange({ target: { value: 'No results' } })
		})

		dataGrid = component.root.findByProps({ className: 'react-data-table-component' })
		expect(dataGrid.props.data.length).toBe(0)
	})
})
