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
		.addColumn('events', 'visit_id', {
			type: 'UUID'
		})
		.then(() => {
			return db.addIndex('events', 'events_visit_id', ['visit_id'])
		})
}

exports.down = function(db) {
	return db.removeIndex('events', 'events_visit_id').then(() => {
		return db.removeColumn('events', 'visit_id')
	})
}

exports._meta = {
	version: 1
}
