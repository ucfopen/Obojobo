const { gatherClientScriptsFromModules } = require('obojobo-lib-utils')
const entriesFromObojoboModules = gatherClientScriptsFromModules()

chunkViewerScripts.forEach(script => {
	// skip viewer scripts from the doc-engine
	if(item.includes('obojobo-document-engine')) return
	require(script)
});
