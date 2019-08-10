'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
	return db
		.createTable('repository_map_drafts_to_collections', {
			id: { type: 'bigserial', primaryKey: true },
			draft_id: { type: 'UUID' },
			collection_id: { type: 'UUID' },
			user_id: { type: 'bigint', notNull: false },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
		})
		.then(result => {
			return db.addIndex('repository_map_drafts_to_collections', 'drafts_to_collections_unique', ['draft_id', 'collection_id'], true)
		})
		.then(result => {
			return db.addIndex('repository_map_drafts_to_collections', 'drafts_to_collections_created_at', ['created_at'])
		})
};

exports.down = function(db) {
  return db.dropTable('repository_map_drafts_to_collections')
};

exports._meta = {
  "version": 1
};
