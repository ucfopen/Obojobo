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
		.addIndex('visits', 'visits_user_id_index', ['user_id'])
		.then(() => db.addIndex('visits', 'visits_draft_id_index', ['draft_id']))
}

exports.down = function(db) {
	return db
		.removeIndex('visits', 'visits_user_id_index')
		.then(() => db.removeIndex('visits', 'visits_draft_id_index'))
}

exports._meta = {
	version: 1
}
