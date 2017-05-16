MARGIN = 5
WIDTH = 30
HEIGHT = 30

ChunkOptionsMenu = React.createClass
	getInitialState: ->
		chunkRect: @props.selection.chunkRect

	componentWillReceiveProps: (nextProps) ->
		@setState {
			chunkRect: nextProps.selection.chunkRect
		}

	onClick: (event) ->
		@props.handlerFn 'clickah'

	render: ->
		rect = @state.chunkRect

		if not rect or rect.chunks?.length > 1 then return null

		# console.log rect

		React.createElement 'button', {
			onClick: @onClick,
			style:{
				position: 'absolute'
				zIndex: 1
				right: 0
				width: WIDTH
				height: HEIGHT
				top: rect.top + window.scrollY #- MARGIN - HEIGHT
			}
		}, 'Opts'


module.exports = ChunkOptionsMenu