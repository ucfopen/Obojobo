'use strict'

let dbm
let type
let seed

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
		.addColumn('assessment_scores', 'resource_link_id', {
			type: 'varchar'
		})
		.then(() =>
			db.addIndex('assessment_scores', 'assessment_scores_resource_link_id', ['resource_link_id'])
		)
}

exports.down = function(db) {
	return db
		.removeIndex('assessment_scores', 'assessment_scores_resource_link_id', ['resource_link_id'])
		.then(() =>
			db.removeColumn('assessment_scores', 'resource_link_id', {
				type: 'varchar'
			})
		)
}

exports._meta = {
	version: 1
}
