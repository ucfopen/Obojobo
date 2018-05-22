'use strict'

var dbm
var type
var seed

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
			.addColumn('assessment_scores', 'draft_content_id', {
				type: 'UUID'
			})
			// Grab all the current records, which will not have draft_content_ids
			.then(() => {
				return db.runSql(`
					SELECT
						id,
						draft_id,
						created_at
					FROM assessment_scores
				`)
			})
			// Find the correct UUID for each record
			.then(result => {
				let updates = []
				result.rows.forEach(row => {
					let draftId = row.draft_id
					let created = row.created_at
					let rowId = row.id

					updates.push(`
						UPDATE
							assessment_scores
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
							assessment_scores.id=${rowId}
					`)
				})
				updates = updates.join(';')
				return db.runSql(updates)
			})
			// Require notNull after content has all been filled out
			.then(result => {
				return db.changeColumn('assessment_scores', 'draft_content_id', {
					type: 'UUID',
					notNull: true
				})
			})
	)
}

exports.down = function(db) {
	return db.removeColumn('assessment_scores', 'draft_content_id')
}

exports._meta = {
	version: 1
}
