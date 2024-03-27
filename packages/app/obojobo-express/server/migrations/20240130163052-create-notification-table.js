'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 * yarn db:migrateup
 */
exports.setup = function(options, seedLink) {
	dbm = options.dbmigrate
	type = dbm.dataType
	seed = seedLink
}

exports.up = function(db) {
	return db.createTable('notifications', {
		id: {
			type: 'bigserial',
			primaryKey: true,
			notNull: true
		},
		created_at: {
			type: 'timestamp WITH TIME ZONE',
			notNull: true,
			defaultValue: new String('now()')
		},
		text: { type: 'string', notNull: true },
		title: { type: 'string', notNull: true }
	})
}

exports.down = function(db) {
	db.dropTable('notifications')
}

exports._meta = {
	version: 1
}
