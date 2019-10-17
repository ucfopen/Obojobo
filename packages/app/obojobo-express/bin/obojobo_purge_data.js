#!/usr/bin/env node

global.oboRequire = name => {
	return require(`${__dirname}/../${name}`)
}
const { purgeData } = oboRequire('util/purge_data')

purgeData()
