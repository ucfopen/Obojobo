Common = window.ObojoboDraft.Common
OBO = window.OBO

Head = Common.page.Head
Module = Common.models.Module
API = Common.net.API

loadModule = (id, loadCallback) ->
	if id?.length? and id.length > 0
		API.module.get id, (descr) ->
			#@TODO
			loadCallback Module.createFromDescriptor(null, descr)
	else
		loadCallback new Module

module.exports = (moduleId, loadCallback) ->
	OBO.getItems (chunks) ->
		loadModule moduleId, (module) ->
			loadCallback {
				module: module
				insertItems: OBO.insertItems
				chunks: chunks
				toolbarItems: OBO.toolbarItems
			}
