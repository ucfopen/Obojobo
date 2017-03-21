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
  return db.addColumn('drafts', 'deleted', {
    type: 'boolean',
    defaultValue: false,
    notNull: true
  })
  .then(result => {
    return db.addIndex('drafts', 'deleted', ['deleted'])
  })
};

exports.down = function(db) {
  return db.removeIndex('drafts', 'deleted')
  .then(result => {
    return db.removeColumn('drafts', 'deleted')
  })
};

exports._meta = {
  "version": 1
};
