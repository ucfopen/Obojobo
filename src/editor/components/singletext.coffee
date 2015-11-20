React = require 'react'


OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
OboReact = require '../../oboreact/oboreact'

ViewerSingleText = require '../../viewer/components/singletext'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require './textgroup'

TextMethods = require './textmethods'





SingleText = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		consumableElements: ['p']

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup: new TextGroup()
			indent: 0
			type: 'p'

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()
			indent: data.indent
			type: data.type

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.data.textGroup
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
			group = new TextGroup()
			group.first.text = StyleableText.createFromElement(el)

			[
				Chunk.create @, {
					textGroup: group
					indent: 0
				}
			]

		getCaretEdge:                 TextMethods.getCaretEdge
		insertText:                   TextMethods.insertText
		deleteText:                   TextMethods.deleteText
		splitText:                    TextMethods.splitText
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

		React.createElement('div', { style: { marginLeft: (data.indent * 20) + 'px' } },
			React.createElement(ViewerSingleText, { chunk:@state.chunk, index:@props.index })
		)


# console.log SingleText
# console.log SingleText.createNewNodeData
# for o, k in SingleText
# 	console.log o, k

# TextMethods.decorate SingleText


module.exports = SingleText