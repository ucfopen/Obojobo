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
	return db.addColumn('events', 'draft_content_id', {
		type: 'UUID'
	})
}

exports.down = function(db) {
	return db.removeColumn('events', 'draft_content_id')
}

exports._meta = {
	version: 1
}
