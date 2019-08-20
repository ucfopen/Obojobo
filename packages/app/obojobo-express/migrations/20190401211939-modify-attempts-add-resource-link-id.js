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
		.addColumn('attempts', 'resource_link_id', {
			type: 'varchar'
		})
		.then(() => db.addIndex('attempts', 'attempts_resource_link_id', ['resource_link_id']))
		.then(() => {
			// backfill resource_link_id
			return db.runSql(`
				-- make a table with with start and end time windows for each launch
					CREATE TEMP TABLE tmp_launch_windows AS
						SELECT * FROM (
							select
								id as launch_id,
								draft_id,
								draft_content_id,
								user_id,
								data ->> 'resource_link_id' as rlid,
								created_at as start_date,
								CASE
									WHEN lead(user_id) over wnd = user_id
										AND lead(data ->> 'resource_link_id') over wnd = data ->> 'resource_link_id'
									THEN lead(created_at) over wnd
									ELSE now()
								END as end_date,
								CASE
									WHEN lead(user_id) over wnd = user_id
										AND lead(data ->> 'resource_link_id') over wnd = data ->> 'resource_link_id'
									THEN lead(id) over wnd
									ELSE null
								END as next_launch_id
								FROM launches
								WHERE data ->> 'resource_link_id' IS NOT null
								WINDOW wnd as (
									PARTITION BY data ->> 'resource_link_id', user_id ORDER BY data ->> 'resource_link_id', user_id, created_at
								)
						) as foo;

				-- use the temp table to copy data
				UPDATE
					attempts
				SET
					resource_link_id = approximate_rlids.rlid
				FROM
				(
					SELECT
						attempts.id as attempt_id,
						rlid
					FROM attempts
					JOIN tmp_launch_windows
						ON attempts.draft_content_id = tmp_launch_windows.draft_content_id
						AND attempts.user_id = tmp_launch_windows.user_id
					WHERE
						attempts.is_preview = false
						AND attempts.created_at
							BETWEEN
								tmp_launch_windows.start_date
							AND
								tmp_launch_windows.end_date
				) AS approximate_rlids
				WHERE
					attempts.id = approximate_rlids.attempt_id;

				-- remove the tmp table
				Drop table tmp_launch_windows;
			`)
		})
		.then(() => {
			// resource_link_id is now set to 'preview' in preview mode
			return db.runSql(`
				UPDATE attempts
				SET resource_link_id = 'preview'
				WHERE resource_link_id IS null
				AND is_preview = true
			`)
		})
		.then(() => {
			// resource_link_id is now set to 'preview' in preview mode
			return db.runSql(`
				UPDATE visits
				SET resource_link_id = 'preview'
				WHERE resource_link_id IS null
				AND is_preview = true
			`)
		})
}

exports.down = function(db) {
	return db.removeIndex('attempts', 'attempts_resource_link_id', ['resource_link_id']).then(() =>
		db.removeColumn('attempts', 'resource_link_id', {
			type: 'varchar'
		})
	)
}

exports._meta = {
	version: 1
}
