const React = require('react')
const DataTable = require('react-data-table-component').default
const ButtonLink = require('../button-link')

const getColumns = (columns, showAdvancedFields) =>
	showAdvancedFields ? columns : columns.filter(col => !col.advanced)

const toCSV = (columns, attempts) => {
	const cols = `"${columns.map(c => c.name).join('","')}"`
	const colOrder = columns.map(c => c.selector)
	const rows = attempts.map(attempt => `"${colOrder.map(key => attempt[key]).join('","')}"`)
	return `${cols}\n${rows.join('\n')}`
}

const getFileName = (
	csvFileName,
	attempts,
	{ showIncompleteAttempts, showPreviewAttempts, showAdvancedFields }
) => {
	const drafts = [...new Set(attempts.map(row => row.draftId))]

	return (
		[
			csvFileName,
			showIncompleteAttempts ? 'with-incomplete-attempts' : '',
			showPreviewAttempts ? 'with-preview-attempts' : '',
			showAdvancedFields ? 'with-advanced-fields' : ''
		]
			.filter(s => s)
			.join('-') +
		'__' +
		drafts.join('_')
	)
}

const getTableName = (tableName, { showIncompleteAttempts, showPreviewAttempts }) => {
	if (showIncompleteAttempts && showPreviewAttempts) {
		return tableName + ' (including incomplete and preview attempts)'
	} else if (showIncompleteAttempts) {
		return tableName + ' (including incomplete attempts)'
	} else if (showPreviewAttempts) {
		return tableName + ' (including preview attempts)'
	}

	return tableName
}

function DataGridScores({ columns, rows = [], tableName, csvFileName, filterSettings }) {
	const filteredColumns = getColumns(columns, filterSettings.showAdvancedFields)

	return (
		<div className="repository--data-grid-scores">
			<div className="data-grid">
				<DataTable
					title={getTableName(tableName, filterSettings)}
					columns={filteredColumns}
					data={rows}
					striped={true}
					keyField={'attemptId'}
					dense={true}
				/>
			</div>
			{rows.length > 0 ? (
				<ButtonLink
					url={`data:text/csv;charset=utf-8,${escape(toCSV(filteredColumns, rows))}`}
					download={getFileName(csvFileName, rows, filterSettings)}
				>
					⬇️&nbsp;&nbsp;&nbsp;Download Table as CSV File ({rows.length} row
					{rows.length === 1 ? '' : 's'})
				</ButtonLink>
			) : null}
		</div>
	)
}

module.exports = DataGridScores
