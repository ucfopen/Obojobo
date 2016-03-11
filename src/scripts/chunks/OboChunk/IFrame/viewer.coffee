IFrame = React.createClass
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			url: descriptor.content.url

	render: ->
		data = @props.chunk.componentContent

		React.createElement 'div', { 'data-url':data.url },
			React.createElement 'iframe', { width:560, height:315, src:data.url, frameborder:0, allowfullscreen:true }, null


module.exports = IFrame