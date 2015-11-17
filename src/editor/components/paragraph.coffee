React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
OboComponentTextStatics = require './statics/obocomponenttextstatics'
OboTextCommandHandlers = require '../commands/obotextcommandhandlers'
OboReact = require '../../oboreact/oboreact'
OboNode = require '../../obodom/obonode'

ViewerParagraph = require '../../viewer/components/paragraph'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require './textgroup'

TextMethods = require './textmethods'

Paragraph = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		consumableElements: ['p']

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup: new TextGroup()
			indent: 0

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()
			indent: data.indent

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) ->
			group = new TextGroup()
			group.first.text = StyleableText.createFromElement(el)

			[
				OboNode.create @, {
					textGroup: group
					indent: 0
				}
			]

		createNodeDataFromDescriptor: TextMethods.createNodeDataFromDescriptor
		getDataDescriptor:            TextMethods.getDataDescriptor
		getCaretEdge:                 TextMethods.getCaretEdge
		insertText:                   TextMethods.insertText
		deleteText:                   TextMethods.deleteText
		splitText:                    TextMethods.splitText
		deleteSelection:              TextMethods.deleteSelection
		styleSelection:               TextMethods.styleSelection
		merge:                        TextMethods.merge
		indent:                       TextMethods.indent
		saveSelection:                TextMethods.saveSelection
		restoreSelection:             TextMethods.restoreSelection
		updateSelection:              TextMethods.updateSelection

	render: ->
		indent = @state.oboNode.data.indent

		React.createElement('div', { style: { marginLeft: (indent * 20) + 'px' } },
			React.createElement(ViewerParagraph, { oboNode:@state.oboNode, index:@props.index })
		)


# console.log Paragraph
# console.log Paragraph.createNewNodeData
# for o, k in Paragraph
# 	console.log o, k

# TextMethods.decorate Paragraph


module.exports = Paragraph