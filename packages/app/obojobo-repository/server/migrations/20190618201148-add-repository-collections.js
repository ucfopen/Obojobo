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
		.createTable('repository_collections', {
			id: {
				type: 'UUID',
				primaryKey: true,
				defaultValue: new String('uuid_generate_v4()')
			},
			title: { type: 'varchar', length: 100 },
			group_type: { type: 'varchar', length: 20, notNull: true },
			user_id: { type: 'bigint', notNull: false },
			// parent_group_id: { type: 'UUID', notNull: false },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			}
			// options: { type: 'jsonb' }
		})
		.then(result => {
			return db.addIndex('repository_collections', 'collections_type_index', ['group_type'])
		})
		.then(result => {
			return db.addIndex('repository_collections', 'collections_title_index', ['title'])
		})
		.then(result => {
			return db.addIndex('repository_collections', 'collections_created_at_index', ['created_at'])
		})
		.then(result => {
			return db.addIndex('repository_collections', 'collections_user_id_index', ['user_id'])
		})
		.then(() =>
			db.runSql(`
			INSERT
			INTO repository_collections
			(id, title, group_type)
			VALUES('00000000-0000-0000-0000-000000000000', 'Community Collection', 'tag');
		`)
		)
}

exports.down = function(db) {
	return db.dropTable('repository_collections')
}

exports._meta = {
	version: 1
}
