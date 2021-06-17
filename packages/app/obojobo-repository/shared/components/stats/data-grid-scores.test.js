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
			{ draftId: 'mock-draft-id', exampleId: 'mock-example-id' },
			{ draftId: 'mock-draft-id2', exampleId: 'mock-example-id2' }
		],
		tableName: 'Mock Table Name',
		csvFileName: 'mock-csv-file-name',
		filterSettings: {
			showIncompleteAttempts: false,
			showPreviewAttempts: false,
			showAdvancedFields: false
		}
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
					filterSettings={{ showIncompleteAttempts, showPreviewAttempts, showAdvancedFields }}
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
					filterSettings={{
						showIncompleteAttempts,
						showPreviewAttempts,
						showAdvancedFields: false
					}}
				/>
			)

			expect(
				component.root.findByProps({ className: 'react-data-table-component' }).props.title
			).toBe(expectedTableName)
		}
	)

	test('showAdvancedFields works as expected', () => {
		const component1 = renderer.create(
			<DataGridScores
				{...getTestProps()}
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
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
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: true
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
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
			/>
		)

		expect(component1.root.findByType('a').props.href).toMatchSnapshot()

		const component2 = renderer.create(
			<DataGridScores
				{...getTestProps()}
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: true
				}}
			/>
		)

		expect(component2.root.findByType('a').props.href).toMatchSnapshot()
	})

	test('DataGridScores renders when no rows given', () => {
		const component = renderer.create(
			<DataGridScores
				columns={[]}
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
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
})
