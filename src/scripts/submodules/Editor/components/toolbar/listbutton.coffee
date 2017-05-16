MOUSE_OUT_DELAY_MS = 200

ListButton = React.createClass
	getInitialState: ->
		open: false

	onMouseOver: ->
		clearInterval @mouseOutTimeoutId
		@setState { open:true }

	onMouseOut: ->
		@mouseOutTimeoutId = setTimeout (->
			@setState { open:false }
		).bind(@), MOUSE_OUT_DELAY_MS

	onMouseDown: (listItem) ->
		@setState { open:false }
		@props.commandHandler @props.command, { listItem:listItem }

	render: ->
		onMouseDown = @onMouseDown

		if @state.open
			list = React.createElement('ul', {
				onMouseOver: @onMouseOver,
				onMouseOut: @onMouseOut
				}, @props.command.listItems.map (listItem, index) ->
					React.createElement('li', { key:index, onMouseDown:onMouseDown.bind(@, listItem.id) }, listItem.label)
				)
		else
			list = null

		React.createElement('div', {
			className: 'list-button'
			key: 'button'
		}, [
			React.createElement('a', {
				onMouseOver: @onMouseOver
				onMouseOut: @onMouseOut
				alt: @props.command.label
				key: 'a'
				style: {
					backgroundImage:'url("' + @props.command.img + '")'
				}
			}, @props.command.label),
			list
		])


module.exports = ListButton