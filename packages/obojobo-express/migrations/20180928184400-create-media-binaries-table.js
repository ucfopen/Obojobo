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
		.createTable('media_binaries', {
			media_id: { type: 'UUID', notNull: true },
			binary_id: { type: 'UUID', notNull: true },
			dimensions: { type: 'varchar', length: 25, notNull: true }
		})
		.then(result => {
			return db.addIndex(
				'media_binaries',
				'media_binaries_unique',
				['media_id', 'dimensions'],
				true
			)
		})
		.then(result => {
			return db.addIndex('media_binaries', 'media_binaries_media_id_index', ['media_id'])
		})
		.then(result => {
			return db.addIndex('media_binaries', 'media_binaries_dimensions_index', ['dimensions'])
		})
}

exports.down = function(db) {
	return db.dropTable('media_binaries')
}

exports._meta = {
	version: 1
}
