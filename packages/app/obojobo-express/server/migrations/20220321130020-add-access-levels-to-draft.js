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
		.addColumn('repository_map_user_to_draft', 'access_level', {
			type: 'int',
			notNull: true,
			defaultValue: 1
		})
		.then(() => {
			return db.addIndex('repository_map_user_to_draft', 'user_access_level_index', [
				'access_level'
			])
		})
}

exports.down = function(db) {
	return db
		.removeIndex('repository_map_user_to_draft', 'user_access_level_index')
		.then(() => db.removeColumn('repository_map_user_to_draft', 'access_level'))
}

exports._meta = {
	version: 1
}
