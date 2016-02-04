# React = require 'react'

# OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
# DOMUtil = require '../../dom/domutil'
# Text = require '../../components/text'

# ViewerQuestion = require '../../viewer/components/question'
# QuestionItem = require './questionitem'

# StyleableText = require '../../text/styleabletext'

# Question = React.createClass
# 	mixins: [OboNodeComponentMixin]
# 	statics:
# 		createNodeDataFromDescriptor: (descriptor) ->
# 			console.log descriptor
# 			question: StyleableText.createFromObject descriptor.data.question
# 			textIndent: 0
# 			answers: descriptor.data.answers.map (answer) ->
# 				return (
# 					value: answer.value
# 					text:  StyleableText.createFromObject answer.text
# 				)

# 		getDataDescriptor: (oboNode) ->
# 			answers = []
# 			for answer in oboNode.data.answers
# 				answers.push {
# 					text: answer.text.getExportedObject()
# 					value: answer.value
# 				}

# 			question: oboNode.data.question.getExportedObject()
# 			answers: answers
# 			textIndent: 0

# 		insertText: (oboNode, sel, text) ->
# 			console.log 'QUESTOIN INSERT TEXT', arguments, sel.start.node, sel.end.node

# 			index = DOMUtil.findParentAttr sel.start.node, 'data-index'
# 			answer = oboNode.data.answers[index]
# 			pos = Text.getOboTextPos sel.start.node, sel.start.offset, sel.start.node.parentElement.parentElement
# 			answer.text.insertText pos, text

# 	handleCommand: (commandEvent, range) ->
# 		console.log '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%handl commund', commandEvent, range
# 		# OboTextCommandHandlers.handleCommand @state.oboNode.data.text, commandEvent, range
# 		# @setState { oboNode:@state.oboNode }

# 	deleteAnswer: (answer) ->
# 		@state.oboNode.data.answers.splice @state.oboNode.data.answers.indexOf(answer), 1
# 		@setState { oboNode:@state.oboNode }

# 	addAnswer: ->
# 		@state.oboNode.data.answers.push {
# 			value: 0,
# 			text: new StyleableText('Answer')
# 		}
# 		@setState { oboNode:@state.oboNode }

# 	onClick: ->
# 		if @state.editing?
# 			@state.editing = false
# 		else
# 			@state.editing = true

# 		@setState { oboNode:@state.oboNode, editing:@state.editing }


# 	render: ->
# 		React.createElement 'div', null, 'question'

# 	renderWORKING: ->
# 		# console.log 'dash rendar', @state, @props

# 		if @state.editing?
# 			curComponent = React.createElement QuestionEdit, { oboNode:@state.oboNode, deleteAnswerFn:@deleteAnswer }
# 		else
# 			curComponent = React.createElement ViewerQuestion, { oboNode:@state.oboNode, index:@props.index }

# 		React.createElement 'div', { onClick:@onClick, style: { background:'red' }, 'data-obo-index':@props.index },
# 			curComponent



# QuestionEdit = React.createClass
# 	render: ->
# 		oboNode = @props.oboNode
# 		deleteAnswerFn = @props.deleteAnswerFn

# 		React.createElement 'div', null,
# 			React.createElement 'p', { contentEditable:true }, Text.createElement(oboNode.data.question, oboNode, 0),
# 			React.createElement 'div', null, oboNode.data.answers.map(((answer, index) ->
# 				React.createElement QuestionItem, { key:index, oboNode:oboNode, parentIndex:@props.index, index:index, answer:answer, deleteAnswerFn:deleteAnswerFn }
# 			).bind(@)),
# 			React.createElement 'button', { onClick:@addAnswer }, '+'


# module.exports = Question




React = require 'react'

QuestionModal = React.createClass
	onClick: ->
		@props.close()

	render: ->
		React.createElement 'div', { style:{width:400, height:300} },
			React.createElement 'button', {onClick:@onClick}, 'Close me!'


Question = React.createClass
	statics:
		createNodeDataFromDescriptor: ->
			{}

		getDataDescriptor: (chunk) ->
			{}


	getInitialState: ->
		chunk: @props.chunk
		text: 'Question'

	componentWillReceiveProps: (nextProps) ->
		@setState {
			chunk: nextProps.chunk
			active: nextProps.isActive
		}

	onClick: ->
		console.log 'YT:onClick'
		if not @state.active
			console.log @props
			@focusAfterUpdate = true
			@props.activateFn @state.chunk
			@props.showModalFn QuestionModal

	onInputChange: (event) ->
		@setState {
			text: event.target.value
		}

	onKeyDown: (event) ->
		if event.keyCode is 13
			@onSubmit()

	onSubmit: ->
		@props.activateFn null

	componentDidUpdate: ->
		if @focusAfterUpdate
			delete @focusAfterUpdate
			React.findDOMNode(@).getElementsByTagName('input')[0].select()

	render: ->
		console.clear()
		console.log 'render q', @state.active

		if @state.active
			React.createElement 'div', { contentEditable:false }, [
				React.createElement('input', {onChange:@onInputChange, onKeyDown:@onKeyDown, value:@state.text}),
				React.createElement('button', {onClick:@onSubmit}, 'Save')
			]
		else
			React.createElement 'div', {onClick:@onClick}, @state.text


module.exports = Question