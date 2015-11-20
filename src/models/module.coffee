Backbone = require 'backbone'

ChunkCollection = require './chunkcollection'
Chunk = require './chunk'

class Module extends Backbone.Model
	constructor: ->
		@name = 'untitled'
		@chunks = new ChunkCollection()

	toJSON: ->
		name: @name
		chunks: @chunks.toJSON()


Module.createFromDescriptor = (descriptor) ->
	m = new Module { name: descriptor.name }
	for chunkDescriptor in descriptor.chunks
		m.chunks.add Chunk.createFromDescriptor(chunkDescriptor)

	m


module.exports = Module