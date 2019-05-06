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
		.addColumn('attempts', 'resource_link_id', {
			type: 'varchar'
		})
		.then(() => db.addIndex('attempts', 'attempts_resource_link_id', ['resource_link_id']))
}

exports.down = function(db) {
	return db.removeIndex('attempts', 'attempts_resource_link_id', ['resource_link_id']).then(() =>
		db.removeColumn('attempts', 'resource_link_id', {
			type: 'varchar'
		})
	)
}

exports._meta = {
	version: 1
}
