Backbone = require 'backbone'

ComponentClassMap = require '../util/componentclassmap'

class Chunk extends Backbone.Model
	urlRoot: "http://192.168.99.100/api/chunk"
	sync: (method, model, options) ->
		# console.log 'SYNC', arguments, model.componentContent.textGroup

	# 	if method is 'read'
	# 		options.url = model.url()
	# 	else
	# 		options.url = model.urlRoot

		######## @set 'savedJSON', JSON.stringify(@toJSON())

		#@TODO - assumes success!
		model.dirty = false
		# @set 'content', contentJSON
		# json = model.toJSON()

		if method is 'update' or method is 'create'
			options.data = JSON.stringify {chunk: model.toJSON()}
			# options.data = JSON.stringify {chunk: model.attributes}
			options.contentType = 'application/json'

		Backbone.sync method, model, options

	constructor: (attrs) ->
		super attrs

		@dirty = false

		if attrs.content
			@componentContent = @getComponent().createNodeDataFromDescriptor(attrs)
		else
			@componentContent = {}

		@on "change", @onChange, @

		#@TODO - this seems crappy:
		# json = @toJSON()
		# @set 'savedJSON', JSON.stringify(@attributes)

	onChange: (model, options) ->
		if model.get('index') isnt model.previous('index')
			@dirty = true


	# update: ->
		# @set 'json', JSON.stringify(@toJSON())

	# shouldSave: ->
	# hasChanged: ->
		# savedJSON = @get('savedJSON')
		# json = @get('json')

		# savedJSON isnt json

	defaults: ->
		type: 'none'
		content: null
		contentType: 'json'
		derivedFrom: null
		index: null
		metadataId: null

	addBefore: (sibling) ->
		@collection.add sibling, { at:@get('index') }

	addAfter: (sibling) ->
		@collection.add sibling, { at:@get('index') + 1 }

	# getIndex: ->
	# 	if not @collection? then return null
	# 	@collection.indexOf @

	prevSibling: ->
		@collection.at @get('index') - 1

	nextSibling: ->
		@collection.at @get('index') + 1

	remove: ->
		@collection.remove @

	replaceWith: (newChunk) ->
		index = @get('index')
		collection = @collection

		collection.remove @
		collection.add newChunk, { at:index }

	getComponent: ->
		ComponentClassMap.getClassForType @get('type')

	callComponentFn: (fn, sel, content) ->
		# console.log 'callComponentFn', @, arguments, @get('type'), ComponentClassMap.getClassForType(@get('type')), ComponentClassMap.getClassForType(@get('type'))[fn]
		componentClass = @getComponent()
		if not componentClass[fn] then return null
		componentClass[fn].apply componentClass, [sel, @].concat(content)

	getDomEl: ->
		document.body.querySelector ".component[data-oboid='#{@cid}']"

	clone: ->
		clone = new @constructor {
			type: @get('type')
		}
		clone.componentContent = @getComponent().cloneNodeData @componentContent

		clone


	markDirty: ->
		@dirty = true
		# @set 'changed', Date.now()

	# @TODO - this should really be called updateInteralAttributesAndAlsoReturnJSON
	toJSON: ->
		contentJSON = @getComponent().getDataDescriptor @

		# @set 'json', json

		json =
			type: @get 'type'
			content: contentJSON
			contentType: @get 'contentType'
			derivedFrom: @get 'derivedFrom'
			index: @get('index')
			id: @get 'id'
			metadataId: @get 'metadataId'

		#@TODO - seems crappy:
		# @set 'content', contentJSON

		# @set 'json', JSON.stringify(json)

		json


# Chunk.createFromDescriptor = (descriptor) ->
# 	chunk = new Chunk {
# 		id: descriptor.id
# 		type: descriptor.type,
# 		content: ComponentClassMap.getClassForType(descriptor.type).createNodeDataFromDescriptor descriptor
# 		contentType: descriptor.contentType
# 		derivedFrom: descriptor.derivedFrom
# 		index: descriptor.index
# 		metadataId: descriptor.metadataId
# 	}

# 	#@TODO - this seems crappy:
# 	json = chunk.toJSON()
# 	json.index = descriptor.index
# 	chunk.set 'savedJSON', JSON.stringify(json)

Chunk.create = (typeOrClass = null, content = null) ->
	console.log 'Chunk.create', arguments

	if not typeOrClass?
		componentClass = ComponentClassMap.getDefaultComponentClass()
		type = ComponentClassMap.getTypeOfClass componentClass
	else if typeof typeOrClass is 'string'
		componentClass = ComponentClassMap.getClassForType typeOrClass
		type = typeOrClass
	else
		componentClass = typeOrClass
		type = ComponentClassMap.getTypeOfClass typeOrClass

	content ?= componentClass.createNewNodeData()

	console.log 'content is', content

	chunk = new Chunk {
		type: type
	}
	chunk.componentContent = content

	chunk

module.exports = Chunk