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
		.addColumn('attempts_question_responses', 'imported_question_response_id', {
			type: 'bigint',
			notNull: false
		})
};

exports.down = function(db) {
	return db.removeColumn('attempts_question_responses', 'imported_question_response_id')
};

exports._meta = {
	"version": 1
};
