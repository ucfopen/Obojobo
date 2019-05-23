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
  		.createTable('red_alert_status', {
  			id: {
  				type: 'bigserial',
  				primaryKey: true,
  				notNull: true 
  			},
  			user_id: {
  				type: 'UUID',
  				notNull: true
  			},
  			draft_id: {
  				type: 'UUID',
  				notNull: true
  			},
  			created_at: {
  				type: 'timestamp WITH TIME ZONE',
  				notNull: true,
  				defaultValue: new String('now()')
  			},
  			red_alert: { type: 'bool' }
  		})
};

exports.down = function(db) {
  return db.dropTable('red_alert_status');
};

exports._meta = {
  "version": 1
};
