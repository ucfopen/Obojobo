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
	// Create a copy of drafts_content called temp_drafts_content
	// Also create a 'temp_old_id' column to store the original ID,
	// which will be used later to map the original ids to the new
	// UUIDs. That map will be used to update the visits table.
	return (
		db
			.createTable('temp_drafts_content', {
				id: {
					type: 'UUID',
					notNull: true,
					primaryKey: true,
					defaultValue: new String('uuid_generate_v4()')
				},
				draft_id: { type: 'UUID', notNull: true },
				created_at: {
					type: 'timestamp WITH TIME ZONE',
					notNull: true,
					defaultValue: new String('now()')
				},
				content: { type: 'jsonb' },
				xml: { type: 'text' },
				temp_old_id: { type: 'bigint' }
			})
			// Copy drafts_content into temp_drafts_content
			.then(result => {
				return db.runSql(`
	      INSERT INTO temp_drafts_content(draft_id, created_at, content, xml, temp_old_id)
        SELECT draft_id, created_at, content, xml, id AS temp_old_id
        FROM drafts_content
	    `)
			})
			// Add a column to visits to store the new UUID draft_content_id
			.then(result => {
				return db.addColumn('visits', 'new_draft_content_id', {
					type: 'uuid'
				})
			})
			// Retrieve a mapping of new ids to old ids
			.then(result => {
				return db.runSql('SELECT id, temp_old_id FROM temp_drafts_content')
			})
			// Update visits by putting the new ID in a temporary new id column
			.then(result => {
				let updates = []
				result.rows.forEach(row => {
					let oldId = row.temp_old_id
					let newId = row.id

					updates.push(`
        UPDATE visits
        SET new_draft_content_id='${newId}'
        WHERE draft_content_id='${oldId}'
      `)
				})

				updates = updates.join(';')

				return db.runSql(updates)
			})
			// Temporary new id column had to allow null at first, but now that its filled
			// we can enforce nonNull (which is what is desired)
			.then(result => {
				return db.changeColumn('visits', 'new_draft_content_id', {
					type: 'UUID',
					notNull: true
				})
			})
			// Remove our temporary drafts_content old id column
			.then(result => {
				return db.removeColumn('temp_drafts_content', 'temp_old_id')
			})
			// Replace draft_content_id with new_draft_content_id
			.then(result => {
				return db.removeColumn('visits', 'draft_content_id')
			})
			.then(result => {
				return db.renameColumn('visits', 'new_draft_content_id', 'draft_content_id')
			})
			// Replace drafts_content with temp_drafts_content
			.then(result => {
				return db.dropTable('drafts_content')
			})
			.then(result => {
				// 	return db.runSql(`
				// ALTER TABLE temp_drafts_content
				// RENAME TO drafts_content;`)
				// })
				return db.renameTable('temp_drafts_content', 'drafts_content')
			})
			// Add indicies to the new drafts_content
			.then(result => {
				return db.addIndex('drafts_content', 'drafts_content_revision_index', [
					'draft_id',
					'created_at'
				])
			})
			.then(result => {
				return db.addIndex('drafts_content', 'drafts_content_created_at_index', ['created_at'])
			})
	)
}

exports.down = function(db) {
	// Create a copy of drafts_content called temp_drafts_content
	// Also create a 'temp_old_id' column to store the original ID,
	// which will be used later to map the original ids to the new
	// UUIDs. That map will be used to update the visits table.
	return (
		db
			.createTable('temp_drafts_content', {
				id: {
					type: 'bigserial',
					primaryKey: true
				},
				draft_id: { type: 'UUID', notNull: true },
				created_at: {
					type: 'timestamp WITH TIME ZONE',
					notNull: true,
					defaultValue: new String('now()')
				},
				content: { type: 'jsonb' },
				xml: { type: 'text' },
				temp_old_id: { type: 'UUID' }
			})
			// Copy drafts_content into temp_drafts_content
			.then(result => {
				return db.runSql(`
	      INSERT INTO temp_drafts_content(draft_id, created_at, content, xml, temp_old_id)
        SELECT draft_id, created_at, content, xml, id AS temp_old_id
        FROM drafts_content
	    `)
			})
			// Add a column to visits to store the new bigint draft_content_id
			.then(result => {
				return db.addColumn('visits', 'new_draft_content_id', {
					type: 'bigint'
				})
			})
			// Retrieve a mapping of new ids to old ids
			.then(result => {
				return db.runSql('SELECT id, temp_old_id FROM temp_drafts_content')
			})
			// Update visits by putting the new ID in a temporary new id column
			.then(result => {
				let updates = []
				result.rows.forEach(row => {
					let oldId = row.temp_old_id
					let newId = row.id

					updates.push(`
        UPDATE visits
        SET new_draft_content_id='${newId}'
        WHERE draft_content_id='${oldId}'
      `)
				})

				updates = updates.join(';')

				return db.runSql(updates)
			})
			// Temporary new id column had to allow null at first, but now that its filled
			// we can enforce nonNull (which is what is desired)
			.then(result => {
				return db.changeColumn('visits', 'new_draft_content_id', {
					type: 'bigint',
					notNull: true
				})
			})
			// Remove our temporary drafts_content old id column
			.then(result => {
				return db.removeColumn('temp_drafts_content', 'temp_old_id')
			})
			// Replace draft_content_id with new_draft_content_id
			.then(result => {
				return db.removeColumn('visits', 'draft_content_id')
			})
			.then(result => {
				return db.renameColumn('visits', 'new_draft_content_id', 'draft_content_id')
			})
			// Replace drafts_content with temp_drafts_content
			.then(result => {
				return db.dropTable('drafts_content')
			})
			.then(result => {
				// 	return db.runSql(`
				// ALTER TABLE temp_drafts_content
				// RENAME TO drafts_content;`)
				// })
				return db.renameTable('temp_drafts_content', 'drafts_content')
			})
			// Add indicies to the new drafts_content
			.then(result => {
				return db.addIndex('drafts_content', 'drafts_content_revision_index', [
					'draft_id',
					'created_at'
				])
			})
			.then(result => {
				return db.addIndex('drafts_content', 'drafts_content_created_at_index', ['created_at'])
			})
	)
}

exports._meta = {
	version: 1
}
