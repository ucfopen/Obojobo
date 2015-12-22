React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
DOMUtil = require '../../dom/domutil'
Text = require '../../components/text'

ViewerQuestion = require '../../viewer/components/question'
QuestionItem = require './questionitem'

StyleableText = require '../../text/styleabletext'

Question = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			console.log descriptor
			question: StyleableText.createFromObject descriptor.data.question
			textIndent: 0
			answers: descriptor.data.answers.map (answer) ->
				return (
					value: answer.value
					text:  StyleableText.createFromObject answer.text
				)

		getDataDescriptor: (oboNode) ->
			answers = []
			for answer in oboNode.data.answers
				answers.push {
					text: answer.text.getExportedObject()
					value: answer.value
				}

			question: oboNode.data.question.getExportedObject()
			answers: answers
			textIndent: 0

		insertText: (oboNode, sel, text) ->
			console.log 'QUESTOIN INSERT TEXT', arguments, sel.start.node, sel.end.node

			index = DOMUtil.findParentAttr sel.start.node, 'data-index'
			answer = oboNode.data.answers[index]
			pos = Text.getOboTextPos sel.start.node, sel.start.offset, sel.start.node.parentElement.parentElement
			answer.text.insertText pos, text

	handleCommand: (commandEvent, range) ->
		console.log '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%handl commund', commandEvent, range
		# OboTextCommandHandlers.handleCommand @state.oboNode.data.text, commandEvent, range
		# @setState { oboNode:@state.oboNode }

	deleteAnswer: (answer) ->
		@state.oboNode.data.answers.splice @state.oboNode.data.answers.indexOf(answer), 1
		@setState { oboNode:@state.oboNode }

	addAnswer: ->
		@state.oboNode.data.answers.push {
			value: 0,
			text: new StyleableText('Answer')
		}
		@setState { oboNode:@state.oboNode }

	onClick: ->
		if @state.editing?
			@state.editing = false
		else
			@state.editing = true

		@setState { oboNode:@state.oboNode, editing:@state.editing }


	render: ->
		React.createElement 'div', null, 'question'

	renderWORKING: ->
		# console.log 'dash rendar', @state, @props

		if @state.editing?
			curComponent = React.createElement QuestionEdit, { oboNode:@state.oboNode, deleteAnswerFn:@deleteAnswer }
		else
			curComponent = React.createElement ViewerQuestion, { oboNode:@state.oboNode, index:@props.index }

		React.createElement 'div', { onClick:@onClick, style: { background:'red' }, 'data-obo-index':@props.index },
			curComponent



QuestionEdit = React.createClass
	render: ->
		oboNode = @props.oboNode
		deleteAnswerFn = @props.deleteAnswerFn

		React.createElement 'div', null,
			React.createElement 'p', { contentEditable:true }, Text.createElement(oboNode.data.question, oboNode, 0),
			React.createElement 'div', null, oboNode.data.answers.map(((answer, index) ->
				React.createElement QuestionItem, { key:index, oboNode:oboNode, parentIndex:@props.index, index:index, answer:answer, deleteAnswerFn:deleteAnswerFn }
			).bind(@)),
			React.createElement 'button', { onClick:@addAnswer }, '+'


module.exports = Question