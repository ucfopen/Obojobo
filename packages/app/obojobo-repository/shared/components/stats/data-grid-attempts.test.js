import React from 'react'
import renderer from 'react-test-renderer'
import DataGridAttempts from './data-grid-attempts'

jest.mock('react-data-table-component', () => ({
	default: props => (
		<div {...props} className="react-data-table-component">
			react-data-table-component
		</div>
	)
}))

describe('DataGridAttempts', () => {
	const getTestProps = () => ({
		attempts: [
			{
				draftId: 'mock-draft-id',
				exampleId: 'mock-example-id',
				launchPresentationReturnUrl: 'mock-url',
				importedAttemptId: 'mock-imported-attempt-id',
				attemptScore: 'mock-attempt-score',
				assessmentStatus: 'mock-assessment-status',
				modRewardTotal: 'mock-reward',
				isInvalid: true,
				isPreview: true
			},
			{
				draftId: 'mock-draft-id2',
				exampleId: 'mock-example-id2',
				launchPresentationReturnUrl: 'mock-url',
				importedAttemptId: 'mock-imported-attempt-id',
				attemptScore: 'mock-attempt-score',
				assessmentStatus: 'mock-assessment-status',
				modRewardTotal: 'mock-reward',
				isInvalid: false,
				isPreview: false
			}
		],
		controls: {
			showIncompleteAttempts: false,
			showPreviewAttempts: false,
			showAdvancedFields: false,
			searchBy: 'draft-id',
			searchContent: {
				searchString: 'mock',
				date: null
			}
		}
	})

	test('DataGridAttempts renders correctly', () => {
		const component = renderer.create(<DataGridAttempts {...getTestProps()} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('DataGridAttempts renders with no attempts', () => {
		const component = renderer.create(
			<DataGridAttempts
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'draft-id',
					searchContent: {
						searchString: 'mock',
						date: null
					}
				}}
			/>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('DataGridAttempts columns with cell components render as expected', () => {
		const props = {
			...getTestProps(),
			controls: {
				showIncompleteAttempts: true,
				showPreviewAttempts: true,
				showAdvancedFields: true,
				searchBy: 'draft-id',
				searchContent: {
					searchString: 'mock',
					date: null
				}
			}
		}

		const component = renderer.create(<DataGridAttempts {...props} />)
		const columns = component.root.findByProps({ className: 'react-data-table-component' }).props
			.columns

		columns.forEach(col => {
			if (col.cell) {
				expect(
					col.cell({
						draftId: 'mock-draft-id2',
						exampleId: 'mock-example-id2',
						launchPresentationReturnUrl: 'mock-url',
						importedAttemptId: 'mock-imported-attempt-id',
						attemptScore: 'mock-attempt-score',
						assessmentStatus: 'mock-assessment-status',
						modRewardTotal: 'mock-reward',
						isInvalid: false,
						isPreview: false
					})
				).toMatchSnapshot()
			}
		})
	})
})
