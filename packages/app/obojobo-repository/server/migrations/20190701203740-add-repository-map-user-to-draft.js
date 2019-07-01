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
		.createTable('repository_map_user_to_draft', {
			id: { type: 'bigserial', primaryKey: true },
			draft_id: { type: 'UUID' },
			user_id: { type: 'bigint' },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
		})
		.then(result => {
			return db.addIndex('repository_map_user_to_draft', 'user_to_draft_unique', ['draft_id', 'user_id'], true)
		})
};

exports.down = function(db) {
  return db.dropTable('repository_map_user_to_draft')
};

exports._meta = {
  "version": 1
};
