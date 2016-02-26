React = require 'react'


Text = require '../../components/text'
StyleableText = require '../../text/styleabletext'
TextGroup = require '../../text/textgroup'
TextMethods = require '../../text/textmethods'
POS = require '../../text/textpositionmethods'

Chunk = require '../../models/chunk'

Question = React.createClass
	statics:
		insertLabel: ['Question']
		onInsert: (selection, atIndex) ->
			Chunk.create @

		# OBONODE DATA METHODS
		# ================================================
		createNewNodeData: ->
			group = TextGroup.create()
			group.get(0).text = new StyleableText('Enter your question here')
			group.add new StyleableText('Enter answers here'), { score:0 }
			console.log 'TG', group

			textGroup: group

		cloneNodeData: (data) ->
			textGroup: data.textGroup.clone()

		# SERIALIZATION/DECODE METHODS
		# ================================================
		createNodeDataFromDescriptor: (descriptor) ->
			content = descriptor.content

			textGroupDescriptor = [
				{
					data: {}
					text: content.question.text
				}
			]
			for answer in content.answers
				textGroupDescriptor.push {
					data: { score:answer.score }
					text: answer.text
				}

			textGroup: TextGroup.fromDescriptor textGroupDescriptor

		getDataDescriptor: (chunk) ->
			data = chunk.componentContent

			answers = []
			for answer, i in data.textGroup.items
				continue if i is 0
				answers.push {
					score: answer.data.score
					text: answer.text.clone()
				}

			question:
				text: data.textGroup.first.text.clone()
			answers: answers

		getCaretEdge:                 TextMethods.getCaretEdge
		insertText:                   TextMethods.insertText
		deleteSelection:              TextMethods.deleteSelection
		styleSelection:               TextMethods.styleSelection
		unstyleSelection:             TextMethods.unstyleSelection
		# canMergeWith:                    TextMethods.canMergeWith
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
		canRemoveSibling: -> false

		merge: ->
			console.clear()
			console.log 'MERGE!!!!!!1'
			false

		deleteText: (selection, chunk, deleteForwards) ->
			chunk.markDirty()

			info = POS.getCaretInfo selection.text.start, chunk
			data = chunk.componentContent

			if not deleteForwards and info.offset is 0 and info.textIndex is 1
				return

			console.clear()
			console.log 'DT', info.textIndex, data.textGroup.length - 1

			if deleteForwards and info.offset is info.text.length and info.textIndex is 0
				return

			TextMethods.deleteText selection, chunk, deleteForwards

		splitText: (selection, chunk, shiftKey) ->
			console.log 'QUESTOIN SPLIT TEXT', arguments

			chunk.markDirty()

			info = POS.getCaretInfo selection.text.start, chunk
			data = chunk.componentContent

			item = data.textGroup.get(info.textIndex)

			if info.textIndex is 0
				return TextMethods.insertText sel, chunk, ["\n"]

			# if item.text.length is 0
			# 	caretInLastItem = info.text is data.textGroup.last.text

			# 	if not caretInLastItem
			# 		afterNode = chunk.clone()
			# 		afterNode.componentContent.textGroup = data.textGroup.split info.textIndex

			# 	inbetweenNode = Chunk.create()

			# 	data.textGroup.remove info.textIndex

			# 	chunk.addAfter inbetweenNode

			# 	if not caretInLastItem
			# 		@recalculateStartValues data.textGroup, afterNode.componentContent.listStyles
			# 		inbetweenNode.addAfter afterNode

			# 	selection.setFutureCaret inbetweenNode, { offset:0, childIndex:0 }
			# 	return

			data.textGroup.splitText info.textIndex, info.offset, (data) -> { score:0 }

			selection.setFutureCaret chunk, { offset:0, childIndex:info.textIndex + 1}

		selectAll: (selection, chunk) ->
			info = POS.getCaretInfo selection.text.start, chunk

			console.log info

			selection.setFutureStart chunk, { offset:0, childIndex:info.textIndex }
			selection.setFutureEnd chunk, { offset:info.text.length, childIndex:info.textIndex }

			console.log selection.text.futureStart, selection.text.futureEnd

			true


	getInitialState: ->
		chunk: @props.chunk
		active: false

	componentWillReceiveProps: (nextProps) ->
		@setState {
			chunk: nextProps.chunk
			active: nextProps.isActive
		}

	# onClick: ->
	# 	if not @state.active
	# 		@props.activateFn @state.chunk

	edit: ->
		if not @state.active
			@props.activateFn @state.chunk
			# @setState { active:true }

	close: ->
		if @state.active
			@props.activateFn null

	onAnswer: (i) ->
		content = @state.chunk.componentContent
		alert content.textGroup.get(i + 1).data.score

	setAnswer: (i) ->
		console.log 'SET ANSWER', i

		textGroup = @state.chunk.componentContent.textGroup

		#@TODO:
		for answer in textGroup.items.slice(1)
			answer.data.score = 0

		textGroup.get(i + 1).data.score = 100

		@setState { chunk:@state.chunk }


	render: ->
		chunk = @state.chunk
		data = chunk.componentContent
		onAnswerFn = @onAnswer
		setAnswerFn = @setAnswer

		if not @state.active
			React.createElement('div', { contentEditable:false, style:{border:'1px solid red'} },
				React.createElement('div', null,
					React.createElement('button', { onClick:@edit }, 'EDIT')
				),
				React.createElement('div', { style:{border:'1px solid red'}},
					React.createElement('p', null, 'QUESTION:'),
					React.createElement('div', null,
						Text.createElement(data.textGroup.first.text, chunk, 0)
					),
					React.createElement('ul', null,
						data.textGroup.items.slice(1).map (item, i) ->
							React.createElement('li', null,
								React.createElement('label', null,
									React.createElement('input', { type:'radio', name:'question', onClick:onAnswerFn.bind(@, i) }),
									React.createElement('span', null, Text.createElement(item.text, chunk, i+1))
								)
							)
					)
				)
			)
		else
			React.createElement('div', { contentEditable:false, style:{border:'1px solid green'} },
				React.createElement('div', null,
					React.createElement('button', { onClick:@close }, 'CLOSE')
				),
				React.createElement('div', { style:{border:'1px solid green'}},
					React.createElement('p', null, 'QUESTION:'),
					React.createElement('div', { contentEditable:true, style:{border:'1px solid gray'} },
						Text.createElement(data.textGroup.first.text, chunk, 0)
					),
					React.createElement('ul', null,
						data.textGroup.items.slice(1).map (item, i) ->
							React.createElement('li', null,
								React.createElement('div', null,
									React.createElement('input', { type:'radio', checked:item.data.score is 100, name:'question', onClick:setAnswerFn.bind(@, i) }),
									React.createElement('span', { contentEditable:true, style:{border:'1px solid gray'} }, Text.createElement(item.text, chunk, i+1))
								)
							)
					)
				)
			)


module.exports = Question