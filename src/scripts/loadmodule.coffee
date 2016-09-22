ObojoboDraft = window.ObojoboDraft
OBO = window.OBO

Head = ObojoboDraft.page.Head
Module = ObojoboDraft.models.Module
API = ObojoboDraft.net.API

loadModule = (id, loadCallback) ->
	if id?.length? and id.length > 0
		API.module.get id, (descr) ->
			#@TODO
			loadCallback Module.createFromDescriptor(null, descr)
	else
		loadCallback new Module

module.exports = (moduleId, loadCallback) ->
	OBO.getChunks (chunks) ->
		loadModule moduleId, (module) ->
			loadCallback {
				module: module
				insertItems: OBO.insertItems
				chunks: chunks
				toolbarItems: OBO.toolbarItems
			}
