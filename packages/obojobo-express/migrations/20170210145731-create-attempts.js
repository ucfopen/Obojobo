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
		.createTable('attempts', {
			id: { type: 'UUID', primaryKey: true, defaultValue: new String('uuid_generate_v4()') },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			updated_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			completed_at: { type: 'timestamp WITH TIME ZONE', notNull: false },
			user_id: { type: 'bigint', notNull: true },
			draft_id: { type: 'UUID', notNull: true },
			assessment_id: { type: 'varchar', length: 100 },
			state: { type: 'jsonb' },
			result: { type: 'jsonb' }
		})
		.then(result => {
			return db.addIndex('attempts', 'attempts_user_id_index', ['user_id'])
		})
		.then(result => {
			return db.addIndex('attempts', 'attempts_assessment_id_index', ['assessment_id'])
		})
		.then(result => {
			return db.addIndex('attempts', 'attempts_draft_id_index', ['draft_id'])
		})
		.then(result => {
			return db.addIndex('attempts', 'attempts_created_at_index', ['created_at'])
		})
}

exports.down = function(db) {
	return db.dropTable('attempts')
}

exports._meta = {
	version: 1
}
