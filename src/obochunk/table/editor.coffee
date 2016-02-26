#@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!


React = require 'react'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require '../../text/textgroup'

TextMethods = require '../../text/textmethods'
POS = require '../../text/textpositionmethods'

MockElement = require '../../components/text/mockelement'
MockTextNode = require '../../components/text/mocktextnode'

Chunk = require '../../models/chunk'

Table = React.createClass
	statics:
		consumableElements: ['table']

		insertLabel: ['Table']
		onInsert: (selection, atIndex, opts = {}) ->
			console.log 'onInsert', opts
			if not opts.rows then opts.rows = ~~prompt('Rows?')
			if not opts.cols then opts.cols = ~~prompt('Cols?')

			group = TextGroup.create(opts.rows * opts.cols, {}, opts.rows * opts.cols)

			newChunk = Chunk.create @, {
				textGroup: group
				position: 'center'
				rows: opts.rows
				cols: opts.cols
			}

			selection.setFutureCaret atIndex, { childIndex:0, offset:0 }

			newChunk

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup: TextGroup.create(9, {}, 9)
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
			content = descriptor.content

			textGroup: TextGroup.fromDescriptor content.textGroup, parseInt(content.rows, 10) * parseInt(content.cols, 10)
			position: content.position
			rows: content.rows
			cols: content.cols

		getDataDescriptor: (chunk) ->
			data = chunk.componentContent

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


		deleteSelection: (selection, chunk) ->
			chunk.markDirty()

			span = POS.getSelSpanInfo selection.text, chunk

			chunk.componentContent.textGroup.clearSpan span.start.textIndex, span.start.offset, span.end.textIndex, span.end.offset

			range = selection.text.getRange(chunk.getDomEl())
			if range is 'start' or range is 'both'
				selection.setFutureCaret chunk, { offset: span.start.offset, childIndex: span.start.textIndex }

		# indent: (sel, chunk, decreaseIndent) ->
		# 	chunk.markDirty()

		# 	@insertText sel, chunk, "\t"

		deleteText: (selection, chunk, deleteForwards) ->
			chunk.markDirty()

			info = POS.getCaretInfo selection.text.start, chunk
			data = chunk.componentContent

			[start, end] = if not deleteForwards then [info.offset - 1, info.offset] else [info.offset, info.offset + 1]

			info.text.deleteText start, end

			selection.setFutureCaret chunk, { offset: start, childIndex: info.textIndex }

		# init: (sel, chunk) ->
		# 	data = chunk.componentContent

		# 	data.rows = data.cols = 0
		# 	data.textGroup.init 0

		acceptAbsorb: -> false
		absorb: -> false
		split: -> false
		transformSelection: -> false

		getCaretEdge:                 TextMethods.getCaretEdge
		canRemoveSibling:             TextMethods.canRemoveSibling
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
		onTab:                        TextMethods.onTab
		indent:                       TextMethods.indent



	addRow: ->
		@state.chunk.markDirty()

		data = @state.chunk.componentContent
		numCols = data.cols

		data.textGroup.maxItems += data.cols

		while numCols
			data.textGroup.add()
			numCols--

		data.rows++

		@setState { chunk:@state.chunk }

		# @props.selection.setFutureCaret @state.chunk, { offset:0, childIndex:data.textGroup.length - data.cols - 1 }
		@props.updateFn()

	addCol: ->
		@state.chunk.markDirty()

		data = @state.chunk.componentContent
		numCols = data.cols
		row = data.rows

		data.textGroup.maxItems += data.rows

		while row
			index = row * numCols
			data.textGroup.addAt index
			row--

		data.cols++

		@setState { chunk:@state.chunk }

		@props.updateFn()

	setDimensions: (rows, cols) ->
		@state.chunk.markDirty()

		data.rows = rows
		data.cols = cols
		data.textGroup = TextGroup.create rows * cols, null, rows * cols

		@setState { chunk:@state.chunk }

		@props.updateFn()

	getInitialState: ->
		chunk: @props.chunk
		active: false

	componentWillReceiveProps: (nextProps) ->
		@setState { chunk:nextProps.chunk }

	edit: ->
		if not @state.active
			@props.activateFn @state.chunk

	render: ->
		chunk = @state.chunk
		data = chunk.componentContent
		numCols = data.cols

		React.createElement 'div', { contentEditable:false }, [
			React.createElement('div', null,
				React.createElement('button', { onClick:@addRow }, '+Row'),
				React.createElement('button', { onClick:@addCol }, '+Col'),
				React.createElement('button', { onClick:@edit }, 'Edit'),
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