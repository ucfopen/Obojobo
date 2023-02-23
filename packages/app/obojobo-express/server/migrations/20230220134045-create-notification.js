'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 * yarn db:migrateup
 */
exports.setup = function(options, seedLink) {
	dbm = options.dbmigrate
	type = dbm.dataType
	seed = seedLink
}

exports.up = function(db) {
	return db
		.createTable('notification_status', {
			id: {
				type: 'bigserial',
				primaryKey: true,
				notNull: true
			},
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			user_id: { type: 'bigint', notNull: true },
			draft_id: { type: 'UUID', notNull: true },
			text: { type: 'string', notNull: true },
			title: { type: 'string', notNull: true },
			status: { type: 'boolean', notNull: true }
		})

		.then(result => {
			return db.addIndex('notification_status', 'note_user_id_index', ['user_id'])
		})
		.then(result => {
			return db.addIndex('notification_status', 'note_draft_id_index', ['draft_id'])
		})
		.then(() =>
			db.addIndex(
				'notification_status',
				'user_draft_unique_user',
				['user_id', 'draft_id'],

				true
			)
		)
}

exports.down = function(db) {
	db.dropTable('notification_status')
}

exports._meta = {
	version: 1
}
