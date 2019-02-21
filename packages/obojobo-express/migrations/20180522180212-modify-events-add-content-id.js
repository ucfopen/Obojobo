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
	return (
		db
			.addColumn('events', 'draft_content_id', {
				type: 'UUID'
			})
			// Grab all the current records, which will not have draft_content_ids
			.then(() => {
				return db.runSql(`
					-- make a table with content id's and start/end dates that apply to it
					CREATE TEMP TABLE tmp_dates AS
					SELECT * FROM (
						SELECT
							id,
							draft_id,
							created_at,
							CASE
								WHEN lead(draft_id) over wnd = draft_id
								THEN lead(created_at) over wnd
								ELSE now()
							END AS end_date
						FROM drafts_content
						WINDOW wnd AS (
							PARTITION BY draft_id ORDER BY draft_id, created_at asc
						)
					) AS S;

					-- use the temp table to copy data
					UPDATE
						events
					SET
						draft_content_id=DC.draft_content_id
					FROM
					(
						SELECT
							e.id AS event_id,
							d.id AS draft_content_id
						FROM events AS e
						LEFT JOIN tmp_dates AS d
							ON d.draft_id = e.draft_id
							AND  d.created_at < e.created_at
							AND  d.end_date > e.created_at
						WHERE e.draft_id IS NOT null
					) AS DC
					WHERE
						events.id=event_id
						AND events.draft_id IS NOT null;

					-- remove the tmp table
					Drop table tmp_dates;
				`)
			})
	)
}

exports.down = function(db) {
	return db.removeColumn('events', 'draft_content_id')
}

exports._meta = {
	version: 1
}
