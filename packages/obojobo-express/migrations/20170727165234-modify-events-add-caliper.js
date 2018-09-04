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
  return db.addColumn('events', 'caliper_payload', {
    type: 'json'
  })
};

exports.down = function(db) {
  return db.removeColumn('events', 'caliper_payload')
};

exports._meta = {
  "version": 1
};
