const db = oboRequire('db')
const config = oboRequire('config')
const logger = oboRequire('logger')
const moment = require('moment')
const MODE_PURGE_HISTORY = 'DANGER-delete-HISTORY-data'
const MODE_PURGE_ALL = 'DANGER-delete-ALL-data'

const purgeFromTableByDate = (table, purgeDate) =>
	db.none(
		`
		DELETE FROM ${table}
		WHERE created_at <= $[purgeDate]`,
		{ purgeDate }
	)

const purgeMultipleTablesByDate = (tables, purgeDate) => {
	logger.warn(`Purging data older than ${purgeDate}`)
	const queries = tables.map(t => {
		if (typeof t === 'function') return t(purgeDate)
		return purgeFromTableByDate(t, purgeDate)
	})
	return Promise.all(queries)
}

const purgeDrafts = purgeDate =>
	db.none(
		`
		DELETE FROM drafts
		WHERE created_at <= $[purgeDate]
		AND id != '00000000-0000-0000-0000-000000000000'`,
		{ purgeDate }
	)

const purgeDraftsContent = purgeDate =>
	db.none(
		`
		DELETE FROM drafts_content
		WHERE created_at <= $[purgeDate]
		AND draft_id != '00000000-0000-0000-0000-000000000000'`,
		{ purgeDate }
	)

const purgeMediaBinaries = purgeDate =>
	db.none(
		`
		DELETE FROM media_binaries AS b
		USING media AS M
		WHERE m.id = b.media_id
			AND m.created_at >= $[purgeDate]
		`,
		{ purgeDate }
	)

const fullPurge = async purgeDate => {
	// excludes migrations and sessions
	const tablesToClear = [
		'assessment_scores',
		'attempts',
		'attempts_question_responses',
		'caliper_store',
		'events',
		'launches',
		'lti_assessment_scores',
		'media',
		'users',
		'users_auth_identities',
		'view_state',
		'visits',
		purgeMediaBinaries,
		purgeDrafts,
		purgeDraftsContent
	]

	// delete all other content by age
	await purgeMultipleTablesByDate(tablesToClear, purgeDate)
}

const historyPurge = async purgeDate => {
	// excludes migrations, drafts, media, users, etc
	const tablesToClear = [
		'assessment_scores',
		'attempts',
		'attempts_question_responses',
		'caliper_store',
		'events',
		'launches',
		'lti_assessment_scores',
		'view_state',
		'visits'
	]

	// delete all other content by age
	// delete all other content by age
	await purgeMultipleTablesByDate(tablesToClear, purgeDate)
}

exports.purgeData = async () => {
	const configMode = config.general.demoPurgeMode || 'none'
	let purgeMethod = false

	switch (configMode) {
		case MODE_PURGE_HISTORY:
			purgeMethod = historyPurge
			break

		case MODE_PURGE_ALL:
			purgeMethod = fullPurge
			break
	}

	if (purgeMethod) {
		const demoPurgeDaysAgo = config.general.demoPurgeDaysAgo || 7
		const purgeDate = moment()
			.startOf('day')
			.subtract(demoPurgeDaysAgo, 'days')
		purgeMethod(purgeDate)
	}
}

exports.isPurgeEnabled = () => {
	const configMode = config.general.demoPurgeMode || 'none'
	return configMode === MODE_PURGE_ALL || configMode === MODE_PURGE_HISTORY
}
