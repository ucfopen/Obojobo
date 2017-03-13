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
  return db.createTable('drafts', {
    id: { type: 'UUID', primaryKey: true, defaultValue: new String('uuid_generate_v4()')},
    created_at: { type: 'timestamp WITH TIME ZONE', notNull: true, defaultValue: new String('now()')}
  })
  .then( result => {
    return db.addIndex('drafts', 'drafts_created_at_index', ['created_at'])
  })
};

exports.down = function(db) {
  return db.dropTable('drafts');
};

exports._meta = {
  "version": 1
};
