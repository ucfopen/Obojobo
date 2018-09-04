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
		.createTable('users_auth_identities', {
			id: { type: 'bigserial', primaryKey: true },
			auth_provider: { type: 'varchar', length: 200, notNull: true },
			auth_provider_user_id: { type: 'varchar', length: 200, notNull: true },
			user_id: { type: 'bigint', notNull: true },
			metadata: { type: 'jsonb' },
			created_at: {
				type: 'timestamp WITH TIME ZONE',
				notNull: true,
				defaultValue: new String('now()')
			}
		})
		.then(result => {
			return db.addIndex('users_auth_identities', 'uai_user_id', ['user_id'])
		})
		.then(result => {
			return db.addIndex(
				'users_auth_identities',
				'uai_unique_identity',
				['auth_provider', 'auth_provider_user_id'],
				true
			)
		})
		.then(result => {
			return db.addIndex('users_auth_identities', 'uai_auth_provider_user_id', [
				'auth_provider_user_id'
			])
		})
		.then(result => {
			return db.addIndex('users_auth_identities', 'uai_auth_provider', ['auth_provider'])
		})
}

exports.down = function(db) {
	return db.dropTable('users_auth_identities')
}

exports._meta = {
	version: 1
}
