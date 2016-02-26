TextSelection = require '../../../obodom/selection/textselection'
OboSelectionRect = require '../../../obodom/selection/oboselectionrect'


class Selection
	constructor: ->
		@clear()
		@lastText = null

	clear: ->
		@commands = {}
		@textCommands = []
		@rect = null
		@chunkRect = null
		@text = null
		@styles = {}
		@futureStart = null
		@futureEnd = null

	getSelectionDescriptor: ->
		if not @text? then return null

		TextSelection.createDescriptor(
			@text.start.chunk.get('index'),
			@text.start.chunk.callComponentFn('saveSelection', @, [@text.start]),
			@text.end.chunk.get('index'),
			@text.end.chunk.callComponentFn('saveSelection', @, [@text.end])
		)

	getFutureDescriptor: ->
		if not @futureStart? or not @futureEnd? then return null

		TextSelection.createDescriptor(
			@futureStart.index,
			@futureStart.data,
			@futureEnd.index,
			@futureEnd.data
		)

	selectFromDescriptor: (module, descriptor) ->
		startChunk = module.chunks.at descriptor.start.index
		endChunk   = module.chunks.at descriptor.end.index

		startChunk.callComponentFn 'restoreSelection', @, ['start', descriptor.start.data]
		endChunk.callComponentFn 'restoreSelection', @, ['end', descriptor.end.data]

		@text.select()

	setFutureStart: (chunkOrIndex, data) ->
		@futureStart =
			index: if not isNaN(chunkOrIndex) then chunkOrIndex else chunkOrIndex.get('index')
			data: data

	setFutureEnd: (chunkOrIndex, data) ->
		@futureEnd =
			index: if not isNaN(chunkOrIndex) then chunkOrIndex else chunkOrIndex.get('index')
			data: data

	setFutureCaret: (chunk, data) ->
		@setFutureStart chunk, data
		@setFutureEnd   chunk, data

	#@TODO - THIS SUX
	setFutureFromDescriptor: (descriptor) ->
		@futureStart =
			index: descriptor.start.index
			data: descriptor.start.data
		@futureEnd =
			index: descriptor.end.index
			data: descriptor.end.data

	clearFuture: ->
		@futureStart = @futureEnd = null

	runTextCommands: (label) ->
		command = @commands[label].commandFnByIndex[@text.start.chunk.get('index')]
		data = null
		if command.pre?
			data = command.pre.apply @

		for chunk in @text.all
			command = @commands[label].commandFnByIndex[chunk.get('index')]
			command.fn.apply @, [@, chunk, data]

	update: (module) ->
		# return if not document.getElementById('editor').contains(document.activeElement)

		console.time 'selection.update'
		@clear()

		console.time 'new oboSelection'
		console.log 'last text', @text
		lastStart = if @lastText?.start?.chunk? then @lastText.start.chunk else null
		lastEnd   = if @lastText?.end?.chunk?   then @lastText.end.chunk   else null

		@text = new TextSelection module

		newStart = @text.start.chunk
		newEnd   = @text.end.chunk

		console.log 'lastStart', lastStart

		if lastStart? and lastStart isnt newStart
			lastStart.callComponentFn 'blur', @
		if newStart?
			newStart.callComponentFn 'focus', @

		if lastEnd? and lastEnd isnt newEnd and lastEnd isnt lastStart
			lastEnd.callComponentFn 'blur', @
		if newEnd? and newEnd isnt newStart
			newEnd.callComponentFn 'focus', @

		@lastText = @text

		console.timeEnd 'new oboSelection'
		console.log 'Selection.update.@text', @text

		console.time 'OboSelectionRect.createFromSelection'
		@rect = OboSelectionRect.createFromSelection()
		console.timeEnd 'OboSelectionRect.createFromSelection'

		console.time 'OboSelectionRect.createFromChunks'
		r = window.getSelection().getRangeAt(0)
		window.rs = r.startContainer
		window.re = r.endContainer
		@chunkRect = OboSelectionRect.createFromChunks @text.all
		console.timeEnd 'OboSelectionRect.createFromChunks'

		@updateTextCommands()
		@updateStyles()

		console.timeEnd 'selection.update'

	updateTextCommands: ->
		@commands = {}
		@textCommands = []

		if @text.type is 'caret'
			return

		console.time 'updateTextCommands'

		allCommands = {}
		console.log @text.all
		for chunk in @text.all
			# commands = chunk.callComponentFn 'getTextMenuCommands', [@text, chunk]
			commands = chunk.callComponentFn 'getTextMenuCommands', @

			continue if not commands?

			for command in commands
				if allCommands[command.label]?
					allCommands[command.label].count += 1
					allCommands[command.label].commandFnByIndex[chunk.get('index')] = command
				else
					commandFnByIndex = {}
					commandFnByIndex[chunk.get('index')] = command

					allCommands[command.label] = {
						count: 1
						label: command.label
						image: command.image
						commandFnByIndex: commandFnByIndex
					}

		numChunks = @text.all.length
		for label, command of allCommands
			# console.log 'considering' , command
			if command.count is numChunks
				@commands[command.label] = command
				@textCommands.push command

		console.timeEnd 'updateTextCommands'

	updateStyles: ->
		console.time 'updateStyles'

		@styles = {}

		numChunks = @text.all.length
		allStyles = {}
		for chunk in @text.all
			styles = chunk.callComponentFn 'getSelectionStyles', @

			if not styles then return

			for style of styles
				if not allStyles[style]?

					allStyles[style] = 1
				else
					allStyles[style]++

		for style of allStyles
			if allStyles[style] is numChunks
				@styles[style] = style

		console.timeEnd 'updateStyles'

	setFutureFromSelection: ->
		return null if not @text?
		@setFutureStart @text.start.chunk, @text.start.chunk.callComponentFn('saveSelection', @, [@text.start])
		@setFutureEnd   @text.end.chunk,   @text.end.chunk.callComponentFn('saveSelection', @, [@text.end])


module.exports = Selection