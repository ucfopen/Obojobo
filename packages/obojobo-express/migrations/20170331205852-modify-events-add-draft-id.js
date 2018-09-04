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
		.addColumn('events', 'draft_id', {
			type: 'UUID'
		})
		.then(result => {
			return db.addIndex('events', 'events_draft_id', ['draft_id'])
		})
}

exports.down = function(db) {
	return db.removeIndex('events', 'events_draft_id').then(result => {
		return db.removeColumn('events', 'draft_id')
	})
}

exports._meta = {
	version: 1
}
