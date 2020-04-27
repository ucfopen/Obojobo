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
	// creates a function to make searching multiple text columns concatinated together faster
	return db.runSql(
		`CREATE OR REPLACE FUNCTION obo_immutable_concat_ws(s text, t1 text, t2 text)
			RETURNS text AS
			$func$
			SELECT concat_ws(s, t1, t2)
			$func$ LANGUAGE sql IMMUTABLE;
			`
	)
}

exports.down = function(db) {
	return db.runSql('DROP FUNCTION IF EXISTS obo_immutable_concat_ws(text, text, text)')
}

exports._meta = {
	version: 1
}
