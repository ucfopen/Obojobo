class CommandEvent
	defaultPrevented: false
	propagationStopped: false
	requiresParentUpdate: false
	callbacks: []

	constructor: (@command, @sel, @data = []) ->

	preventDefault: ->
		@defaultPrevented = true

	stopPropagation: ->
		@propagationStopped = true

	#@TODO - still needed?
	requireParentUpdate: ->
		@requiresParentUpdate = true

	registerCallback: (cb) ->
		@callbacks.unshift cb



module.exports = CommandEvent