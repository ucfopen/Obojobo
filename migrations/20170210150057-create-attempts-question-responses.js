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
  return db.createTable('attempts_question_responses', {
    id: { type: 'bigserial', primaryKey: true},
    created_at: { type: 'timestamp WITH TIME ZONE', notNull: true, defaultValue: new String('now()')},
    updated_at: { type: 'timestamp WITH TIME ZONE', notNull: true, defaultValue: new String('now()')},
    attempt_id: { type: 'UUID', notNull: true},
    assessment_id: { type: 'varchar', length: 100},
    question_id: { type: 'varchar', length: 100},
    score: { type: 'decimal', defaultValue: '0'},
    responder_id: {type: 'varchar' ,length: 100},
    response: { type: 'jsonb'}
  })
  .then( result => {
    return db.addIndex('attempts_question_responses', 'aqr_attempt_id_index', ['attempt_id'])
  })
  .then( result => {
    return db.addIndex('attempts_question_responses', 'aqr_question_id_index', ['question_id'])
  })
  .then( result => {
    return db.addIndex('attempts_question_responses', 'aqr_assessment_id_index', ['assessment_id'])
  })
  .then( result => {
    return db.addIndex('attempts_question_responses', 'aqr_created_at_index', ['created_at'])
  })
  .then( result => {
    return db.addIndex('attempts_question_responses', 'aqr_unique_responses', ['attempt_id', 'question_id', 'responder_id'], true)
  })
};

exports.down = function(db) {
  return db.dropTable('attempts_question_responses');
};

exports._meta = {
  "version": 1
};
