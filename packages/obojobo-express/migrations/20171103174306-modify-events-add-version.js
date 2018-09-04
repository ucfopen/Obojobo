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
		.addColumn('events', 'version', {
			type: 'varchar',
			length: 10
		})
		.then(result => {
			return db.addIndex('events', 'events_version', ['version'])
		})
		.then(result => {
			return db.runSql("UPDATE events SET version='1.0.0' WHERE TRUE")
		})
		.then(result => {
			return db.changeColumn('events', 'version', {
				notNull: true
			})
		})
}

exports.down = function(db) {
	return db.removeIndex('events', 'events_version').then(result => {
		return db.removeColumn('events', 'version')
	})
}

exports._meta = {
	version: 1
}
