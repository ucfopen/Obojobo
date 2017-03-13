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
  return (
    db
    .addColumn('attempts', 'result', {
      type: 'json'
    })
    .then( (result) => {
      return db.removeColumn('attempts', 'score')
    })
  )
};

exports.down = function(db) {
  return (
    db
    .addColumn('attempts', 'score', {
      type: 'decimal',
      defaultValue: '0'
    })
    .then( (result) => {
      return db.removeColumn('attempts', 'result')
    })
  )
};

exports._meta = {
  "version": 1
};
