const db = oboRequire('db')
const config = oboRequire('config')
const moment = require('moment')

const purgeFromTableByDate = (table, purgeDate) => db.any(`
		DELETE FROM ${table}
		WHERE created_at >= $[purgeDate]`,
		{purgeDate}
	)

const fullPurge = async purgeDate => {
	const tablesToClear = [
		'assessment_scores',
		'attempts',
		'attempts_question_responses',
		'caliper_store',
		'drafts',
		'drafts_content',
		'events',
		'launches',
		'lti_assessment_scores',
		'media',
		// 'media_binaries', // omit as there is no created_at field
		// 'migrations',
		'sessions',
		'users',
		'users_auth_identities',
		'view_state',
		'visits'
	]

	// delete media_binaries first
	await db.any(`
		DELETE FROM media_binaries AS b
		USING media AS M
		WHERE m.id = b.media_id
			AND m.created_at >= $[purgeDate]
		`,
		{purgeDate}

	// delete all other content by age
	const queries = tablesToClear.map(table => purgeFromTableByDate(table, purgeDate))
	await Promise.all(queries)
})

const partialPurge = async purgeDate => {
	const tablesToClear = [
		'assessment_scores',
		'attempts',
		'attempts_question_responses',
		'caliper_store',
		// 'drafts',
		// 'drafts_content',
		'events',
		'launches',
		'lti_assessment_scores',
		// 'media',
		// 'media_binaries',
		// 'migrations',
		// 'sessions',
		// 'users',
		// 'users_auth_identities',
		'view_state',
		'visits',
	]

	// delete all other content by age
	const queries = tablesToClear.map(table => purgeFromTableByDate(table, purgeDate))
	await Promise.all(queries)
}

exports.purgeIfConfigured = async () => {
	let doPurge = false
	const configMode = config.general.demoPurgeMode || "none"
	if(configMode === "partial"){
		await partialPurge(moment().subtract(7, 'days'))
	}
	if(configMode === "full"){
		await fullPurge(moment().subtract(7, 'days'))
	}
}
