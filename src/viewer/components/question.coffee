React = require 'react'

OboNodeComponentMixin = require '../../oboreact/obonodecomponentmixin'
OboReact = require '../../oboreact/oboreact'

QuestionItem = require './question/questionitem'

StyleableText = require '../../text/styleabletext'

Question = React.createClass
	mixins: [OboNodeComponentMixin]
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			console.log descriptor
			question: StyleableText.createFromObject descriptor.data.question
			indent: 0
			answers: descriptor.data.answers.map (answer) ->
				return (
					value: answer.value
					text:  StyleableText.createFromObject answer.text
				)

	onAnswerClick: (answer) ->
		console.log answer
		alert answer.text.value + ':' + answer.value

	render: ->
		clickFn = @onAnswerClick
		OboReact.createElement('div', @state.oboNode, @props.index, null,
			React.createElement 'p', null, OboReact.createText(@state.oboNode.data.question, @state.oboNode, 0, null, @props.index),
			React.createElement 'div', null, @state.oboNode.data.answers.map (answer, index) ->
				React.createElement QuestionItem, { onClickFn:clickFn, key:index, answer:answer }
		)


module.exports = Question