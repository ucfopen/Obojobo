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
			textGroup: TextGroup.create(9)
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
			textGroup: TextGroup.fromDescriptor descriptor.data.textGroup, parseInt(descriptor.data.rows, 10) * parseInt(descriptor.data.cols, 10)
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
			console.log 'CREATE TABLE', el

			group = new TextGroup

			maxNumCols = 0
			rows = Array.prototype.slice.call el.getElementsByTagName('tr')
			for row in rows
				cols = Array.prototype.slice.call row.getElementsByTagName('td')
				maxNumCols = Math.max maxNumCols, cols.length
				for col in cols
					group.add StyleableText.createFromElement(col)

			console.log group

			group.maxItems = group.length

			[
				Chunk.create @, {
					textGroup: group
					position: 'center'
					rows: rows.length
					cols: maxNumCols
				}
			]


		splitText: (sel, chunk, shiftKey) -> null
		# acceptMerge: (sel, digestedChunk, consumerChunk) -> false
		# merge: (sel, consumerChunk, digestedChunk) -> null


		deleteSelection: (sel, chunk) ->
			chunk.markChanged()

			span = POS.getSelSpanInfo sel, chunk

			chunk.get('data').textGroup.clearSpan span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset

			range = sel.getRange(chunk.getDomEl())
			if range is 'start' or range is 'both'
				sel.setFutureCaret chunk, { offset: span.start.offset, childIndex: span.start.textIndex }

		indent: (sel, chunk, decreaseIndent) ->
			chunk.markChanged()

			@insertText sel, chunk, "\t"

		deleteText: (sel, chunk, deleteForwards) ->
			chunk.markChanged()

			info = POS.getCaretInfo sel.start, chunk
			data = chunk.get 'data'

			[start, end] = if not deleteForwards then [info.offset - 1, info.offset] else [info.offset, info.offset + 1]

			info.text.deleteText start, end

			sel.setFutureCaret chunk, { offset: start, childIndex: info.textIndex }

		# init: (sel, chunk) ->
		# 	data = chunk.get 'data'

		# 	data.rows = data.cols = 0
		# 	data.textGroup.init 0

		acceptAbsorb: -> false
		absorb: -> false
		split: -> false
		transformSelection: -> false

		getCaretEdge:                 TextMethods.getCaretEdge
		insertText:                   TextMethods.insertText
		styleSelection:               TextMethods.styleSelection
		unstyleSelection:             TextMethods.unstyleSelection
		getSelectionStyles:           TextMethods.getSelectionStyles
		saveSelection:                TextMethods.saveSelection
		restoreSelection:             TextMethods.restoreSelection
		# updateSelection:              TextMethods.updateSelection
		selectStart:                  TextMethods.selectStart
		selectEnd:                    TextMethods.selectEnd
		getTextMenuCommands:          TextMethods.getTextMenuCommands



	addRow: ->
		console.log 'addROW'

		@state.chunk.markChanged()

		data = @state.chunk.get 'data'
		numCols = data.cols

		console.log numCols

		data.textGroup.maxItems += data.cols

		while numCols
			data.textGroup.add()
			numCols--

		data.rows++

		@setState { chunk:@state.chunk }

		@props.updateFn()

	addCol: ->
		@state.chunk.markChanged()

		data = @state.chunk.get 'data'
		numCols = data.cols
		row = data.rows

		data.textGroup.maxItems += data.rows

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

		React.createElement 'div', { contentEditable:false }, [
			React.createElement('div', null,
				React.createElement('button', { onClick:@addRow }, '+Row'),
				React.createElement('button', { onClick:@addCol }, '+Col')
			),
			React.createElement 'table', { contentEditable:true, className:'main', style: { width: '100%', tableLayout: 'fixed' } },
				React.createElement 'tbody', null,
					[0...data.rows].map (rowNum) ->
						React.createElement 'tr', null,
							data.textGroup.items.slice(rowNum * numCols, (rowNum + 1) * numCols).map (textGroupItem, index) ->
								React.createElement 'td', { style: { border: '1px solid gray' } },
									Text.createElement textGroupItem.text, chunk, rowNum * numCols + index
		]




module.exports = Table