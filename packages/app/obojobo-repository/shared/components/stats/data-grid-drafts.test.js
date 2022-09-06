import React from 'react'
import renderer from 'react-test-renderer'
import DataGridDrafts from './data-grid-drafts'

jest.mock('react-data-table-component', () => ({
	default: props => (
		<div {...props} className="react-data-table-component">
			react-data-table-component
		</div>
	)
}))

describe('DataGridDrafts', () => {
	test('DataGridDrafts renders correctly with no rows', () => {
		const component = renderer.create(<DataGridDrafts onSelectedDraftsChanged={jest.fn()} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('DataGridDrafts renders correctly with rows', () => {
		const component = renderer.create(
			<DataGridDrafts
				rows={[
					{
						draftId: 'mock-draft-id',
						title: 'mock-title',
						createdAt: 'mock-created-at',
						updatedAt: 'mock-updated-at',
						latestVersion: 'mock-latest-version',
						revisionCount: 'revision-count'
					}
				]}
				onSelectedDraftsChanged={jest.fn()}
			/>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('onSelectedDraftsChanged called with expected values', () => {
		const onSelectedDraftsChanged = jest.fn()
		const component = renderer.create(
			<DataGridDrafts onSelectedDraftsChanged={onSelectedDraftsChanged} />
		)

		component.root
			.findByProps({ className: 'react-data-table-component' })
			.props.onSelectedRowsChange({
				selectedRows: [{ draftId: 'draft-id-1' }, { draftId: 'draft-id-2' }]
			})

		expect(onSelectedDraftsChanged).toHaveBeenCalledWith(['draft-id-1', 'draft-id-2'])
	})

	test('Preview cell renders as expected', () => {
		const component = renderer.create(
			<DataGridDrafts
				rows={[
					{
						draftId: 'mock-draft-id',
						title: 'mock-title',
						createdAt: 'mock-created-at',
						updatedAt: 'mock-updated-at',
						latestVersion: 'mock-latest-version',
						revisionCount: 'revision-count'
					}
				]}
				onSelectedDraftsChanged={jest.fn()}
			/>
		)

		const cols = component.root.findByProps({ className: 'react-data-table-component' }).props
			.columns
		const cellPreview = cols[cols.length - 1].cell

		const cellPreviewComponent = renderer.create(cellPreview({ draftId: 'mock-draft-id' }))
		const tree = cellPreviewComponent.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
