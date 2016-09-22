ComponentClassMap = require './componentclassmap'

componentClassMap = new ComponentClassMap()
chunks = new Map()
chunksLoaded = 0
getChunksCallbacks = []
defaultChunk = null
errorChunk = null
insertItems = new Map()
toolbarItems = []
textListeners = []

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

	registerChunk: (chunkClass, opts = {}) ->
		# console.log('REGISTER CHUNKK', chunkClass.type);
		chunks.set chunkClass.type, chunkClass
		componentClassMap.register chunkClass.type, chunkClass

		opts = Object.assign {
			dependencies: []
			default: false
			error: false
			insertItem: null
		}, opts
		if opts.default
			componentClassMap.setDefault chunkClass.type
		if opts.error
			componentClassMap.setError chunkClass.type
		if opts.insertItem then insertItems.set chunkClass.type, opts.insertItem

		loadDependency = @loadDependency
		promises = opts.dependencies.map (dependency) ->
			new Promise (resolve, reject) ->
				loadDependency dependency, resolve

		Promise.all(promises).then ->
			chunksLoaded++

			if chunksLoaded is chunks.size
				for callback in getChunksCallbacks
					callback chunks

				getChunksCallbacks = []

		@

	addToolbarItem: (opts, position = -1) ->
		if position > -1
			toolbarItems.splice position, 0, opts
		else
			toolbarItems.push opts

		@

	registerTextListener: (opts, position = -1) ->
		if position > -1
			textListeners.splice position, 0, opts
		else
			textListeners.push opts

		@

	getChunks: (callback) ->
		# console.log('OBO get CHUNKS');
		# console.log(chunksLoaded, chunks.size);
		if true or chunksLoaded is chunks.size
			callback(chunks)
		else
			getChunksCallbacks.push callback

		null


Object.defineProperties OBO.prototype, {
	defaultChunk:
		get: -> defaultChunk

	errorChunk:
		get: -> errorChunk

	insertItems:
		get: -> insertItems

	toolbarItems:
		get: -> toolbarItems

	textListeners:
		get: -> textListeners

	componentClassMap:
		get: -> componentClassMap

	__debug__chunks:
		get: -> chunks
}


window.OBO = new OBO()