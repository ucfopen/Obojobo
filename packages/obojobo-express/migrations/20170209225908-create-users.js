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
  return db.createTable('users', {
    id: { type: 'bigserial', primaryKey: true},
    created_at: { type: 'timestamp WITH TIME ZONE', notNull: true, defaultValue: new String('now()')},
    username: { type: 'varchar', length: 100},
    email: { type: 'varchar', length: 100},
    first_name: { type: 'varchar', length: 100},
    last_name: { type: 'varchar', length: 100},
    roles: { type: 'text[]'}
  })
  .then( result => {
    return db.addIndex('users', 'users_username_index', ['username'], true)
  })
  .then( result => {
    return db.addIndex('users', 'users_created_at_index', ['created_at'])
  })

};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 2
};