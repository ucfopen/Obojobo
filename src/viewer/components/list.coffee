React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'

statics = OboComponentTextStatics()
statics.cloneNodeData = (data) ->
	{}
statics.createNodeDataFromDescriptor = (descriptor) ->
	{}
statics.getDataDescriptor = (descriptor) ->
	{}

List = React.createClass
	mixins: [OboNodeComponentMixin]
	statics: statics

	render: ->
		'@TODO'

	# render: ->
	# 	OboReact.createElement 'ul', @state.oboNode, @props.index, null, OboReact.createChildren(@state.oboNode, @props.index)



module.exports = List