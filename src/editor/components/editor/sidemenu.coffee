React = require 'react'


MARGIN = 10
WIDTH = 30
HEIGHT = 30

SideMenu = React.createClass
	getInitialState: ->
		chunkRect: @props.selection.chunkRect

	componentWillReceiveProps: (nextProps) ->
		@setState {
			chunkRect: nextProps.selection.chunkRect
		}

	onBeforeClick: ->
		@props.handlerFn 'before'

	onAfterClick: ->
		@props.handlerFn 'after'

	render: ->
		rect = @state.chunkRect

		if not rect then return null

		React.createElement('div', null,
			React.createElement('div', {
				onClick: @onBeforeClick,
				style: {
					position: 'absolute'
					left: '10px'
					top: (rect.top + window.scrollY - MARGIN - HEIGHT) + 'px'
					width: WIDTH + 'px'
					height: HEIGHT + 'px'
					background: 'rgba(255, 0, 0, 0.1)'
					border: '1px solid black'
				}
			}),
			React.createElement('div', {
				onClick: @onAfterClick,
				style: {
					position: 'absolute'
					left: '10px'
					top: (rect.bottom + window.scrollY + MARGIN) + 'px'
					width: WIDTH + 'px'
					height: HEIGHT + 'px'
					background: 'rgba(255, 0, 0, 0.1)'
					border: '1px solid black'
				}
			})
		)


module.exports = SideMenu