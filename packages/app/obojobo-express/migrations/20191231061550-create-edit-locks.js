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
		.createTable('edit_locks', {
			id: { type: 'bigserial', primaryKey: true },
			user_id: { type: 'bigint', notNull: true },
			draft_id: { type: 'UUID', notNull: true },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
		})
		.then(() => db.addIndex('edit_locks', 'edit_locks_draft_id_created_at_index', ['draft_id', 'created_at']))
		.then(() => db.addIndex('edit_locks', 'dit_locks_created_at_index', ['created_at']))
}

exports.down = function(db) {
	return db.dropTable('edit_locks')
}

exports._meta = {
  "version": 1
};
