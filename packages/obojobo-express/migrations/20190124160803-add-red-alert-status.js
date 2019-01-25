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
	return db
		.createTable('red_alert_status', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			user_id: 'bigint',
			draft_id: 'UUID',
			creation_time: 'timestamp',
			red_alert: 'boolean'
		})
		.then(result => {
			return db.addIndex('red_alert_status', 'user_draft_unique', ['user_id', 'draft_id'], true)
		})
}

exports.down = function(db) {
	return db.dropTable('red_alert_status')
}

exports._meta = {
	version: 1
}
