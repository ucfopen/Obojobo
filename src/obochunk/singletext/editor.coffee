React = require 'react'


OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'

# ViewerSingleText = require '../../viewer/components/singletext'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require '../../text/textgroup'

TextMethods = require '../../text/textmethods'

Chunk = require '../../models/chunk'

SingleText = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		consumableElements: ['p']

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup: TextGroup.create(1)
			indent: 0
			type: 'p'

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()
			indent: data.indent
			type: data.type

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.data.textGroup, 1
			indent: descriptor.data.indent
			type: descriptor.data.type

		getDataDescriptor: (chunk) ->
			data = chunk.get 'data'

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
		insertText:                   TextMethods.insertText
		deleteText:                   TextMethods.deleteText
		splitText:                    TextMethods.splitText
		deleteSelection:              TextMethods.deleteSelection
		styleSelection:               TextMethods.styleSelection
		unstyleSelection:             TextMethods.unstyleSelection
		canMergeWith:                    TextMethods.canMergeWith
		merge:                        TextMethods.merge
		indent:                       TextMethods.indent
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

	render: ->
		data = @state.chunk.get('data')

		React.createElement('p', { style: { marginLeft: (data.indent * 20) + 'px' } },
			Text.createElement data.textGroup.get(0).text, @state.chunk, 0
		)


module.exports = SingleText