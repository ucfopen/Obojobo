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
}

exports.up = function(db) {
	return db
		.createTable('red_alert_status', {
			id: {
				type: 'UUID',
				primaryKey: true,
				defaultValue: new String('uuid_generate_v4()')
			},
			user_id: {
        type: 'bigint',
        notNull: true
      },
      draft_id: { type: 'UUID', notNull: true },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			red_alert: { type: 'boolean', defaultValue: false, notNull: true }
		})
		.then(result => {
			return db.addIndex('red_alert_status', 'user_id_index', ['user_id'])
		})
		.then(result => {
			return db.addIndex('red_alert_status', 'draft_id_index', ['draft_id'])
		})
		.then(result => {
			return db.addIndex('red_alert_status', 'red_alert_search', ['user_id', 'draft_id'], true)
		})
}

exports.down = function(db) {
  return db.dropTable('red_alert_status');
}

exports._meta = {
  "version": 1
}
