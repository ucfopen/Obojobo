chunks = new Map()
chunksLoaded = 0
getChunksCallbacks = []
defaultChunk = null
insertItems = new Map()
toolbarItems = []

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
		console.log '____registerChunk', chunkClass.displayName, opts
		chunks.set chunkClass.type, chunkClass

		opts = Object.assign {
			dependencies: []
			default: false
			insertItem: null
		}, opts
		if opts.default then defaultChunk = chunkClass.type
		if opts.insertItem then insertItems.set chunkClass.type, opts.insertItem

		loadDependency = @loadDependency
		promises = opts.dependencies.map (dependency) ->
			new Promise (resolve, reject) ->
				console.log 'promise fire'
				loadDependency dependency, resolve

		console.log 'promises', promises

		Promise.all(promises).then ->
			chunksLoaded++

			console.log 'now', chunksLoaded, chunks.size

			if chunksLoaded is chunks.size
				for callback in getChunksCallbacks
					callback chunks

				getChunksCallbacks = []

		@

	addToolbarItem: (opts) ->
		toolbarItems.push opts
		@

	getChunks: (callback) ->
		# console.log '__getChunks', callback
		if chunksLoaded is chunks.size
			callback(chunks)
		else
			getChunksCallbacks.push callback

		null


Object.defineProperties OBO.prototype, {
	defaultChunk:
		get: -> defaultChunk

	insertItems:
		get: -> insertItems

	toolbarItems:
		get: -> toolbarItems

	__debug__chunks:
		get: -> chunks
}


window.OBO = new OBO()