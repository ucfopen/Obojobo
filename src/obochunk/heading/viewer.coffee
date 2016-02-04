React = require 'react'

Text = require '../../components/text'
TextGroup = require '../../text/textgroup'
TextMethods = require '../../text/textmethods'


Heading = React.createClass
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			textGroup: TextGroup.fromDescriptor descriptor.content.textGroup, 1
			headingLevel: descriptor.content.headingLevel

		saveSelection:    TextMethods.saveSelection
		restoreSelection: TextMethods.restoreSelection
		styleSelection:   TextMethods.styleSelection
		unstyleSelection: TextMethods.unstyleSelection

	render: ->
		data = @props.chunk.componentContent
		React.createElement('h' + data.headingLevel, { className:'main' }, Text.createElement(data.textGroup.get(0).text, @props.chunk, 0))


module.exports = Heading