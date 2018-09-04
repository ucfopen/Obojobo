'use strict'

let dbm
let type
let seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
	dbm = options.dbmigrate
	type = dbm.dataType
	seed = seedLink
}

exports.up = function(db) {
	// The UUID will temporarily allow null
	return (
		db
			.addColumn('events', 'draft_content_id', {
				type: 'UUID'
			})
			// Grab all the current records, which will not have draft_content_ids
			.then(() => {
				return db.runSql(`
					SELECT
						id,
						draft_id,
						created_at
					FROM events
				`)
			})
			// Find the correct UUID for each record
			.then(result => {
				let updates = []
				result.rows.forEach(row => {
					const draftId = row.draft_id
					const created = row.created_at
					const rowId = row.id

					updates.push(`
						UPDATE
							events
						SET
							draft_content_id=content.id
						FROM
						(
							SELECT
								id
							FROM
								drafts_content
							WHERE
								draft_id='${draftId}'
								AND created_at<='${created.toISOString()}'
							ORDER BY
								created_at DESC
							LIMIT 1
						) content
						WHERE
							events.id=${rowId}
					`)
				})
				updates = updates.join(';')
				return db.runSql(updates)
			})
	)
}

exports.down = function(db) {
	return db.removeColumn('events', 'draft_content_id')
}

exports._meta = {
	version: 1
}
