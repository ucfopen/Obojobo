ComponentMap = require '../util/componentmap'


module.exports =
	getInitialState: ->
		id = @props.chunk.cid
		ComponentMap.registerComponent @, id

		{ chunk:@props.chunk }

	componentWillReceiveProps: (nextProps) ->
		@setState { chunk:nextProps.chunk }