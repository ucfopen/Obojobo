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
			score: { type: 'decimal', defaultValue: '0' },
			launch_id: { type: 'bigserial' },
			lti_score_sent: { type: 'decimal' },
			lti_score_read: { type: 'decimal' },
			lti_error: { type: 'jsonb' },
			preview: {
				type: 'boolean',
				notNull: true,
				defaultValue: false
			}
		})
		.then(result => {
			// dbmigrate doesn't support enums so we create it manually:
			return db.runSql(`
      CREATE TYPE lti_score_sent_status_values AS ENUM (
        'not_attempted',
        'success',
        'read_mismatch',
        'error'
      );`)
		})
		.then(result => {
			return db.runSql(`
      ALTER TABLE assessment_scores
      ADD COLUMN lti_score_sent_status lti_score_sent_status_values
      NOT NULL;
    `)
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
			return db.addIndex('assessment_scores', 'assessment_scores_draft_id_index', ['draft_id'])
		})
		.then(result => {
			return db.addIndex('assessment_scores', 'assessment_scores_created_at_index', ['created_at'])
		})
		.then(result => {
			return db.addIndex('assessment_scores', 'assessment_scores_launch_id_index', ['launch_id'])
		})
		.then(result => {
			return db.addIndex('assessment_scores', 'assessment_scores_preview_index', ['preview'])
		})
}

exports.down = function(db) {
	return db.dropTable('assessment_scores').then(() => {
		return db.runSql(`DROP TYPE lti_score_sent_status_values`)
	})
}

exports._meta = {
	version: 1
}
