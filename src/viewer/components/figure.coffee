React = require 'react'
StyleableText = require '../../text/styleabletext'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'


Figure = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			position: descriptor.data.position
			url: descriptor.data.url
			text: StyleableText.createFromObject descriptor.data.text

	render: ->
		'@TODO'

	# render: ->
	# 	return OboReact.createElement 'figure', @state.oboNode, @props.index,
	# 		{
	# 			style: { textAlign:@state.oboNode.data.position }
	# 		},
	# 		React.createElement 'img', { src:@state.oboNode.data.url, width:300 },
	# 		React.createElement 'figcaption', null,
	# 			OboReact.createText(@state.oboNode.data.text, @state.oboNode, 0, null, @props.index)


module.exports = Figure