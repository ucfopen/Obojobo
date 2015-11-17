ComponentMap = require '../util/componentmap'


module.exports =
	getInitialState: ->
		id = @props.oboNode.id
		ComponentMap.registerComponent @, id

		{ oboNode:@props.oboNode }

	componentWillReceiveProps: (nextProps) ->
		@setState { oboNode:nextProps.oboNode }

	# handleCommand: (commandEvent) ->
	# 	if @constructor['on' + commandEvent.command]
	# 		@constructor['on' + commandEvent.command]