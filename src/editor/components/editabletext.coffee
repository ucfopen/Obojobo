React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'

ViewerEditableText = require '../../viewer/components/editabletext'

Text = require '../../components/text'



EditableText = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		createNewNodeData: ->
			{}
		createNodeDataFromDescriptor: (descriptor) ->
			{}
		insertText: (oboNode, sel, text) ->
			console.log 'EDITABLE TEXT insertText', arguments

			ownerId = sel.start.node.parentElement.parentElement.getAttribute 'data-owner-id'
			pos = Text.getOboTextPos sel.start.node, sel.start.offset, sel.start.node.parentElement.parentElement
			oboNode = oboNode.document.nodes.get ownerId
			oboNode.data.text.insertText pos, text

			@nextSel =
				id: 't-' + ownerId
				pos: pos + 1

		updateSelection: (sel) ->
			console.log 'UPDOOT SELETION', document.getElementById(@nextSel.id), @nextSel.pos

			domPos = Text.getDomPosition @nextSel.pos, document.getElementById(@nextSel.id)
			sel.setStart domPos.textNode, domPos.offset
			sel.collapse()

	handleCommand: (commandEvent, range) ->
		commandEvent.registerCallback @handleCommandComplete

	handleCommandComplete: (commandEvent) ->
		if @state.oboNode.children.length is 0
			@state.oboNode.remove()

	render: ->
		React.createElement ViewerEditableText, { oboNode:@state.oboNode, index:@props.index }


module.exports = EditableText