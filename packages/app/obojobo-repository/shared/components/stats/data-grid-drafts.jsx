const React = require('react')
const DataTable = require('react-data-table-component').default

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
	}
]

function DataGridDrafts({ rows = [], onSelectedDraftsChanged }) {
	return (
		<div>
			<DataTable
				columns={columns}
				data={rows}
				striped={true}
				keyField={'draftId'}
				dense={true}
				pagination={true}
				selectableRows={true}
				onSelectedRowsChange={({ selectedRows }) =>
					onSelectedDraftsChanged(selectedRows.map(row => row.draftId))
				}
			/>
		</div>
	)
}

module.exports = DataGridDrafts
