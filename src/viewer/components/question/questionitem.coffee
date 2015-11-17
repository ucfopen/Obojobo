React = require 'react'


QuestionItem = React.createClass
	onAnswerClick: ->
		console.log 'OAC', arguments

	render: ->
		fn = (->
			@props.onClickFn @props.answer
		).bind @
		React.createElement 'div', { onClick:fn }, @props.answer.text.value


module.exports = QuestionItem