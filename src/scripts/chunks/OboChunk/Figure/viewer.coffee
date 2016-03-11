Text = require 'OboDraft/components/text'
TextGroup = require 'OboDraft/text/textgroup'
TextMethods = require 'OboDraft/text/textmethods'



Figure = React.createClass
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			console.log 'descr be all like', descriptor
			textGroup: TextGroup.fromDescriptor descriptor.content.textGroup, 1
			url: descriptor.content.url
			position: descriptor.content.position

		saveSelection:    TextMethods.saveSelection
		restoreSelection: TextMethods.restoreSelection
		styleSelection:   TextMethods.styleSelection
		unstyleSelection: TextMethods.unstyleSelection

	render: ->
		data = @props.chunk.componentContent

		React.createElement 'div', null,
			React.createElement 'figure', { style: { textAlign:data.position } },
				React.createElement 'img', { src:data.url, width:300 },
				React.createElement 'figcaption', null,
					Text.createElement(data.textGroup.get(0).text, @props.chunk, 0)


module.exports = Figure