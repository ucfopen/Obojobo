Backbone = require 'backbone'

Metadata = require './metadata'
ChunkCollection = require './chunkcollection'
Chunk = require './chunk'

class Module extends Backbone.Model
	urlRoot: "/api/module"
	# idAttribute: "shortId"

	constructor: ->
		@metadata = new Metadata()
		@chunks = new ChunkCollection()
		@deletedChunks = []

		@chunks.on 'remove', @onChunkRemove, @
		@chunks.on 'add', @onChunkAdd, @
		@chunks.on 'reset', @onChunksReset, @

	onChunkRemove: (model, collection, options) ->
		@deletedChunks.push model
		@recalcuateIndices()

	onChunkAdd: (model, collection, options) ->
		model.set 'metadataId', @metadata.id
		@recalcuateIndices()

	onChunksReset: (collection, options) ->
		for chunk in collection.models
			chunk.set 'metadataId', @metadata.id
		@recalcuateIndices()

	recalcuateIndices: ->
		for chunk, i in @chunks.models
			chunk.set 'index', i

	toJSON: ->
		metadata: @metadata.toJSON()
		chunks: @chunks.toJSON()

	save: ->
		# console.log('SAVING')

		@saveCount = 0

		for chunk in @chunks.models
			if chunk.dirty
				@saveCount++
				# console.log 'GUNNA SAVE', chunk.componentContent.textGroup
				chunk.save(null, { success:@onSaved.bind(@) })

		# console.log 'GONNA DELETE', @deletedChunks.length
		while @deletedChunks.length > 0
			console.log @deletedChunks.length
			@deletedChunks.pop().destroy()

		@deletedChunks = []

	onSaved: ->
		# console.log 'ON SAVED!', @saveCount
		@saveCount--
		if @saveCount is 0
			# console.log 'UPA DATAA'
			@update()




Module.createFromDescriptor = (descriptor) ->
	console.log 'M.cFD', descriptor
	m = new Module()
	m.metadata = new Metadata descriptor.metadata

	chunks = []
	for chunkDescriptor in descriptor.chunks
		# chunks.push Chunk.createFromDescriptor(chunkDescriptor)
		console.log chunkDescriptor
		try
			chunks.push new Chunk(chunkDescriptor)
		catch e
			console.log 'ERROR', e

	if chunks.length is 0
		chunks.push Chunk.create()

	m.chunks.reset chunks

	m


module.exports = Module