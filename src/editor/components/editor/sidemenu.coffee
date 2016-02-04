React = require 'react'

SideMenuList = require './sidemenu/sidemenulist'

MARGIN = 5
WIDTH = 30
HEIGHT = 30

SideMenu = React.createClass
	getInitialState: ->
		chunkRect: @props.selection.chunkRect
		inserts: @props.inserts

	componentWillReceiveProps: (nextProps) ->
		@setState {
			chunkRect: nextProps.selection.chunkRect
			inserts: nextProps.inserts
		}

	onBeforeClick: (componentClass) ->
		@props.handlerFn 'before', componentClass

	onAfterClick: (componentClass) ->
		@props.handlerFn 'after', componentClass

	render: ->
		rect = @state.chunkRect

		if not rect then return null

		React.createElement('div', { style:{
				# position: 'fixed'
				# zIndex: 1
				# left: 0
				# width: 50
				# top: 0
				# bottom: 0
			}},
			React.createElement(SideMenuList, {
				inserts: @state.inserts,
				onMouseDown: @onBeforeClick,
				yPos: rect.top + window.scrollY - MARGIN - HEIGHT
			}),
			React.createElement(SideMenuList, {
				inserts: @state.inserts,
				onMouseDown: @onAfterClick,
				yPos: rect.bottom + window.scrollY + MARGIN
			})
		)


module.exports = SideMenu