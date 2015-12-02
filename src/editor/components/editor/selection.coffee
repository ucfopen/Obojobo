OboSelection = require '../../../obodom/selection/oboselection'
OboSelectionRect = require '../../../obodom/selection/oboselectionrect'


class Selection
	constructor: ->
		@clear()

	clear: ->
		@commands = {}
		@labels = []
		@rect = null
		@chunkRect = null
		@sel = null
		@styles = {}

	getSelectionDescriptor: ->
		if not @sel? then return null
		@sel.getDescriptor()

	getFutureDescriptor: ->
		if not @sel? then return null
		@sel.getFutureDescriptor()

	selectFromDescriptor: (module, descriptor) ->
		startChunk = module.chunks.at descriptor.start.index
		endChunk   = module.chunks.at descriptor.end.index

		startChunk.callComponentFn 'restoreSelection', @sel, ['start', descriptor.start.data]
		endChunk.callComponentFn 'restoreSelection', @sel, ['end', descriptor.end.data]

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

	runCommand: (label, chunk) ->
		command = @commands[label].commandFnByIndex[chunk.getIndex()]
		command.apply @, [@sel, chunk]

	update: (module) ->
		@clear()
		@sel = new OboSelection module
		@rect = OboSelectionRect.createFromSelection()
		@chunkRect = OboSelectionRect.createFromChunks @sel.all

		@updateTextCommands()
		@updateStyles()

		# console.log 'valid commands are'
		console.log 'all',@
		# console.log 'valid',@validCommands
		# console.log 'labels',validLabels

	updateTextCommands: ->
		@commands = {}
		@labels = []

		if @sel.type is 'caret'
			return

		allCommands = {}
		for chunk in @sel.all
			# commands = chunk.callComponentFn 'getTextMenuCommands', [@sel, chunk]
			commands = chunk.callComponentFn 'getTextMenuCommands', @sel

			continue if not commands?

			for command in commands
				if allCommands[command.label]?
					allCommands[command.label].count += 1
					allCommands[command.label].commandFnByIndex[chunk.getIndex()] = command.fn
				else
					commandFnByIndex = {}
					commandFnByIndex[chunk.getIndex()] = command.fn

					allCommands[command.label] = {
						count: 1
						label: command.label
						commandFnByIndex: commandFnByIndex
					}

		numChunks = @sel.all.length
		for label, command of allCommands
			# console.log 'considering' , command
			if command.count is numChunks
				@commands[command.label] = command
				@labels.push command.label

	updateStyles: ->
		console.time 'updateStyles'

		@styles = {}

		numChunks = @sel.all.length
		allStyles = {}
		for chunk in @sel.all
			styles = chunk.callComponentFn 'getSelectionStyles', @sel

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


module.exports = Selection