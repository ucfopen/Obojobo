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
			launch_id: { type: 'bigserial', notNull: true },
			score_sent: { type: 'decimal', notNull: true },
			score_read: { type: 'decimal' },
			error: { type: 'jsonb' }
		})
		.then(result => {
			// dbmigrate doesn't support enums so we create it manually:
			return db.runSql(`
      CREATE TYPE lti_assessment_scores_status_values AS ENUM (
        'not_attempted',
        'success',
        'read_mismatch',
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
}

exports.down = function(db) {
	return db.dropTable('lti_assessment_scores').then(() => {
		return db.runSql(`DROP TYPE lti_assessment_scores_status_values`)
	})
}

exports._meta = {
	version: 1
}
