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
			assessment_score_id: { type: 'bigint' },
			launch_id: { type: 'bigint' },
			score_sent: { type: 'decimal' },
			status_details: { type: 'jsonb' },
			log_id: { type: 'UUID', notNull: true }
		})
		.then(result => {
			// dbmigrate doesn't support enums so we create it manually:
			return db.runSql(`
      CREATE TYPE lti_assessment_scores_status_values AS ENUM (
        'success',
        'not_attempted_no_outcome_service_for_launch',
				'not_attempted_score_is_null',
				'error_replace_result_failed',
        'error_no_assessment_score_found',
        'error_no_secret_for_key',
        'error_no_launch_found',
        'error_launch_expired',
        'error_score_is_invalid',
        'error_unexpected'
      );`)
		})
		.then(result => {
			return db.runSql(`
      ALTER TABLE lti_assessment_scores
      ADD COLUMN status lti_assessment_scores_status_values
			NOT NULL;`)
		})
		.then(result => {
			// dbmigrate doesn't support enums so we create it manually:
			return db.runSql(`
      CREATE TYPE lti_gradebook_status_values AS ENUM (
        'error_newer_assessment_score_unsent',
				'error_state_unknown',
				'error_invalid',
				'ok_null_score_not_sent',
				'ok_no_outcome_service',
				'ok_gradebook_matches_assessment_score'
      );`)
		})
		.then(result => {
			return db.runSql(`
      ALTER TABLE lti_assessment_scores
      ADD COLUMN gradebook_status lti_gradebook_status_values
      NOT NULL;
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
			return db.runSql(`DROP TYPE lti_gradebook_status_values`)
		})
}

exports._meta = {
	version: 6
}
