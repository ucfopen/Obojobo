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
		.dropTable('view_state')
		.then(result => {
			return db.createTable('view_state', {
				id: {
					type: 'bigserial',
					primaryKey: true
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
				},
				user_id: { type: 'bigint', notNull: true },
				draft_id: {
					type: 'UUID',
					notNull: true
				},
				payload: { type: 'jsonb' }
			})
		})
		.then(result => {
			return db.addIndex('view_state', 'user_draft_unique', ['user_id', 'draft_id'], true)
		})
		.then(result => {
			return db.addIndex('view_state', 'view_state_user_id_index', ['user_id'])
		})
		.then(result => {
			return db.addIndex('view_state', 'view_state_updated_at_index', ['updated_at'])
		})
}

exports.down = function(db) {
	return db.dropTable('view_state').then(result => {
		return db
			.createTable('view_state', {
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
				user_id: { type: 'bigint', notNull: true },
				metadata: { type: 'jsonb' },
				payload: { type: 'jsonb' }
			})
			.then(result => {
				return db.addIndex('view_state', 'view_state_user_id_index', ['user_id'])
			})
			.then(result => {
				return db.addIndex('view_state', 'view_state_updated_at_index', ['updated_at'])
			})
	})
}

exports._meta = {
	version: 2
}
