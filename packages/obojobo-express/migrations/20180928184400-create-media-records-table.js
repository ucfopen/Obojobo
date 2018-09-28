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
	return db.createTable('media_records', {
		id: { type: 'UUID', primaryKey: true },
		created_at: {
			type: 'timestamp WITH TIME ZONE',
			notNull: true,
			defaultValue: new String('now()')
		},
		record_id: { type: 'UUID', notNull: true },
		media_id: { type: 'UUID', notNull: true }
	})
}

exports.down = function(db) {
	return db.dropTable('media_records')
}

exports._meta = {
	version: 1
}
