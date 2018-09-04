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
	return db
		.createTable('assessment_scores', {
			id: { type: 'bigserial', primaryKey: true },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			user_id: { type: 'bigint', notNull: true },
			draft_id: { type: 'UUID', notNull: true },
			assessment_id: { type: 'varchar', length: 100 },
			attempt_id: { type: 'UUID', notNull: true },
			score: { type: 'decimal' },
			preview: {
				type: 'boolean',
				notNull: true,
				defaultValue: false
			}
		})
		.then(result => {
			return db.addIndex('assessment_scores', 'assessment_scores_user_id_index', ['user_id'])
		})
		.then(result => {
			return db.addIndex('assessment_scores', 'assessment_scores_assessment_id_index', [
				'assessment_id'
			])
		})
		.then(result => {
			return db.addIndex('assessment_scores', 'assessment_scores_attempt_id_index', ['attempt_id'])
		})
		.then(result => {
			return db.addIndex('assessment_scores', 'assessment_scores_draft_id_index', ['draft_id'])
		})
		.then(result => {
			return db.addIndex('assessment_scores', 'assessment_scores_created_at_index', ['created_at'])
		})
		.then(result => {
			return db.addIndex('assessment_scores', 'assessment_scores_preview_index', ['preview'])
		})
}

exports.down = function(db) {
	return db.dropTable('assessment_scores')
}

exports._meta = {
	version: 1
}
