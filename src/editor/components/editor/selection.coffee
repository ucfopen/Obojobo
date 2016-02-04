OboSelection = require '../../../obodom/selection/oboselection'
OboSelectionRect = require '../../../obodom/selection/oboselectionrect'


class Selection
	constructor: ->
		@clear()

	clear: ->
		@commands = {}
		@textCommands = []
		@rect = null
		@chunkRect = null
		@sel = null
		@styles = {}

	getSelectionDescriptor: ->
		if not @sel? then return null

		OboSelection.createDescriptor(
			@sel.start.chunk.get('index'),
			@sel.start.chunk.callComponentFn('saveSelection', @, [@sel.start]),
			@sel.end.chunk.get('index'),
			@sel.end.chunk.callComponentFn('saveSelection', @, [@sel.end])
		)

	getFutureDescriptor: ->
		if not @sel? then return null
		if not @sel.futureStart? or not @sel.futureEnd? then return null

		OboSelection.createDescriptor(
			@sel.futureStart.index,
			@sel.futureStart.data,
			@sel.futureEnd.index,
			@sel.futureEnd.data
		)

	selectFromDescriptor: (module, descriptor, useTimeout = false) ->
		startChunk = module.chunks.at descriptor.start.index
		endChunk   = module.chunks.at descriptor.end.index

		startChunk.callComponentFn 'restoreSelection', @, ['start', descriptor.start.data]
		endChunk.callComponentFn 'restoreSelection', @, ['end', descriptor.end.data]

		if useTimeout
			console.log 'USING TIMEOUT!'
			setTimeout @sel.select.bind(@sel)
			return

		@sel.select()

	# selectFuture: (module) ->
	# 	# console.log 'SELECT FUTURE'
	# 	# console.log @sel

	# 	return if not @sel

	# 	# @callComponentFn 'updateSelection'
	# 	if @sel.futureStart? and @sel.futureEnd?
	# 		start = module.chunks.at @sel.futureStart.index
	# 		end   = module.chunks.at @sel.futureEnd.index

	# 		if start.cid is end.cid
	# 			start.callComponentFn 'updateSelection', @sel, ['inside']
	# 	else
	# 		if @sel.futureStart?
	# 			module.chunks.at(@sel.futureStart.index).callComponentFn 'updateSelection', @sel, ['start']
	# 		if @sel.futureEnd?
	# 			module.chunks.at(@sel.futureEnd.index).callComponentFn 'updateSelection', @sel, ['end']

	# 	@sel.clearFuture()
	# 	@sel.select()

	runTextCommands: (label) ->
		command = @commands[label].commandFnByIndex[@sel.start.chunk.get('index')]
		data = null
		if command.pre?
			data = command.pre.apply @

		for chunk in @sel.all
			command = @commands[label].commandFnByIndex[chunk.get('index')]
			command.fn.apply @, [@, chunk, data]

	update: (module) ->
		console.time 'selection.update'
		@clear()

		console.time 'new oboSelection'
		@sel = new OboSelection module
		console.timeEnd 'new oboSelection'

		console.time 'OboSelectionRect.createFromSelection'
		@rect = OboSelectionRect.createFromSelection()
		console.timeEnd 'OboSelectionRect.createFromSelection'

		console.time 'OboSelectionRect.createFromChunks'
		@chunkRect = OboSelectionRect.createFromChunks @sel.all
		console.timeEnd 'OboSelectionRect.createFromChunks'

		@updateTextCommands()
		@updateStyles()

		console.timeEnd 'selection.update'

	updateTextCommands: ->
		@commands = {}
		@textCommands = []

		if @sel.type is 'caret'
			return

		console.time 'updateTextCommands'

		allCommands = {}
		for chunk in @sel.all
			# commands = chunk.callComponentFn 'getTextMenuCommands', [@sel, chunk]
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

		numChunks = @sel.all.length
		for label, command of allCommands
			# console.log 'considering' , command
			if command.count is numChunks
				@commands[command.label] = command
				@textCommands.push command

		console.timeEnd 'updateTextCommands'

	updateStyles: ->
		console.time 'updateStyles'

		@styles = {}

		numChunks = @sel.all.length
		allStyles = {}
		for chunk in @sel.all
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
		@sel.setFutureStart @sel.start.chunk, @sel.start.chunk.callComponentFn('saveSelection', @, [@sel.start])
		@sel.setFutureEnd   @sel.end.chunk,   @sel.end.chunk.callComponentFn('saveSelection', @, [@sel.end])


module.exports = Selection