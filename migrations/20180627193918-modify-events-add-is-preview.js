// 'use strict'

// const canViewEditorRoles = require('../config').permissions.canViewEditor
// const doRolesIncludeCanViewEditorRole = (roles) => {
// 	let uniqCanViewEditorRoles = [...new Set(canViewEditorRoles)]
// 	let uniqRoles = [...new Set(roles)]
// 	let combinedRoles = new Set(canViewEditorRoles.concat(roles))

// 	// If the combined set size does not equal both role sets then there was
// 	// an overlap of roles, meaning
// 	return combinedRoles.size !== uniqCanViewEditorRoles.size + uniqRoles.size
// }

// let dbm
// let type
// let seed

// /**
//  * We receive the dbmigrate dependency from dbmigrate initially.
//  * This enables us to not have to rely on NODE_PATH.
//  */
// exports.setup = function(options, seedLink) {
// 	dbm = options.dbmigrate
// 	type = dbm.dataType
// 	seed = seedLink
// }

// exports.up = function(db) {
// 	let launches = {}

// 	return (
// 		db
// 			// Add is_preview but don't enforce notNull since there may be data in there already!
// 			.addColumn('events', 'is_preview', {
// 				type: 'boolean'
// 			})
// 			// Grab all the launches. In pre-amethyst releases preview mode was
// 			// determined based on if the user had canViewEditor permissions and that
// 			// was based on their LTI roles. Will attempt to grab the time of the event,
// 			// reference it with the time of the launch (and user and draft)
// 			.then(() => {
// 				return db.runSql(`
// 					SELECT
// 						id, created_at, user_id, draft_id, data->>'roles' AS roles
// 					FROM
// 						launches
// 					ORDER BY
// 						created_at
// 				`)
// 			})
// 			// Build a map of launches
// 			.then(result => {
// 				result.rows.forEach(row => {
// 					let key = row.user_id + ':' + row.draft_id
// 					if(!launches[key]) launches[key] = []

// 					launches[key].push(row)
// 				})

// 				return
// 			})
// 			// Grab all the events
// 			.then(() => {
// 				return db.runSql(`
// 					SELECT
// 						id, created_at, actor as user_id, draft_id
// 					FROM
// 						events
// 					ORDER BY
// 						created_at
// 				`)
// 			})
// 			// Go through all events and figure out the associated launch
// 			.then(result => {
// 				result.rows.forEach(event => {
// 					let key = event.user_id + ':' + event.draft_id
// 					let launches = launches[key]

// 					if(!launches) {
// 						console.error('Unable to find launch for event ' + event.id);
// 						return
// 					}

// 					let i = 0;
// 					for(len = launches.length; i < len; i++) {
// 						let launch = launches[i];

// 						if(launch.created_at > event.created_at) break;
// 					}

// 					if(i === 0) {
// 						console.error('Unable to find launch for event ' + event.id)
// 						return
// 					}

// 					let matchingLaunch = launches[i - 1];
// 					let isPreview = doRolesIncludeCanViewEditorRole(matchingLaunch.roles)

// 				})
// 			})

// 				const updates = result.rows
// 					.map(row => {
// 						const id = row.id
// 						const payload = row.payload
// 						let isPreview = true

// 						if (payload.extensions && typeof payload.extensions.previewMode !== 'undefined') {
// 							isPreview = Boolean(payload.extensions.previewMode)
// 							console.log('isPreview', isPreview)
// 						}

// 						return `
// 						UPDATE
// 							events
// 						SET
// 							is_preview=${isPreview}
// 						WHERE
// 							id='${id}'
// 					`
// 					})
// 					.join(';')

// 				return db.runSql(updates)
// 			})
// 			// Require notNull after content has been filled out
// 			.then(() => {
// 				return db.changeColumn('events', 'is_preview', {
// 					type: 'boolean',
// 					notNull: true
// 				})
// 			})
// 			// Finally, add the index
// 			.then(() => {
// 				return db.addIndex('events', 'events_is_preview', ['is_preview'])
// 			})
// 	)
// }

// exports.down = function(db) {
// 	return db.removeIndex('events', 'events_is_preview').then(() => {
// 		return db.removeColumn('events', 'is_preview')
// 	})
// }

// exports._meta = {
// 	version: 1
// }
