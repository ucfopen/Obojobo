React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
OboReact = require '../../oboreact/oboreact'


EditableText = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		createNewNodeData: ->
			{}
		createNodeDataFromDescriptor: (descriptor) ->
			{}

	render: ->
		OboReact.createElement 'div', @state.oboNode, @props.index,
			{
				style:{ whiteSpace:'pre-wrap' }
			},
			OboReact.createChildren(@state.oboNode, @props.index)


module.exports = EditableText