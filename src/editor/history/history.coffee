class History
	constructor: ->
		@stack = []
		@ptr = 0

	add: (loDescriptor, selDescriptor) ->
		if @ptr < @stack.length - 1
			@stack.splice @ptr, Infinity

		@stack.push
			lo: loDescriptor
			selection: selDescriptor

		@ptr = @stack.length - 1

	undo: () ->
		@ptr = Math.max @ptr - 1, 0
		@current

	redo: () ->
		@ptr = Math.min @ptr + 1, @stack.length - 1
		@current

	__debug_print: () ->
		console.log('HISTORY:')
		for o in @stack
			console.log JSON.stringify(o, null, 4)


Object.defineProperties History.prototype,
	"length":
		get: ->
			return @stack.length

	"current":
		get: ->
			return @stack[@ptr]


module.exports = History