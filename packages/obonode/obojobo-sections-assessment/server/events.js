const oboEvents = require('obojobo-express/server/obo_events')
const config = require('obojobo-express/server/config')
const Visit = require('obojobo-express/server/models/visit')


const paramToBool = param => {
	return param && (param === true || param === 'true' || param === 1 || param === '1')
}

// when a new draft is created make sure we create an ownership association
oboEvents.on(Visit.EVENT_BEFORE_NEW_VISIT, ({ req }) => {
	const scoreImport = req.body.score_import || req.params.score_import || config.general.allowImportDefault

	req.visitOptions = req.visitOptions ? req.visitOptions : {}
	req.visitOptions.isScoreImportable = paramToBool(scoreImport)
})
