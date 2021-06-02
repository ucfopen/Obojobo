#!/usr/bin/env node
/* =============================================================
WHAT
Lifecycle script to purge data from the database.  Options are set
via obojobo environment settings.

WHY
You may wish to purge old obojobo data to keep database sizes
down or simply to reset your obojobo install regularly.

See purgeMode configuration.

HOW
yarn run obojobo_purge_data
============================================================= */

global.oboRequire = name => {
	return require(`${__dirname}/../${name}`)
}
const { purgeData } = oboRequire('server/util/purge_data')

purgeData()
