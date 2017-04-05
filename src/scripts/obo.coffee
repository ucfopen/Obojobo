require './polyfills'

ComponentClassMap = require './componentclassmap'

componentClassMap = new ComponentClassMap()
items = new Map()
itemsLoaded = 0
getItemsCallbacks = []
defaults = new Map()
# errorChunk = null @TODO

# this is editor stuff only
insertItems = new Map()
registeredToolbarItems = {
	'separator': { id:'separator', type:'separator' }
}
toolbarItems = []
textListeners = []
triggerActions = {}
variableHandlers = new Map()

window.__VH = variableHandlers


class OBO
	loadDependency: (url, onLoadCallback = ->) ->
		type = url.substr url.lastIndexOf('.') + 1

		switch type
			when 'js'
				el = document.createElement 'script'
				el.setAttribute 'src', url
				el.onload = onLoadCallback
				document.head.appendChild el

			when 'css'
				el = document.createElement 'link'
				el.setAttribute 'rel', 'stylesheet'
				el.setAttribute 'href', url
				document.head.appendChild el
				onLoadCallback()

		@

	register: (className, opts = {}) ->
		# console.log 'regsiter', className, opts
		items.set className, opts
		# componentClassMap.register chunkClass.type, chunkClass

		opts = Object.assign {
			type: null
			dependencies: []
			default: false
			error: false
			insertItem: null
			modelClass: null
			componentClass: null
			selectionHandler: null
			commandHandler: null
			variables: {}
			init: ->
		}, opts

		if opts.default
			# componentClassMap.setDefault chunkClass.type
			defaults.set opts.type, className
		# if opts.error
		# 	componentClassMap.setError chunkClass.type
		if opts.insertItem then insertItems.set chunkClass.type, opts.insertItem

		opts.init()

		for variable, cb of opts.variables
			variableHandlers.set variable, cb

		loadDependency = @loadDependency
		promises = opts.dependencies.map (dependency) ->
			new Promise (resolve, reject) ->
				loadDependency dependency, resolve

		Promise.all(promises).then ->
			itemsLoaded++

			if itemsLoaded is items.size
				for callback in getItemsCallbacks
					callback chunks

				getItemsCallbacks = []

		@

	getDefaultItemForModelType: (modelType) ->
		type = defaults.get modelType
		if not type
			return null

		items.get type

	getItemForType: (type) ->
		items.get type

	# registerChunk: (chunkClass, opts = {}) ->
	# 	console.log 'registerChunk', chunkClass.type, opts
	# 	chunks.set chunkClass.type, chunkClass
	# 	componentClassMap.register chunkClass.type, chunkClass

	# 	opts = Object.assign {
	# 		dependencies: []
	# 		default: false
	# 		error: false
	# 		insertItem: null
	# 	}, opts
	# 	if opts.default
	# 		componentClassMap.setDefault chunkClass.type
	# 	if opts.error
	# 		componentClassMap.setError chunkClass.type
	# 	if opts.insertItem then insertItems.set chunkClass.type, opts.insertItem

	# 	loadDependency = @loadDependency
	# 	promises = opts.dependencies.map (dependency) ->
	# 		new Promise (resolve, reject) ->
	# 			loadDependency dependency, resolve

	# 	Promise.all(promises).then ->
	# 		chunksLoaded++

	# 		if chunksLoaded is chunks.size
	# 			for callback in getChunksCallbacks
	# 				callback chunks

	# 			getChunksCallbacks = []

	# 	@

	registerToolbarItem: (opts) ->
		registeredToolbarItems[opts.id] = opts
		@

	addToolbarItem: (id) ->
		toolbarItems.push Object.assign({}, registeredToolbarItems[id])
		@

	registerTextListener: (opts, position = -1) ->
		if position > -1
			textListeners.splice position, 0, opts
		else
			textListeners.push opts

		@

	getItems: (callback) ->
		if true or itemsLoaded is items.size
			callback(items)
		else
			getItemsCallbacks.push callback

		null

	getDefaultItemForType: (type) ->
		className = defaults.get(type)
		if not className?
			return null

		items.get(className)

	getTextForVariable: (variable, model, viewerState) ->
		cb = variableHandlers.get(variable)
		if not cb then return null

		cb.call null, model, viewerState


Object.defineProperties OBO.prototype, {
	# errorChunk:
	# 	get: -> errorChunk

	insertItems:
		get: -> insertItems

	registeredToolbarItems:
		get: -> registeredToolbarItems

	toolbarItems:
		get: -> toolbarItems

	textListeners:
		get: -> textListeners

	triggerActions:
		get: -> triggerActions

	__debug__chunks:
		get: -> chunks
}


window.OBO = new OBO()