Common = window.ObojoboDraft.Common

SelectionBase = Common.selection.Selection

OboSelectionRect = Common.selection.OboSelectionRect
DOMSelection = Common.selection.DOMSelection
VirtualSelection = Common.selection.VirtualSelection


class Selection extends SelectionBase

	clear: ->
		super()

		@commands = {}
		@textCommands = []
		@styles = {}

	runTextCommands: (label) ->
		command = @commands[label].commandFnByIndex[@virtual.start.chunk.get('index')]
		data = null
		if command.onBeforeFn?
			data = command.onBeforeFn.apply @, [@]

		for chunk in @virtual.all
			command = @commands[label].commandFnByIndex[chunk.get('index')]
			command.fn.apply @, [@, chunk, data]

	update: ->
		super()

		@updateTextCommands()
		@updateStyles()

	updateTextCommands: ->
		@commands = {}
		@textCommands = []

		type = @virtual.type

		if type is 'none' or type is 'caret'
			return

		console.time 'updateTextCommands'

		allCommands = {}
		all = @virtual.all
		for chunk in all
			commands = chunk.getTextMenuCommands @

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

		numChunks = all.length
		for label, command of allCommands
			# console.log 'considering' , command
			if command.count is numChunks
				@commands[command.label] = command
				@textCommands.push command

		console.timeEnd 'updateTextCommands'

	updateStyles: ->
		console.time 'updateStyles'

		@styles = {}

		all = @virtual.all

		numChunks = all.length
		allStyles = {}
		for chunk in all
			# styles = chunk.callComponentFn 'getSelectionStyles', @
			styles = chunk.getSelectionStyles()

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