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
		.addColumn('view_state', 'resource_link_id', {
			type: 'varchar'
		})
		.then(() =>
			db.removeIndex('view_state', 'user_content_unique', ['user_id', 'draft_content_id'])
		)
		.then(() =>
			db.addIndex(
				'view_state',
				'user_content_unique',
				['user_id', 'draft_content_id', 'resource_link_id'],
				true
			)
		)
}

exports.down = function(db) {
	return db
		.removeIndex('view_state', 'user_content_unique', [
			'user_id',
			'draft_content_id',
			'resource_link_id'
		])
		.then(() =>
			db.addIndex('view_state', 'user_content_unique', ['user_id', 'draft_content_id'], true)
		)
		.then(() =>
			db.removeColumn('view_state', 'resource_link_id', {
				type: 'varchar'
			})
		)
}

exports._meta = {
	version: 1
}
