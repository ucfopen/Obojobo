React = require 'react'


OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'

Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require '../../text/textgroup'

TextMethods = require '../../text/textmethods'
POS = require '../../text/textpositionmethods'

Chunk = require '../../models/chunk'





Figure = React.createClass
	statics:
		consumableElements: []

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			textGroup: TextGroup.create(1)
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
			textGroup: TextGroup.fromDescriptor descriptor.data.textGroup, 1
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
			group = TextGroup.create(1)
			group.first.text = StyleableText.createFromElement(el)

			[
				Chunk.create @, {
					textGroup: group
					indent: 0
				}
			]

		splitText: (sel, chunk, shiftKey) ->
			chunk.markChanged()

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
		unstyleSelection:             TextMethods.unstyleSelection
		getSelectionStyles:           TextMethods.getSelectionStyles
		canMergeWith:                    TextMethods.canMergeWith
		merge:                        TextMethods.merge
		indent:                       TextMethods.indent
		saveSelection:                TextMethods.saveSelection
		restoreSelection:             TextMethods.restoreSelection
		selectStart:                  TextMethods.selectStart
		selectEnd:                    TextMethods.selectEnd
		# updateSelection:              TextMethods.updateSelection
		getTextMenuCommands:          TextMethods.getTextMenuCommands
		acceptAbsorb:                 TextMethods.acceptAbsorb
		absorb:                       TextMethods.absorb
		transformSelection:           TextMethods.transformSelection
		split:                        TextMethods.split

	getInitialState: ->
		{ chunk:@props.chunk }

	componentWillReceiveProps: (nextProps) ->
		@setState {
			chunk: nextProps.chunk
			active: nextProps.isActive
		}

	setPosition: ->
		@state.chunk.markChanged()

		data = @state.chunk.get 'data'

		positions = ['left', 'center', 'right']
		curIndex = positions.indexOf data.position
		curIndex = (curIndex + 1) % positions.length
		data.position = positions[curIndex]

		@setState { chunk:@state.chunk }
		@props.updateFn()

	onClick: ->
		true
		# @props.activateFn @state.chunk

	render: ->
		data = @state.chunk.get('data')

		React.createElement 'div', { contentEditable:false, onClick:@onClick },
			if @state.active then React.createElement('button', { onClick: @setPosition }, 'Set Position') else null,
			React.createElement 'figure', { style: { textAlign:data.position }, unselectable:'on' },
				React.createElement 'img', { src:data.url, width:300, unselectable:'on' }, #IE requires unselectable to remove drag handles
				React.createElement 'figcaption', { contentEditable:true },
					Text.createElement(data.textGroup.get(0).text, @state.chunk, 0, { contentEditable:true })


module.exports = Figure