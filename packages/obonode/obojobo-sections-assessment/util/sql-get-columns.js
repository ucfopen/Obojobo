
const sqlGetColumns = (table, exceptColumns) => {
	const sqlExceptColumns = exceptColumns ?
		`AND c.column_name NOT IN(${exceptColumns.map(n => `'${n}'`)})`
		: ''

	return `SELECT array_to_string(
		ARRAY(
			SELECT c.column_name::VARCHAR
			FROM information_schema.columns As c
			WHERE table_name = '${table}'
			${sqlExceptColumns}
		),
		', '
	) AS columns`
}

module.exports = sqlGetColumns
