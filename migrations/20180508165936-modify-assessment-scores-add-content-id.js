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
				;`
			SELECT
				id,
				draft_id,
				created_at,
			FROM assessment_scores
		`
			})
			// Find the correct UUID for each record - latest for ease, youngest-before for correctness
			.then(result => {
				let updates = []
				result.rows.forEach(row => {
					let draftId = row.draft_id
					let created = row.created_at
					let rowId = row.id

					// youngest before
					updates.push(`
				UPDATE
					assessment_scores
				SET
					draft_content_id=draft_content.draft_content_id
				FROM (
					SELECT
						draft_content_id
					FROM
						drafts_content
					WHERE
						draft_id=${draftId}
						AND created_at<=${created}
					ORDER BY
						created_at DESC
					LIMIT 1
				) AS draft_content
				WHERE
					id=${rowId}
			`)

					// latest
					/*
			updates.push(`
				UPDATE
					assessment_scores
				SET
					draft_content_id=draft_content.draft_content_id
				FROM (
					SELECT
						draft_content_id
					FROM
						drafts_content
					WHERE
						draft_id=${draftId}
					ORDER BY
						created_at DESC
					LIMIT 1
				) AS draft_content
				WHERE
					id=${rowId}
			`)
			*/
				})
				updates = updates.join(';')
				db.runSQL(updates)
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
