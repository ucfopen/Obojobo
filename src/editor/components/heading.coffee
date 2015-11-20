React = require 'react'


OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
OboReact = require '../../oboreact/oboreact'

ViewerSingleText = require '../../viewer/components/singletext'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require './textgroup'

TextMethods = require './textmethods'
POS = require './textpositionmethods'
Chunk = require '../../models/chunk'





Heading = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		consumableElements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup: new TextGroup()
			headingLevel: 1

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()
			headingLevel: data.headingLevel

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.data.textGroup
			headingLevel: descriptor.data.headingLevel

		getDataDescriptor: (chunk) ->
			data = chunk.get 'data'

			textGroup: data.textGroup.toDescriptor()
			headingLevel: data.headingLevel

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) ->
			group = new TextGroup()
			group.first.text = StyleableText.createFromElement(el)

			[
				Chunk.create @, {
					textGroup: group
					indent: 0
				}
			]

		splitText: (sel, chunk, shiftKey) ->
			info = POS.getCaretInfo sel.start, chunk

			newText = info.text.split info.offset

			newNode = Chunk.create() #@TODO - assumes it has a textGroup
			newNode.get('data').textGroup.first.text = newText
			chunk.addAfter newNode

			sel.setFutureCaret newNode, { offset: 0, childIndex: 0 }

		getCaretEdge:                 TextMethods.getCaretEdge
		insertText:                   TextMethods.insertText
		deleteText:                   TextMethods.deleteText
		deleteSelection:              TextMethods.deleteSelection
		styleSelection:               TextMethods.styleSelection
		acceptMerge:                  TextMethods.acceptMerge
		merge:                        TextMethods.merge
		indent:                       TextMethods.indent
		saveSelection:                TextMethods.saveSelection
		restoreSelection:             TextMethods.restoreSelection
		updateSelection:              TextMethods.updateSelection

	render: ->
		data = @state.chunk.get('data')
		React.createElement('h' + data.headingLevel, null, OboReact.createText(data.textGroup.get(0).text, @state.chunk, 0, null))


# console.log SingleText
# console.log SingleText.createNewNodeData
# for o, k in SingleText
# 	console.log o, k

# TextMethods.decorate SingleText


module.exports = Heading