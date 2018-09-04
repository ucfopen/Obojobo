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
		.createTable('visits', {
			id: { type: 'UUID', primaryKey: true, defaultValue: new String('uuid_generate_v4()') },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			user_id: { type: 'bigint', notNull: true },
			draft_content_id: { type: 'bigint', notNull: true },
			draft_id: { type: 'UUID', notNull: true },
			launch_id: { type: 'bigint' },
			resource_link_id: { type: 'varchar' },
			is_active: {
				type: 'boolean',
				notNull: true,
				defaultValue: false
			},
			is_preview: { type: 'boolean', notNull: true }
		})
		.then(result => {
			return db.addIndex('visits', 'visits_unique_visit', ['user_id', 'draft_id', 'is_active'])
			return db.addIndex('visits', 'visits_user_id_index', ['user_id'])
			return db.addIndex('visits', 'visits_draft_id_index', ['draft_id'])
		})
}

exports.down = function(db) {
	return db.dropTable('visits')
}

exports._meta = {
	version: 2
}
