React = require 'react'


# ViewerSingleText = require '../../viewer/components/singletext'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require '../../text/textgroup'

TextMethods = require '../../text/textmethods'

Chunk = require '../../models/chunk'

SingleText = React.createClass
	statics:
		consumableElements: ['p']

		insertLabel: ['Text']
		onInsert: (selection, atIndex) ->
			newChunk = Chunk.create @
			selection.setFutureCaret atIndex, { childIndex:0, offset:0 }

			newChunk

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			# console.log 'ST.createNewNodeData', data
			textGroup: TextGroup.create(1)
			indent: 0
			type: 'p'

		cloneNodeData: (data) ->
			# console.log 'ST.cloneNodeData', data
			textGroup: data.textGroup.clone()
			indent: data.indent
			type: data.type

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			# console.log 'ST.createNodeDataFromDescriptor', descriptor
			textGroup: TextGroup.fromDescriptor descriptor.content.textGroup, 1
			indent: descriptor.content.indent
			type: descriptor.content.type

		getDataDescriptor: (chunk) ->
			# console.log 'ST.getDataDescriptor', chunk
			data = chunk.componentContent

			indent: data.indent
			textGroup: data.textGroup.toDescriptor()
			type: data.type

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) ->
			group = TextGroup.create(1)
			group.first.text = StyleableText.createFromElement(el)

			[
				Chunk.create @, {
					textGroup: group
					indent: 0
					type: 'p'
				}
			]

		getCaretEdge:                 TextMethods.getCaretEdge
		canRemoveSibling:             TextMethods.canRemoveSibling
		insertText:                   TextMethods.insertText
		deleteText:                   TextMethods.deleteText
		splitText:                    TextMethods.splitText
		deleteSelection:              TextMethods.deleteSelection
		styleSelection:               TextMethods.styleSelection
		unstyleSelection:             TextMethods.unstyleSelection
		canMergeWith:                    TextMethods.canMergeWith
		merge:                        TextMethods.merge
		indent:                       TextMethods.indent
		onTab:                       TextMethods.onTab
		saveSelection:                TextMethods.saveSelection
		restoreSelection:             TextMethods.restoreSelection
		getSelectionStyles:           TextMethods.getSelectionStyles
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
		# console.log 'ST.r', @state.chunk, @state.chunk.get('index'), @state.chunk.componentContent.textGroup
		data = @state.chunk.componentContent

		React.createElement('p', { style: { marginLeft: data.indent * 20 } },
			Text.createElement data.textGroup.get(0).text, @state.chunk, 0
		)


module.exports = SingleText