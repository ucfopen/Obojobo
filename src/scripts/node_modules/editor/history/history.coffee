class History
	constructor: ->
		@stack = []
		@ptr = 0

	add: (o) ->
		if @ptr < @stack.length - 1
			@stack.splice @ptr, Infinity

		o = JSON.stringify(o)

		if @length > 0 and @stack[@length - 1] is o then return false

		@stack.push o

		@ptr = @stack.length - 1

		true

	undo: () ->
		@ptr = Math.max @ptr - 1, 0
		@current

	redo: () ->
		@ptr = Math.min @ptr + 1, @stack.length - 1
		@current

	__debug_print: () ->
		console.log('HISTORY:')
		for o, i in @stack
			# console.log JSON.stringify(JSON.parse(o), null, 4)
			s = '   '
			if i is @ptr then s = '-->'
			o = JSON.parse(o)
			console.log i + '.', s, JSON.stringify(o.module.chunks[0].content.textGroup[0].text.value, null, 4), o.selection.start.index, o.selection.start.data.groupIndex, o.selection.start.data.offset, o.selection.end.index, o.selection.end.data.groupIndex, o.selection.end.data.offset


Object.defineProperties History.prototype,
	"length":
		get: ->
			return @stack.length

	"current":
		get: ->
			return JSON.parse(@stack[@ptr])


module.exports = History