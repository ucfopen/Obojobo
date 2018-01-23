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
		.createTable('lti_assessment_scores', {
			id: { type: 'bigserial', primaryKey: true },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			},
			assessment_score_id: { type: 'bigint', notNull: true },
			launch_id: { type: 'bigint' },
			score_sent: { type: 'decimal' },
			error_details: { type: 'jsonb' },
			log_id: { type: 'UUID', notNull: true }
		})
		.then(result => {
			// dbmigrate doesn't support enums so we create it manually:
			return db.runSql(`
      CREATE TYPE lti_assessment_scores_status_values AS ENUM (
        'not_attempted',
        'success',
        'error'
      );`)
		})
		.then(result => {
			return db.runSql(`
      ALTER TABLE lti_assessment_scores
      ADD COLUMN status lti_assessment_scores_status_values
      NOT NULL;
    `)
		})
		.then(result => {
			// dbmigrate doesn't support enums so we create it manually:
			return db.runSql(`
      CREATE TYPE lti_assessment_scores_error_values AS ENUM (
				'no_outcome_service_for_launch',
				'score_is_null',
				'fatal_no_assessment_score_found',
				'fatal_launch_expired',
        'fatal_no_secret_for_key',
        'fatal_no_launch_found',
				'fatal_score_is_invalid',
				'fatal_unexpected'
      );`)
		})
		.then(result => {
			return db.runSql(`
      ALTER TABLE lti_assessment_scores
      ADD COLUMN error lti_assessment_scores_error_values;
    `)
		})
		.then(result => {
			return db.addIndex(
				'lti_assessment_scores',
				'lti_assessment_scores_assessment_score_id_index',
				['assessment_score_id']
			)
		})
		.then(result => {
			return db.addIndex('lti_assessment_scores', 'lti_assessment_scores_launch_id_index', [
				'launch_id'
			])
		})
		.then(result => {
			return db.addIndex('lti_assessment_scores', 'lti_assessment_scores_status_index', ['status'])
		})
		.then(result => {
			return db.addIndex('lti_assessment_scores', 'lti_assessment_scores_error_index', ['error'])
		})
		.then(result => {
			return db.addIndex('lti_assessment_scores', 'lti_assessment_scores_log_id_index', ['log_id'])
		})
}

exports.down = function(db) {
	return db
		.dropTable('lti_assessment_scores')
		.then(() => {
			return db.runSql(`DROP TYPE lti_assessment_scores_status_values`)
		})
		.then(() => {
			return db.runSql(`DROP TYPE lti_assessment_scores_error_values`)
		})
}

exports._meta = {
	version: 3
}
