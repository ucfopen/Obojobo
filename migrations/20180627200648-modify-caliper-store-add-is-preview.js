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
	return (
		db
			// Add is_preview but don't enforce notNull since there may be data in there already!
			.addColumn('caliper_store', 'is_preview', {
				type: 'boolean'
			})
			// Grab all the current records, which should have a 'previewMode' property
			// in extensions
			.then(() => {
				return db.runSql(`
					SELECT
						*
					FROM caliper_store
				`)
			})
			.then(result => {
				const updates = result.rows
					.map(row => {
						const id = row.id
						const payload = row.payload
						let isPreview = true

						if (payload.extensions && typeof payload.extensions.previewMode !== 'undefined') {
							isPreview = Boolean(payload.extensions.previewMode)
						}

						return `
						UPDATE
							caliper_store
						SET
							is_preview=${isPreview}
						WHERE
							id='${id}'
					`
					})
					.join(';')

				return db.runSql(updates)
			})
			// Require notNull after content has been filled out
			.then(() => {
				return db.changeColumn('caliper_store', 'is_preview', {
					type: 'boolean',
					notNull: true
				})
			})
			// Finally, add the index
			.then(() => {
				return db.addIndex('caliper_store', 'caliper_store_is_preview', ['is_preview'])
			})
	)
}

exports.down = function(db) {
	return db.removeIndex('caliper_store', 'caliper_store_is_preview').then(() => {
		return db.removeColumn('caliper_store', 'is_preview')
	})
}

exports._meta = {
	version: 1
}
