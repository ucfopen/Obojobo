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
		.createTable('drafts_metadata', {
			draft_id: {
				type: 'UUID',
				notNull: true,
				defaultValue: new String('uuid_generate_v4()')
			},
			key: {
				type: 'varchar',
				length: 50,
				notNull: true
			},
			value: {
				type: 'varchar',
				length: 50,
				notNull: true
			},
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			updated_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			}
		})
		.then(() => {
			return db.addIndex('drafts_metadata', 'draft_id_key', ['draft_id', 'key'], true)
		})
}

exports.down = function(db) {
	return db.dropTable('drafts_metadata')
}

exports._meta = {
	version: 1
}
