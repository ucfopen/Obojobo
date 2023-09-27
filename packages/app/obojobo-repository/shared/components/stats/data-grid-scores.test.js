import React from 'react'
import renderer from 'react-test-renderer'
import DataGridScores from './data-grid-scores'

jest.mock('react-data-table-component', () => ({
	default: props => (
		<div {...props} className="react-data-table-component">
			react-data-table-component
		</div>
	)
}))

describe('DataGridScores', () => {
	const getTestProps = () => ({
		columns: [
			{
				name: 'Draft ID',
				selector: 'draftId',
				sortable: true,
				advanced: false
			},
			{
				name: 'Example ID',
				selector: 'exampleId',
				sortable: true,
				advanced: true
			}
		],
		rows: [
			{
				draftId: 'mock-draft-id',
				exampleId: 'mock-example-id',
				completedAt: '2021-02-04T13:55:30.255Z',
				userFirstName: 'mock-first-name',
				userLastName: 'mock-last-name',
				studentName: 'mock-first-name mock-last-name'
			},
			{
				draftId: 'mock-draft-id2',
				exampleId: 'mock-example-id2',
				completedAt: '2021-06-21T15:32:30.255Z',
				userFirstName: 'mock-first-name',
				userLastName: 'mock-last-name',
				studentName: 'mock-first-name mock-last-name'
			}
		],
		tableName: 'Mock Table Name',
		csvFileName: 'mock-csv-file-name',
		controls: {
			showIncompleteAttempts: false,
			showPreviewAttempts: false,
			showAdvancedFields: false,
			searchBy: 'draft-id',
			searchContent: {
				searchString: 'mock',
				date: null
			}
		},
		setFilteredRows: () => {},
		isDebouncing: false
	})

	test('DataGridScores renders correctly', () => {
		const component = renderer.create(<DataGridScores {...getTestProps()} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test.each`
		showIncompleteAttempts | showPreviewAttempts | showAdvancedFields | expectedCSVFileName
		${false}               | ${false}            | ${false}           | ${'csv__mock-draft-id_mock-draft-id2'}
		${false}               | ${false}            | ${true}            | ${'csv-with-advanced-fields__mock-draft-id_mock-draft-id2'}
		${false}               | ${true}             | ${false}           | ${'csv-with-preview-attempts__mock-draft-id_mock-draft-id2'}
		${false}               | ${true}             | ${true}            | ${'csv-with-preview-attempts-with-advanced-fields__mock-draft-id_mock-draft-id2'}
		${true}                | ${false}            | ${false}           | ${'csv-with-incomplete-attempts__mock-draft-id_mock-draft-id2'}
		${true}                | ${false}            | ${true}            | ${'csv-with-incomplete-attempts-with-advanced-fields__mock-draft-id_mock-draft-id2'}
		${true}                | ${true}             | ${false}           | ${'csv-with-incomplete-attempts-with-preview-attempts__mock-draft-id_mock-draft-id2'}
		${true}                | ${true}             | ${true}            | ${'csv-with-incomplete-attempts-with-preview-attempts-with-advanced-fields__mock-draft-id_mock-draft-id2'}
	`(
		'getFileName({showIncompleteAttempts:$showIncompleteAttempts, showPreviewAttempts:$showPreviewAttempts, showAdvancedFields:$showAdvancedFields}) = "$expectedCSVFileName"',
		({ showIncompleteAttempts, showPreviewAttempts, showAdvancedFields, expectedCSVFileName }) => {
			const component = renderer.create(
				<DataGridScores
					{...getTestProps()}
					csvFileName="csv"
					controls={{
						showIncompleteAttempts,
						showPreviewAttempts,
						showAdvancedFields,
						searchBy: '',
						searchContent: {
							searchString: '',
							date: { start: null, end: null }
						}
					}}
				/>
			)
			expect(component.root.findByType('a').props.download).toBe(expectedCSVFileName)
		}
	)

	test.each`
		showIncompleteAttempts | showPreviewAttempts | expectedTableName
		${false}               | ${false}            | ${'Mock Table Name'}
		${false}               | ${true}             | ${'Mock Table Name (including preview attempts)'}
		${true}                | ${false}            | ${'Mock Table Name (including incomplete attempts)'}
		${true}                | ${true}             | ${'Mock Table Name (including incomplete and preview attempts)'}
	`(
		'getTableName({showIncompleteAttempts:$showIncompleteAttempts, showPreviewAttempts:$showPreviewAttempts) = "$expectedTableName"',
		({ showIncompleteAttempts, showPreviewAttempts, expectedTableName }) => {
			const component = renderer.create(
				<DataGridScores
					{...getTestProps()}
					controls={{
						showIncompleteAttempts,
						showPreviewAttempts,
						showAdvancedFields: false,
						searchBy: 'draft-id',
						searchContent: {
							searchString: 'mock',
							date: null
						}
					}}
				/>
			)

			expect(
				component.root
					.findByProps({ className: 'react-data-table-component' })
					.props.title.props.className.split('data-table-header')[1]
					.trim()
			).toBe(expectedTableName)
		}
	)

	test('showAdvancedFields works as expected', () => {
		const component1 = renderer.create(
			<DataGridScores
				{...getTestProps()}
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

		expect(
			component1.root.findByProps({ className: 'react-data-table-component' }).props.columns
		).toEqual([
			{
				name: 'Draft ID',
				selector: 'draftId',
				sortable: true,
				advanced: false
			}
		])

		const component2 = renderer.create(
			<DataGridScores
				{...getTestProps()}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: true,
					searchBy: 'draft-id',
					searchContent: {
						searchString: 'mock',
						date: null
					}
				}}
			/>
		)

		expect(
			component2.root.findByProps({ className: 'react-data-table-component' }).props.columns
		).toEqual([
			{
				name: 'Draft ID',
				selector: 'draftId',
				sortable: true,
				advanced: false
			},
			{
				name: 'Example ID',
				selector: 'exampleId',
				sortable: true,
				advanced: true
			}
		])
	})

	test('DataGridScores creates a CSV as expected', () => {
		const component1 = renderer.create(
			<DataGridScores
				{...getTestProps()}
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

		expect(component1.root.findByType('a').props.href).toMatchSnapshot()

		const component2 = renderer.create(
			<DataGridScores
				{...getTestProps()}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: true,
					searchBy: 'draft-id',
					searchContent: {
						searchString: 'mock',
						date: null
					}
				}}
			/>
		)

		expect(component2.root.findByType('a').props.href).toMatchSnapshot()
	})

	test('DataGridScores renders when no rows given', () => {
		const component = renderer.create(
			<DataGridScores
				columns={[]}
				isDebouncing={true}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'course-title',
					searchContent: {
						searchString: 'mock-course-title',
						date: { start: null, end: null }
					}
				}}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('DataGridScores renders one row', () => {
		const props = getTestProps()
		props.rows.pop()

		const component = renderer.create(<DataGridScores {...props} />)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('DataGridScores uses search filters as expected', () => {
		let props = {}
		Object.assign(props, getTestProps())
		props.rows = []

		const mockStartDate = new Date().getDate() - 1
		const mockEndDate = new Date()

		let component = renderer.create(
			<DataGridScores
				{...props}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'course-title',
					searchContent: {
						searchString: 'mock-course-title',
						date: { start: mockStartDate, end: mockEndDate }
					}
				}}
			/>
		)

		// With no rows
		expect(component.toJSON()).toMatchSnapshot()

		// With at least 1 row
		props = getTestProps()
		component = renderer.create(
			<DataGridScores
				{...props}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'course-title',
					searchContent: {
						searchString: 'mock-course-title',
						date: { start: mockStartDate, end: mockEndDate }
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		// With only a text parameter (e.g. student's first name)
		component = renderer.create(
			<DataGridScores
				{...props}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'course-title',
					searchContent: {
						searchString: 'mock-course-title',
						date: { start: null, end: null }
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		// With only starting date parameter
		component = renderer.create(
			<DataGridScores
				{...props}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'course-title',
					searchContent: {
						searchString: '',
						date: { start: mockStartDate, end: null }
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		// With only ending date parameter
		component = renderer.create(
			<DataGridScores
				{...props}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'course-title',
					searchContent: {
						searchString: '',
						date: { start: null, end: mockEndDate }
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		// With only starting and ending date parameters
		component = renderer.create(
			<DataGridScores
				{...props}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'course-title',
					searchContent: {
						searchString: '',
						date: { start: mockStartDate, end: mockEndDate }
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		// With both text and date parameters.
		component = renderer.create(
			<DataGridScores
				{...props}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'course-title',
					searchContent: {
						searchString: 'mock-course-title',
						date: { start: mockStartDate, end: mockEndDate }
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		// Edge case where rows don't have the completedAt attribute
		props.rows = [
			{ draftId: 'mock-draft-id', exampleId: 'mock-example-id' },
			{ draftId: 'mock-draft-id2', exampleId: 'mock-example-id2' }
		]
		component = renderer.create(
			<DataGridScores
				{...props}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'course-title',
					searchContent: {
						searchString: 'mock-course-title',
						date: { start: mockStartDate, end: mockEndDate }
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		// Three edge cases where, if the user wants to search by student name,
		// obo will look for first and last name matches.
		component = renderer.create(
			<DataGridScores
				{...getTestProps()}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'student-name',
					searchContent: {
						searchString: 'mock-first-name mock-last-name',
						date: { start: null, end: null }
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		component = renderer.create(
			<DataGridScores
				{...getTestProps()}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'student-name',
					searchContent: {
						searchString: 'mock-first-name',
						date: { start: null, end: null }
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		component = renderer.create(
			<DataGridScores
				{...getTestProps()}
				controls={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false,
					searchBy: 'student-name',
					searchContent: {
						searchString: 'mock-last-name',
						date: { start: null, end: null }
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()
	})
})
