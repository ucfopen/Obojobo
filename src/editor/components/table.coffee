#@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!


React = require 'react'

OboNodeComponentMixin = require '../../oboreact/OboNodecomponentmixin'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require './textgroup'

TextMethods = require './textmethods'
POS = require './textpositionmethods'

MockElement = require '../../components/text/mockelement'
MockTextNode = require '../../components/text/mocktextnode'

Chunk = require '../../models/chunk'

Table = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		consumableElements: ['table']

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup = new TextGroup()
			textGroup.get(0).data = { indent:0 }

			textGroup: textGroup
			position: 'center'
			rows: 3
			cols: 3

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()
			position: data.position
			rows: data.rows
			cols: data.cols

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.data.textGroup
			position: descriptor.data.position
			rows: descriptor.data.rows
			cols: descriptor.data.cols

		getDataDescriptor: (chunk) ->
			data = chunk.get 'data'

			textGroup: data.textGroup.toDescriptor()
			position: data.position
			rows: data.rows
			cols: data.cols

		# HTML METHODS
		# ================================================
		createNewNodesFromElement: (el) ->
			console.clear()
			console.log 'TABLE READ HTML'
			console.log el

			group = new TextGroup()
			group.first.text = StyleableText.createFromElement(el)

			[
				Chunk.create @, {
					textGroup: group
					indent: 0
				}
			]


		splitText: (sel, chunk, shiftKey) -> null
		acceptMerge: (sel, digestedChunk, consumerChunk) -> false
		merge: (sel, consumerChunk, digestedChunk) -> null

		deleteSelection: (sel, chunk) ->
			span = POS.getSelSpanInfo sel, chunk

			chunk.get('data').textGroup.clearSpan span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset

			range = sel.getRange(chunk.getDomEl())
			if range is 'start' or range is 'both'
				sel.setFutureCaret chunk, { offset: span.start.offset, childIndex: span.start.textIndex }

		indent: (sel, chunk, decreaseIndent) -> @insertText sel, chunk, "\t"

		deleteText: (sel, chunk, deleteForwards) ->
			info = POS.getCaretInfo sel.start, chunk
			data = chunk.get 'data'

			[start, end] = if not deleteForwards then [info.offset - 1, info.offset] else [info.offset, info.offset + 1]

			info.text.deleteText start, end

			sel.setFutureCaret chunk, { offset: start, childIndex: info.textIndex }


		getCaretEdge:                 TextMethods.getCaretEdge
		insertText:                   TextMethods.insertText
		styleSelection:               TextMethods.styleSelection
		saveSelection:                TextMethods.saveSelection
		restoreSelection:             TextMethods.restoreSelection
		# updateSelection:              TextMethods.updateSelection
		selectStart:                  TextMethods.selectStart
		selectEnd:                    TextMethods.selectEnd
		getTextMenuCommands:          TextMethods.getTextMenuCommands

	addRow: ->
		console.log 'addROW'

		data = @state.chunk.get 'data'
		numCols = data.cols

		console.log numCols

		while numCols
			data.textGroup.add()
			numCols--

		data.rows++

		@setState { chunk:@state.chunk }

		@props.updateFn()

	addCol: ->
		data = @state.chunk.get 'data'
		numCols = data.cols
		row = data.rows

		while row
			index = row * numCols
			console.log 'add at', index
			data.textGroup.addAt index
			row--

		data.cols++

		@setState { chunk:@state.chunk }

		@props.updateFn()


	render: ->
		chunk = @state.chunk
		data = chunk.get 'data'
		numCols = data.cols

		renderRow = @renderRow

		React.createElement 'div', null, [
			React.createElement('div', { contentEditable:false },
				React.createElement('button', { onClick:@addRow }, '+Row'),
				React.createElement('button', { onClick:@addCol }, '+Col')
			),
			React.createElement 'table', { style: { width: '100%' } },
				React.createElement 'tbody', null,
					[0..data.rows].map (rowNum) ->
						React.createElement 'tr', null,
							data.textGroup.items.slice(rowNum * numCols, (rowNum + 1) * numCols).map (textGroupItem, index) ->
								React.createElement 'td', { style: { border: '1px solid gray' } },
									Text.createElement textGroupItem.text, chunk, rowNum * numCols + index
		]




module.exports = Table