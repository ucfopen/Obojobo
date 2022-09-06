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
	return db.createTable('user_perms', {
		user_id: { type: 'bigserial', primaryKey: true },
		perms: { type: 'text[]' }
	})
}

exports.down = function(db) {
	return db.dropTable('user_perms')
}

exports._meta = {
	version: 1
}
