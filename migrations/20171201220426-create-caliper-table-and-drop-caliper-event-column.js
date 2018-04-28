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
		.createTable('caliper_store', {
			id: { type: 'bigserial', primaryKey: true },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			payload: { type: 'json', notNull: true }
		})
		.then(result => {
			return db.addIndex('caliper_store', 'caliper_store_created_at_index', ['created_at'])
		})
		.then(result => {
			return db.removeColumn('events', 'caliper_payload')
		})
}

exports.down = function(db) {
	return db
		.addColumn('events', 'caliper_payload', {
			type: 'json'
		})
		.then(result => {
			db.dropTable('caliper_store')
		})
}

exports._meta = {
	version: 2
}
