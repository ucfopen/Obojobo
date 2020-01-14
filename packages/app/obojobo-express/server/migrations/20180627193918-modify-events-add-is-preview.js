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
	return db
		.addColumn('events', 'is_preview', {
			type: 'boolean'
		})
		.then(() => {
			return db.addIndex('events', 'events_is_preview', ['is_preview'])
		})
}

exports.down = function(db) {
	return db.removeIndex('events', 'events_is_preview').then(() => {
		return db.removeColumn('events', 'is_preview')
	})
}

exports._meta = {
	version: 1
}
