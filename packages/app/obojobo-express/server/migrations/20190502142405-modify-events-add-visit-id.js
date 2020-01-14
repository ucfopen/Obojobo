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
	return db
		.addColumn('events', 'visit_id', {
			type: 'UUID'
		})
		.then(() => {
			return db.addIndex('events', 'events_visit_id', ['visit_id'])
		})
		.then(() => {
			// backfill visit_ids
			return db.runSql(`
				-- make a table with with start and end time windows for each launch
					CREATE TEMP TABLE tmp_visit_windows AS
						SELECT * FROM (
							select
								id as visit_id,
								draft_id,
								draft_content_id,
								user_id,
								created_at as start_date,
								CASE
									WHEN lead(user_id) over wnd = user_id AND lead(draft_content_id) over wnd = draft_content_id
									THEN lead(created_at) over wnd
									ELSE now()
								END as end_date,
								CASE
									WHEN lead(user_id) over wnd = user_id AND lead(draft_content_id) over wnd = draft_content_id
									THEN lead(id) over wnd
									ELSE null
								END as next_visit_id
								FROM visits
								WINDOW wnd as (
									PARTITION BY draft_content_id, user_id ORDER BY draft_content_id, user_id, created_at
								)
						) as foo;

				-- use the temp table to copy data
				UPDATE
					events
				SET
					visit_id = approximate_visits.visit_id
				FROM
				(
					SELECT
						events.id as event_id,
						tmp_visit_windows.visit_id
					FROM events
					JOIN tmp_visit_windows
						ON events.draft_content_id = tmp_visit_windows.draft_content_id
						AND events.actor::BIGINT = tmp_visit_windows.user_id
					WHERE
						events.created_at BETWEEN tmp_visit_windows.start_date AND tmp_visit_windows.end_date
				) AS approximate_visits
				WHERE
					events.id = approximate_visits.event_id;

				-- remove the tmp table
				Drop table tmp_visit_windows;
			`)
		})
}

exports.down = function(db) {
	return db.removeIndex('events', 'events_visit_id').then(() => {
		return db.removeColumn('events', 'visit_id')
	})
}

exports._meta = {
	version: 1
}
