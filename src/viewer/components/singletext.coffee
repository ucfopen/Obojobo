React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'

StyleableText = require '../../text/styleabletext'
TextGroup = require '../../editor/components/textgroup'

SingleText = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			descriptor = { indent:0 }

			if not descriptor.data?.textGroup?
				descriptor.textGroup = new TextGroup()
			else
				descriptor.textGroup = TextGroup.fromDescriptor descriptor.data.textGroup

			descriptor

	render: ->
		data = @state.chunk.componentContent
		React.createElement(data.type, null, Text.createElement(data.textGroup.get(0).text, @state.chunk, 0))


module.exports = SingleText