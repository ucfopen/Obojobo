const db = oboRequire('db')

module.exports = insertObject => {
	return db.one(
		`
			INSERT INTO caliper_store
			(payload, is_preview)
			VALUES ($[caliperPayload], $[isPreview])
			RETURNING *`,
		insertObject
	)
}
