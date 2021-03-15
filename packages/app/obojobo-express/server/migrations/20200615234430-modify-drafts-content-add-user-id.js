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
	return db.addColumn('drafts_content', 'user_id', { type: 'bigint' }).then(() => {
		return db.runSql(`
			-- backfill the authors by assuming the author was the owner
			UPDATE
				drafts_content
			SET
				user_id = approximate_authors.user_id
			FROM
			(
				SELECT
					id,
					user_id
				FROM drafts
			) AS approximate_authors
			WHERE
				drafts_content.draft_id = approximate_authors.id;
		`)
	})
}

exports.down = function(db) {
	return db.removeColumn('drafts_content', 'user_id')
}

exports._meta = {
	version: 1
}
