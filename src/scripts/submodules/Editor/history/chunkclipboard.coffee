Common = window.ObojoboDraft.Common

Chunk = Common.models.Chunk

class ChunkClipboard
	constructor: ->
		@chunks = {}

		if window.localStorage?.chunkClipboard?
			try
				@chunks = JSON.parse window.localStorage.chunkClipboard
			catch e
				# not critical - do nothing

	clear: ->
		@chunks = {}

		if window.localStorage?.chunkClipboard?
			delete window.localStorage.chunkClipboard

	storeChunksByText: (chunks, text) ->
		@clear()

		toStore = []
		for chunk in chunks
			toStore.push chunk.toJSON()

		@chunks[text] = toStore
		@writeToLocalStorage()

	get: (text) ->
		if not @chunks[text] then return null

		chunks = @chunks[text]
		returns = []
		for chunk in chunks
			newChunk = new Chunk(chunk)
			newChunk.assignNewId()

			returns.push newChunk

		returns

	writeToLocalStorage: ->
		if window.localStorage?
			try
				window.localStorage.chunkClipboard = JSON.stringify @chunks
			catch e
				# not critical - do nothing



module.exports = ChunkClipboard