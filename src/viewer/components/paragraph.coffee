React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
OboComponentTextStatics = require '../../oboreact/obocomponenttextstatics'
OboReact = require '../../oboreact/oboreact'

StyleableText = require '../../text/styleabletext'
TextGroup = require '../../editor/components/textgroup'

Paragraph = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.data.textGroup
			indent: 0

	render: ->
		OboReact.createElement('p', @state.oboNode, @props.index, null,
			OboReact.createText(@state.oboNode.data.textGroup.get(0).text, @state.oboNode, 0, null, @props.index)
		)


module.exports = Paragraph