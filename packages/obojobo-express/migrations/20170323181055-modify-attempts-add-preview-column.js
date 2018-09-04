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
		.addColumn('attempts', 'preview', {
			type: 'boolean',
			notNull: true,
			defaultValue: false
		})
		.then(result => {
			return db.addIndex('attempts', 'attempts_preview', ['preview'])
		})
}

exports.down = function(db) {
	return db.removeIndex('attempts', 'attempts_preview').then(result => {
		return db.removeColumn('attempts', 'preview')
	})
}

exports._meta = {
	version: 1
}
