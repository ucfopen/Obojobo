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
	return db.createTable('red_alert_status', {
		id: { type: 'int', primaryKey: true, autoIncrement: true },
		user_id: { type: 'bigint', unique: true },
		draft_id: { type: 'UUID', unique: true },
		creation_time: 'timestamp',
		red_alert: 'boolean'
	})
}

exports.down = function(db) {
	return null
}

exports._meta = {
	version: 1
}
