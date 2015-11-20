React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
OboReact = require '../../oboreact/oboreact'

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

		React.createElement(data.type, null,
			OboReact.createText(data.textGroup.get(0).text, @state.chunk, 0, null)
		)


module.exports = SingleText