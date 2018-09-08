'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
	dbm = options.dbmigrate
	type = dbm.dataType
	seed = seedLink
}

exports.up = function(db) {
	return db.removeColumn('attempts_question_responses', 'responder_id').then(result => {
		return db.addIndex(
			'attempts_question_responses',
			'aqr_unique_responses',
			['attempt_id', 'question_id'],
			true
		)
	})
}

exports.down = function(db) {
	return db.removeIndex('attempts_question_responses', 'aqr_unique_responses').then(result => {
		return db.addColumn('attempts_question_responses', 'responder_id', {
			type: 'varchar',
			length: 100
		})
	})
}

exports._meta = {
	version: 1
}
