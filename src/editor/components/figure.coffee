React = require 'react'


OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require './textgroup'

TextMethods = require './textmethods'
POS = require './textpositionmethods'

Chunk = require '../../models/chunk'





Figure = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		consumableElements: []

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup: new TextGroup()
			url: null
			position: 'center'

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()
			url: data.url
			position: data.position

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			console.log 'descr be all like', descriptor
			textGroup: TextGroup.fromDescriptor descriptor.data.textGroup
			url: descriptor.data.url
			position: descriptor.data.position

		getDataDescriptor: (chunk) ->
			data = chunk.get 'data'

			textGroup: data.textGroup.toDescriptor()
			url: data.url
			position: data.position

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
		selectStart:                  TextMethods.selectStart
		selectEnd:                    TextMethods.selectEnd
		# updateSelection:              TextMethods.updateSelection
		getTextMenuCommands:          TextMethods.getTextMenuCommands

	setPosition: ->
		data = @state.chunk.get 'data'

		positions = ['left', 'center', 'right']
		curIndex = positions.indexOf data.position
		curIndex = (curIndex + 1) % positions.length
		data.position = positions[curIndex]

		@setState { chunk:@state.chunk }
		@props.updateFn()

	render: ->
		data = @state.chunk.get('data')

		React.createElement 'div', { contentEditable:false },
			React.createElement 'button', { onClick: @setPosition }, 'Set Position'
			React.createElement 'figure', { style: { textAlign:data.position }},
				React.createElement 'img', { src:data.url, width:300 },
				React.createElement 'figcaption', { contentEditable:true },
					Text.createElement(data.textGroup.get(0).text, @state.chunk, 0, { contentEditable:true })


module.exports = Figure