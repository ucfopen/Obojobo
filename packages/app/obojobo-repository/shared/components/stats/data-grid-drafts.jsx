const React = require('react')
const DataTable = require('react-data-table-component').default

const cellPreview = row => (
	<a target="_blank" rel="noreferrer" href={`/preview/${row.draftId}`}>
		Open Preview
	</a>
)

const columns = [
	{
		name: 'Draft ID',
		selector: 'draftId',
		sortable: true
	},
	{
		name: 'Title',
		selector: 'title',
		sortable: true
	},
	{
		name: 'Created At',
		selector: 'createdAt',
		sortable: true
	},
	{
		name: 'Updated At',
		selector: 'updatedAt',
		sortable: true
	},
	{
		name: 'Latest Version',
		selector: 'latestVersion',
		sortable: true
	},
	{
		name: 'Revision Count',
		selector: 'revisionCount',
		sortable: true
	},
	{
		name: 'Preview',
		cell: cellPreview
	}
]

function DataGridDrafts({ rows = [], onSelectedDraftsChanged }) {
	return (
		<div className="repository--data-grid-drafts-container">
			<DataTable
				title={`Modules (${rows.length} Results)`}
				columns={columns}
				data={rows}
				striped={true}
				keyField={'draftId'}
				dense={true}
				pagination={true}
				paginationPerPage={100}
				paginationRowsPerPageOptions={[100]}
				paginationComponentOptions={{ noRowsPerPage: true }}
				selectableRows={true}
				onSelectedRowsChange={({ selectedRows }) =>
					onSelectedDraftsChanged(selectedRows.map(row => row.draftId))
				}
			/>
		</div>
	)
}

module.exports = DataGridDrafts
