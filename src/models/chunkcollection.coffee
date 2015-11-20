Backbone = require 'backbone'

Chunk = require './chunk'

class ChunkCollection extends Backbone.Collection
	model: Chunk


module.exports = ChunkCollection