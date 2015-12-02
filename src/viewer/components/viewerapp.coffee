React = require 'react'

ComponentClassMap = require '../../util/componentclassmap'

OboSelection = require '../../obodom/selection/oboselection'

# @TODO - Dynamically or batch load all components
components =
	singletext:    require './singletext'
	figure:       require './figure'
	list:         require './list'


ViewerApp = React.createClass
	getInitialState: ->
		loDescriptor = require('../../debug/fakelo')

		ComponentClassMap.register 'singletext',    require './singletext'
		ComponentClassMap.register 'list',         require './list'
		ComponentClassMap.register 'figure',       require './figure'
		ComponentClassMap.register 'question',     require './question'

		root = descriptorToNode loDescriptor

		console.log 'lo be all lke', loDescriptor
		window.__lo = root
		console.log 'root be all like', root

		return (
			root: root
		)

	onMouseUp: ->
		return
		@sel = new OboSelection()
		# console.log(JSON.stringify(@sel.toDescriptor(), null, 2))

	saveSelection: ->
		@savedSel = @sel

	reselect: ->
		return if not @savedSel?

		s = new OboSelection @savedSel
		s.select()

	# render: ->
	# 	OboReact.createElement 'div', @state.root, '0',
	# 		{
	# 			onMouseUp: @onMouseUp
	# 		},
	# 		OboReact.createChildren @state.root, '0'

	render: ->
		'@TODO'

	renderOLD: ->
		oboNode = @state.root

		children = []
		for childNode, i in oboNode.children
			continue if not childNode.componentClass

			children.push React.createElement childNode.componentClass, {
				ref: oboNode.type + i,
				oboNode: childNode,
				key: childNode.id,
				index: i,
				saveHistory: @saveHistory
			}

		children.push React.createElement 'button', { onClick:@saveSelection }, 'SAVE SELECTION'
		children.push React.createElement 'button', { onClick:@reselect }, 'RE-SELECT'

		React.createElement 'div', {
			'data-oboid': oboNode.id,
			'data-obo-type': oboNode.type,
			'data-obo-index': 0,
			onMouseUp: @onMouseUp
		}, children



module.exports = ViewerApp