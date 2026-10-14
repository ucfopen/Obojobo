const React = require('react')
const Spinner = require('../spinner')
const ButtonLink = require('../button-link')
const DataTable = require('react-data-table-component').default
const { convertHyphenBasedStringToCamelCase, equals } = require('../../util/misc-stats-util')

const getColumns = (columns, showAdvancedFields) =>
	showAdvancedFields ? columns : columns.filter(col => !col.advanced)

const toCSV = (columns, attempts) => {
	const cols = `"${columns.map(c => c.name).join('","')}"`
	const colOrder = columns.map(c => c.selector)
	const rows = attempts.map(
		attempt =>
			`"${colOrder.map(key => (attempt[key] === null ? 'null' : attempt[key])).join('","')}"`
	)
	return `${cols}\n${rows.join('\n')}`
}

const getFileName = (csvFileName, attempts, controls) => {
	const drafts = [...new Set(attempts.map(row => row.draftId))]

	return (
		[
			csvFileName,
			controls.showIncompleteAttempts ? 'with-incomplete-attempts' : '',
			controls.showPreviewAttempts ? 'with-preview-attempts' : '',
			controls.showAdvancedFields ? 'with-advanced-fields' : ''
		]
			.filter(s => s)
			.join('-') +
		'__' +
		drafts.join('_')
	)
}

const getTableName = (tableName, controls) => {
	if (controls.showIncompleteAttempts && controls.showPreviewAttempts) {
		return tableName + ' (including incomplete and preview attempts)'
	} else if (controls.showIncompleteAttempts) {
		return tableName + ' (including incomplete attempts)'
	} else if (controls.showPreviewAttempts) {
		return tableName + ' (including preview attempts)'
	}

	return tableName
}

const searchDataBasedOnParams = (rows, controls) => {
	const searchContent = controls.searchContent

	const text = searchContent.searchString
	const dates = searchContent.date

	if (rows && rows.length > 0) {
		// Filtering according to starting and ending dates.
		if (dates) {
			rows = rows.filter(row => {
				if (!row.completedAt) return row.completedAt
				const dateCompleted = new Date(row.completedAt)
				const start = dates.start ? new Date(dates.start) : null
				const end = dates.end ? new Date(dates.end) : null

				if (!start && !end) return row
				if (!start) return dateCompleted <= end
				if (!end) return dateCompleted >= start

				return dateCompleted >= start && dateCompleted <= end
			})
		}

		if (text) {
			let param = convertHyphenBasedStringToCamelCase(controls.searchBy)

			// Filtering according to search params (course title, student name, etc)
			const processedText = text.toLowerCase().trim()

			if (param === 'studentName') {
				rows = rows.filter(row => {
					return (
						row[param].toLowerCase().trim() &&
						(row.userFirstName.toLowerCase().match(processedText) ||
							row.userLastName.toLowerCase().match(processedText) ||
							row.studentName.toLowerCase().match(processedText))
					)
				})
			} else {
				rows = rows.filter(row => {
					return row[param] && row[param].toLowerCase().match(processedText)
				})
			}
		}
	}
	return rows
}

function DataGridScores({
	columns,
	rows = [],
	tableName,
	csvFileName,
	controls,
	filteredRows,
	setFilteredRows,
	isDebouncing
}) {
	const filteredColumns = getColumns(columns, controls.showAdvancedFields)
	rows = searchDataBasedOnParams(rows, controls)

	React.useEffect(() => {
		if (rows && rows.length > 0 && !equals(rows, filteredRows)) setFilteredRows(rows)
	}, [rows])

	const tn = getTableName(tableName, controls)
	const tableHeaderClassName = 'data-table-header ' + tn

	const tableHeader = (
		<div className={tableHeaderClassName}>
			<p>{tn}</p>
			{/* $color-action */}
			{isDebouncing && <Spinner color="#6714bd" />}
		</div>
	)

	return (
		<div className="repository--data-grid-scores">
			<div className="data-grid">
				<DataTable
					title={tableHeader}
					columns={filteredColumns}
					data={rows}
					striped={true}
					dense={true}
					pagination={true}
					paginationPerPage={250}
					paginationRowsPerPageOptions={[250]}
					paginationComponentOptions={{ noRowsPerPage: true }}
				/>
			</div>
			{rows.length > 0 ? (
				<ButtonLink
					url={`data:text/csv;charset=utf-8,${escape(toCSV(filteredColumns, rows))}`}
					download={getFileName(csvFileName, rows, controls)}
				>
					⬇️&nbsp;&nbsp;&nbsp;Download {controls.showAdvancedFields ? 'Advanced' : ''} Table as CSV
					File ({rows.length} row
					{rows.length === 1 ? '' : 's'})
				</ButtonLink>
			) : null}
		</div>
	)
}

module.exports = DataGridScores
