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
	return db.dropTable('caliper_store')
}

exports.down = function(db) {
	return db
		.createTable('caliper_store', {
			id: { type: 'bigserial', primaryKey: true },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			payload: { type: 'json', notNull: true },
			is_preview: { type: Boolean }
		})
		.then(result => {
			return db.addIndex('caliper_store', 'caliper_store_created_at_index', ['created_at'])
		})
		.then(() => {
			return db.addIndex('caliper_store', 'caliper_store_is_preview', ['is_preview'])
		})
}

exports._meta = {
	version: 2
}
