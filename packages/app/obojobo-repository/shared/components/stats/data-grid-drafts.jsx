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
	// {
	// 	name: 'Is Owned By Me',
	// 	selector: 'isOwnedByMe',
	// 	sortable: true
	// },
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

const statsToCSV = attempts => {
	const cols = `"${columns.map(c => c.name).join('","')}"`
	const colOrder = columns.map(c => c.selector)
	const rows = attempts.map(attempt => `"${colOrder.map(key => attempt[key]).join('","')}"`)
	return `${cols}\n${rows.join('\n')}`
}

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
				paginationPerPage={4}
				selectableRows={true}
				onSelectedRowsChange={({ selectedRows }) =>
					onSelectedDraftsChanged(selectedRows.map(row => row.draftId))
				}
			/>
			<a href={`data:text/csv;charset=utf-8,${escape(statsToCSV(rows))}`} download="filename.csv">
				download
			</a>
		</div>
	)
}

module.exports = DataGridDrafts
