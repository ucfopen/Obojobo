React = require 'react'


Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require '../../text/textgroup'

TextMethods = require '../../text/textmethods'
POS = require '../../text/textpositionmethods'
Chunk = require '../../models/chunk'





Heading = React.createClass
	statics:
		consumableElements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup: TextGroup.create(1)
			headingLevel: 1

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()
			headingLevel: data.headingLevel

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.content.textGroup, 1
			headingLevel: descriptor.content.headingLevel

		getDataDescriptor: (chunk) ->
			data = chunk.componentContent

			textGroup: data.textGroup.toDescriptor()
			headingLevel: data.headingLevel

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) ->
			group = TextGroup.create(1)
			group.first.text = StyleableText.createFromElement(el)

			[
				Chunk.create @, {
					textGroup: group
					headingLevel: parseInt(el.tagName.substr(1))
				}
			]

		splitText: (selection, chunk, shiftKey) ->
			chunk.markDirty()

			info = POS.getCaretInfo selection.text.start, chunk

			newText = info.text.split info.offset

			newNode = Chunk.create() #@TODO - assumes it has a textGroup
			newNode.componentContent.textGroup.first.text = newText
			chunk.addAfter newNode

			selection.setFutureCaret newNode, { offset: 0, childIndex: 0 }

		getCaretEdge:                 TextMethods.getCaretEdge
		canRemoveSibling:             TextMethods.canRemoveSibling
		insertText:                   TextMethods.insertText
		deleteText:                   TextMethods.deleteText
		deleteSelection:              TextMethods.deleteSelection
		styleSelection:               TextMethods.styleSelection
		unstyleSelection:             TextMethods.unstyleSelection
		getSelectionStyles:           TextMethods.getSelectionStyles
		canMergeWith:                    TextMethods.canMergeWith
		merge:                        TextMethods.merge
		indent:                       TextMethods.indent
		onTab:                       TextMethods.onTab
		saveSelection:                TextMethods.saveSelection
		restoreSelection:             TextMethods.restoreSelection
		# updateSelection:              TextMethods.updateSelection
		selectStart:                  TextMethods.selectStart
		selectEnd:                    TextMethods.selectEnd
		getTextMenuCommands:          TextMethods.getTextMenuCommands
		acceptAbsorb:                 TextMethods.acceptAbsorb
		absorb:                       TextMethods.absorb
		transformSelection:           TextMethods.transformSelection
		split:                        TextMethods.split

	getInitialState: ->
		{ chunk:@props.chunk }

	componentWillReceiveProps: (nextProps) ->
		@setState { chunk:nextProps.chunk }

	render: ->
		data = @state.chunk.componentContent
		React.createElement('h' + data.headingLevel, { className:'main' }, Text.createElement(data.textGroup.get(0).text, @state.chunk, 0))


# console.log SingleText
# console.log SingleText.createNewNodeData
# for o, k in SingleText
# 	console.log o, k

# TextMethods.decorate SingleText


module.exports = Heading