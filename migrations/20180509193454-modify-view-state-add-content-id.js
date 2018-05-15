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
		.addColumn('view_state', 'draft_content_id', {
			type: 'UUID',
			notNull: true
		})
		.then(result => {
			return db.removeIndex('view_state', 'user_draft_unique', ['user_id', 'draft_id'], true)
		})
		.then(result => {
			return db.addIndex('view_state', 'user_draft_unique', ['user_id', 'draft_content_id'], true)
		})
}

exports.down = function(db) {
	return db.removeColumn('view_state', 'draft_content_id').then(result => {
		return db.addIndex('view_state', 'user_draft_unique', ['user_id', 'draft_id'], true)
	})
}

exports._meta = {
	version: 1
}
