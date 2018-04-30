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
		.createTable('events', {
			id: { type: 'bigserial', primaryKey: true },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			actor_time: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			action: { type: 'varchar', length: 100 },
			actor: { type: 'varchar', length: 100 },
			ip: { type: 'varchar', length: 50 },
			metadata: { type: 'jsonb' },
			payload: { type: 'jsonb' }
		})
		.then(result => {
			return db.addIndex('events', 'events_created_at_index', ['created_at'])
		})
		.then(result => {
			return db.addIndex('events', 'events_actor_time_index', ['actor_time'])
		})
		.then(result => {
			return db.addIndex('events', 'events_action_index', ['action'])
		})
		.then(result => {
			return db.addIndex('events', 'events_actor_index', ['actor'])
		})
}

exports.down = function(db) {
	return db.dropTable('events')
}

exports._meta = {
	version: 1
}
