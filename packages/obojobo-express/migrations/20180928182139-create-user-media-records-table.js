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
	return db.createTable('media', {
		id: { type: 'UUID', primaryKey: true, defaultValue: new String('uuid_generate_v4()') },
		created_at: {
			type: 'timestamp WITH TIME ZONE',
			notNull: true,
			defaultValue: new String('now()')
		},
		user_id: { type: 'bigserial', notNull: true },
		file_name: { type: 'varchar', length: 100, notNull: true }
	})
}

exports.down = function(db) {
	return db.dropTable('media')
}

exports._meta = {
	version: 1
}
