React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'

StyleableText = require '../../text/styleabletext'
TextGroup = require '../../editor/components/textgroup'

SingleText = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.data.textGroup
			indent: 0

	render: ->
		data = @state.chunk.get('data')
		React.createElement(data.type, null, Text.createElement(data.textGroup.get(0).text, @state.chunk, 0))


module.exports = SingleText