YouTube = React.createClass
	statics:
		createNodeDataFromDescriptor: (descriptor) ->
			videoId: descriptor.content.videoId

	getInitialState: ->
		chunk: @props.chunk

	render: ->
		data = @props.chunk.componentContent

		React.createElement 'div', { style: { width:560, height:315, overflow:'hidden', position:'relative' } },
			React.createElement 'iframe', { width:560, height:315, src:"https://www.youtube.com/embed/#{data.videoId}", frameBorder:0, allowFullScreen:true }, null


module.exports = YouTube