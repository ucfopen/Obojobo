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
		.addColumn('caliper_store', 'is_preview', {
			type: 'boolean',
			notNull: true
		})
		.then(result => {
			return db.addIndex('caliper_store', 'caliper_store_is_preview', ['is_preview'])
		})
}

exports.down = function(db) {
	return db.removeIndex('caliper_store', 'caliper_store_is_preview').then(result => {
		return db.removeColumn('caliper_store', 'is_preview')
	})
}

exports._meta = {
	version: 1
}
