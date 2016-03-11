Text = require 'OboDraft/components/text'
TextGroup = require 'OboDraft/text/textgroup'
TextMethods = require 'OboDraft/text/textmethods'


Question = React.createClass
	statics:
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

		saveSelection:    TextMethods.saveSelection
		restoreSelection: TextMethods.restoreSelection
		styleSelection:   TextMethods.styleSelection
		unstyleSelection: TextMethods.unstyleSelection

	onAnswer: (i) ->
		content = @state.chunk.componentContent
		alert content.textGroup.get(i + 1).data.score

	render: ->
		chunk = @props.chunk
		data = chunk.componentContent
		onAnswerFn = @onAnswer

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


module.exports = Question