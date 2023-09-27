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
		.createTable('external_tool_data', {
			id: { type: 'bigserial', primaryKey: true },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			payload: { type: 'jsonb' },
			user_id: { type: 'bigint', notNull: true },
			visit_id: { type: 'UUID', notNull: true },
			draft_content_id: { type: 'UUID', notNull: true },
			node_id: { type: 'UUID', notNull: true }
		})
		.then(result => {
			return db.addIndex('external_tool_data', 'external_tool_data_user_id_index', ['user_id'])
		})
		.then(result => {
			return db.addIndex('external_tool_data', 'external_tool_data_visit_id_index', ['visit_id'])
		})
		.then(result => {
			return db.addIndex('external_tool_data', 'external_tool_data_draft_content_id_index', [
				'draft_content_id'
			])
		})
		.then(result => {
			return db.addIndex('external_tool_data', 'external_tool_data_node_id_index', ['node_id'])
		})
}

exports.down = function(db) {
	return db.dropTable('external_tool_data')
}

exports._meta = {
	version: 1
}
