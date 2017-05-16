# MOUSE_OUT_DELAY_MS = 200
# NUM_ROWS = 6
# NUM_COLS = 6
# DEFAULT_NUM_ROWS = 2
# DEFAULT_NUM_COLS = 3

# GridButton = React.createClass
# 	getInitialState: ->
# 		open: false
# 		desiredRows: DEFAULT_NUM_ROWS
# 		desiredCols: DEFAULT_NUM_COLS

# 	onButtonMouseOver: ->
# 		@setDimensions DEFAULT_NUM_ROWS, DEFAULT_NUM_COLS
# 		@onMouseOver()

# 	onMouseOver: ->
# 		clearInterval @mouseOutTimeoutId
# 		@setState { open:true }

# 	onMouseOut: ->
# 		@mouseOutTimeoutId = setTimeout (->
# 			@setState @getInitialState()
# 		).bind(@), MOUSE_OUT_DELAY_MS

# 	onMouseDown: (rows, cols) ->
# 		@setState @getInitialState()
# 		@props.commandHandler @props.command, { rows:rows, cols:cols }

# 	setDimensions: (rows, cols) ->
# 		@setState {
# 			desiredRows: rows,
# 			desiredCols: cols
# 		}

# 	createRow: (rowIndex) ->
# 		state = @state
# 		setDimensions = @setDimensions
# 		onMouseDown = @onMouseDown

# 		self = @

# 		React.createElement('tr', { key:rowIndex }, [0...NUM_COLS].map (colIndex) ->
# 			# console.log 'gridkey', rowIndex + '-' + colIndex
# 			React.createElement('td', {
# 				className: (if rowIndex <= state.desiredRows - 1 and colIndex <= state.desiredCols - 1 then 'selected ' else '') + ((rowIndex + 1) + '-' + (colIndex + 1))
# 				key: rowIndex + '-' + colIndex
# 				onMouseOver: setDimensions.bind(self, rowIndex + 1, colIndex + 1)
# 				onMouseDown: onMouseDown.bind(self, rowIndex + 1, colIndex + 1)
# 			})
# 		)

# 	render: ->
# 		createRow = @createRow

# 		if @state.open
# 			grid = React.createElement('table', {
# 				onMouseOver: @onMouseOver
# 				onMouseOut: @onMouseOut
# 				key: 'table'
# 				}, React.createElement('tbody', null, [0...NUM_ROWS].map (index) ->
# 					createRow index
# 				))

# 			tooltip = React.createElement('div', {
# 				className: 'tooltip'
# 				key: 'tip'
# 			}, 'Insert ' + @state.desiredRows + '×' + @state.desiredCols + ' table')
# 		else
# 			grid = null
# 			tooltip = null

# 		React.createElement('div', {
# 			className: 'grid-button'
# 			key: 'button'
# 			onClick: @onMouseDown.bind(@, DEFAULT_NUM_ROWS, DEFAULT_NUM_COLS)
# 		}, [
# 			React.createElement('a', {
# 				onMouseOver: @onButtonMouseOver
# 				onMouseOut: @onMouseOut
# 				alt: @props.command.label
# 				key: 'a'
# 				style: {
# 					backgroundImage:'url("' + @props.command.icon + '")'
# 				}
# 			}, @props.command.label),
# 			grid,
# 			tooltip
# 		])


# module.exports = GridButton