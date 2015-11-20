Backbone = require 'backbone'

ComponentClassMap = require '../util/componentclassmap'

class Chunk extends Backbone.Model
	defaults: ->
		type: 'none'
		data: {}

	addBefore: (sibling) ->
		@collection.add sibling, { at:@getIndex() }

	addAfter: (sibling) ->
		@collection.add sibling, { at:@getIndex() + 1 }

	getIndex: ->
		@collection.indexOf @

	prevSibling: ->
		@collection.at @getIndex() - 1

	nextSibling: ->
		@collection.at @getIndex() + 1

	remove: ->
		@collection.remove @

	getComponent: ->
		ComponentClassMap.getClassForType @get('type')

	getDomEl: ->
		document.body.querySelector ".component[data-oboid='#{@cid}']"

	clone: ->
		new @constructor {
			type: @get('type')
			data: @getComponent().cloneNodeData @get('data')
		}

	toJSON: ->
		type: @get 'type'
		data: @getComponent().getDataDescriptor @


Chunk.createFromDescriptor = (descriptor) ->
	new Chunk {
		type: descriptor.type,
		data: ComponentClassMap.getClassForType(descriptor.type).createNodeDataFromDescriptor descriptor
	}

Chunk.create = (type = null, data = null) ->
	if not type?
		componentClass = ComponentClassMap.getDefaultComponentClass()
		type = ComponentClassMap.getTypeOfClass componentClass
	else
		componentClass = ComponentClassMap.getClassForType type

	data ?= componentClass.createNewNodeData()

	new Chunk {
		type: type
		data: data
	}

module.exports = Chunk