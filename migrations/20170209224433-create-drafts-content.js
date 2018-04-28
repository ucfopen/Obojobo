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
		.createTable('drafts_content', {
			id: { type: 'bigserial', primaryKey: true },
			draft_id: { type: 'UUID', notNull: true },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			content: { type: 'jsonb' }
		})
		.then(result => {
			return db.addIndex('drafts_content', 'drafts_content_revision_index', [
				'draft_id',
				'created_at'
			])
		})
		.then(result => {
			return db.addIndex('drafts_content', 'drafts_content_created_at_index', ['created_at'])
		})
}

exports.down = function(db) {
	return db.dropTable('drafts_content')
}

exports._meta = {
	version: 1
}
