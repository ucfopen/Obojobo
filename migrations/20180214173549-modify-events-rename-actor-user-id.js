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
	return db.renameColumn('events', 'actor', 'user_id').then(result => {
		return db.addColumn('events', 'actor', {
			type: 'varchar',
			length: 200
		})
	})
}

exports.down = function(db) {
	return db.removeColumn('events', 'actor').then(result => {
		return db.renameColumn('events', 'user_id', 'actor')
	})
}

exports._meta = {
	version: 1
}
