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
  return db.addColumn('drafts', 'user_id', {
    type: 'bigint',
    notNull: true
  })
  .then(result => {
    return db.addIndex('drafts', 'user_id', ['user_id'])
  })
};

exports.down = function(db) {
  return db.removeIndex('drafts', 'user_id')
  .then(result => {
    return db.removeColumn('drafts', 'user_id')
  })
};

exports._meta = {
  "version": 1
};
