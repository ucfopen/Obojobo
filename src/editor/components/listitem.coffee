React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
OboComponentTextStatics = require './statics/obocomponenttextstatics'
OboTextCommandHandlers = require '../commands/obotextcommandhandlers'

OboNode = require '../../obodom/obonode'

ComponentClassMap = require '../../util/componentclassmap'

ViewerListItem = require '../../viewer/components/listitem'

ListItem = React.createClass
	mixins: [OboNodeComponentMixin]
	statics: OboComponentTextStatics()

	handleCommand: (commandEvent, range) ->
		if commandEvent.command is 'splitText' and @state.oboNode.data.text.length is 0 and commandEvent.sel.type is 'caret'
			# Convert to a paragraph
			componentClass = ComponentClassMap.getClassForType 'paragraph'
			newNode = new OboNode 'paragraph', componentClass.createNewNodeData()

			node = @state.oboNode

			if node.isFirstChild
				node.parent.addBefore newNode
			else if node.isLastChild
				node.parent.addAfter newNode
			else
				node.parent.split node.index
				node.parent.addBefore newNode

			node.remove()

			commandEvent.sel.setCaret 't-' + newNode.id, 0
		else
			OboTextCommandHandlers.handleCommand @state.oboNode.data.text, commandEvent, range
			@setState { oboNode:@state.oboNode }

	render: ->
		React.createElement ViewerListItem, { oboNode:@state.oboNode, index:@props.index }


module.exports = ListItem