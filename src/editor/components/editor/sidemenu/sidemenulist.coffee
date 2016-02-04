React = require 'react'

WIDTH = 30
HEIGHT = 30
MENU_OPEN_DURATION_MS = 500

SideMenuList = React.createClass
	getInitialState: ->
		open: false

	open: ->
		clearTimeout @timeoutId
		@setState { open:true }

	close: ->
		@timeoutId = setTimeout (->
			@setState { open:false }
		).bind(@), MENU_OPEN_DURATION_MS

	onMouseDown: (componentClass) ->
		@close()
		@props.onMouseDown componentClass

	render: ->
		onMouseDown = @onMouseDown

		children = []
		@props.inserts.forEach (componentClass, label) ->
			children.push React.createElement('button', {
				onMouseDown: onMouseDown.bind(@, componentClass)
			}, "+ #{label}")

		React.createElement('div', {
			className: 'side-menu ' + (if @state.open then 'open' else '')
			onMouseOver:@open,
			onMouseOut:@close,
			style: {
				position: 'absolute'
				left: '10px'
				top: @props.yPos + 'px'
				zIndex: 100
			}},
			React.createElement('div', {
				className:'insert-button',
				style: {
					width: WIDTH + 'px'
					height: HEIGHT + 'px'
					display: 'inline-block'
					verticalAlign: 'middle'
				}}, '+'),
			React.createElement('div', {
				className:'insert-list',
				style: {
					display: (if @state.open then 'inline-block' else 'none')
					verticalAlign: 'middle'
				}}, children)
		)


module.exports = SideMenuList