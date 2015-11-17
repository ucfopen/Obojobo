React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
OboComponentTextStatics = require '../../oboreact/obocomponenttextstatics'
OboReact = require '../../oboreact/oboreact'

ComponentClassMap = require '../../util/componentclassmap'

ListItem = React.createClass
	mixins: [OboNodeComponentMixin]
	statics: OboComponentTextStatics()

	render: ->
		OboReact.createElement('li', @state.oboNode, @props.index, null,
			OboReact.createText(@state.oboNode.data.text, @state.oboNode, 0, null, @props.index)
		)


module.exports = ListItem