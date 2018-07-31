'use strict'

const canViewEditorRoles = require('../config').permissions.canViewEditor

const doRolesIncludeCanViewEditorRole = rolesStr => {
	const roles = rolesStr
		.substr(1, rolesStr.length - 2)
		.split(',')
		.map(r => r.replace(/"/g, '').replace(/ /g, ''))

	for (let i = 0, len = roles.length; i < len; i++) {
		if (canViewEditorRoles.indexOf(roles[i]) > -1) return true
	}

	return false
}

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
	const launches = {}

	return (
		db
			// Add is_preview but don't enforce notNull since there may be data in there already!
			.addColumn('events', 'is_preview', {
				type: 'boolean'
			})
			// Grab all the launches. In pre-amethyst releases preview mode was
			// determined based on if the user had canViewEditor permissions and that
			// was based on their LTI roles. Will attempt to grab the time of the event,
			// reference it with the time of the launch (and user and draft)
			.then(() => {
				return db.runSql(`
					SELECT
						id, created_at, user_id, draft_id, data->>'roles' AS roles
					FROM
						launches
					ORDER BY
						created_at
				`)
			})
			// Build a map of launches
			.then(result => {
				result.rows.forEach(row => {
					const key = row.user_id + ':' + row.draft_id
					if (!launches[key]) launches[key] = []

					launches[key].push(row)
				})
			})
			// Grab all the events
			.then(() => {
				return db.runSql(`
					SELECT
						id, created_at, actor as user_id, draft_id
					FROM
						events
					ORDER BY
						created_at
				`)
			})
			// Go through all events and figure out the associated launch
			.then(result => {
				const updates = []

				result.rows.forEach(event => {
					const key = event.user_id + ':' + event.draft_id
					const launchesForUserAndDraft = launches[key]
					let isPreview

					if (!launchesForUserAndDraft) {
						// Unable to find a launch, most likely this is because this is a preview
						isPreview = true
					} else {
						let i = 0
						for (let len = launchesForUserAndDraft.length; i < len; i++) {
							const launch = launchesForUserAndDraft[i]

							if (launch.created_at > event.created_at) break
						}

						if (i === 0) {
							console.error(launchesForUserAndDraft, event.id, event.created_at)
							throw 'Unable to find launch for event - event is before any launch! ' + event.id
						}

						const matchingLaunch = launchesForUserAndDraft[i - 1]

						isPreview = doRolesIncludeCanViewEditorRole(matchingLaunch.roles)
					}

					updates.push(`
							UPDATE
								events
							SET
								is_preview=${isPreview}
							WHERE
								id=${event.id}
					`)
				})

				return updates.join(';')
			})
			.then(updates => {
				return db.runSql(updates)
			})
			// Require notNull after content has been filled out
			.then(() => {
				return db.changeColumn('events', 'is_preview', {
					type: 'boolean',
					notNull: true
				})
			})
			// Finally, add the index
			.then(() => {
				return db.addIndex('events', 'events_is_preview', ['is_preview'])
			})
	)
}

exports.down = function(db) {
	return db.removeIndex('events', 'events_is_preview').then(() => {
		return db.removeColumn('events', 'is_preview')
	})
}

exports._meta = {
	version: 1
}
