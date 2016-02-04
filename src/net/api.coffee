Module = require '../models/module'
Chunk = require '../models/chunk'
Metadata = require '../models/metadata'
ChunkCollection = require '../models/chunkcollection'


#@TODO - this seems like it knows too much about the objects
# createModuleFromResponse = (res) ->
# 	# module = new Module()
# 	# module.metadata = new Metadata(res.metadata)

# 	# myChunks = []
# 	# for chunk in res.chunks
# 	# 	myChunks.push new Chunk(chunk)

# 	# module.chunks = new ChunkCollection(myChunks)

# 	console.log res

# 	# res.chunks.shift()#@TODO

# 	# module
# 	Module.createFromDescriptor res


class APIModule
	constructor: ->

	get: (moduleId, callback) ->
		request = new XMLHttpRequest()

		request.addEventListener 'load', (event) ->
			callback Module.createFromDescriptor(JSON.parse(request.responseText))

		request.open 'GET', "http://192.168.99.100/api/module/#{moduleId}", true
		request.send()

# class APIChunk
# 	constructor: ->

# 	save: (chunk) ->
# 		request = new XMLHttpRequest()

# 		request.addEventListener 'load', (event) ->
# 			callback Module.createFromDescriptor(JSON.parse(request.responseText))

# 		request.open 'UPDATE', "http://192.168.99.100/api/chunk/", true
# 		request.send()

class API
	constructor: ->

Object.defineProperties API.prototype,
	"module":
		get: ->
			new APIModule


module.exports = new API