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
	return db.createTable('binaries', {
		id: { type: 'UUID', primaryKey: true, defaultValue: new String('uuid_generate_v4()') },
		created_at: {
			type: 'timestamp WITH TIME ZONE',
			notNull: true,
			defaultValue: new String('now()')
		},
		blob: { type: 'bytea', notNull: true },
		file_size: { type: 'int', notNull: true },
		mime_type: { type: 'varchar', length: 25, notNull: true }
	})
}

exports.down = function(db) {
	return db.dropTable('binaries')
}

exports._meta = {
	version: 1
}
