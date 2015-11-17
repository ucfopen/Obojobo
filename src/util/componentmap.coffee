# @TODO: Use refs instead - https://facebook.github.io/react/docs/more-about-refs.html

generateId = require './uuid'

components = new Map

module.exports = {
	registerComponent: (component, id = null) ->
		if not id then id = generateId()
		return if components.has id
		components.set id, component

		id

	unregisterComponent: (id) ->
		components.delete id

	getComponentById: (id) ->
		components.get id

	# getComponentOfElement: (el) ->
	# 	return if not el?.getAttribute?('data-comp-id')?
	# 	components.get el.getAttribute('data-comp-id')

	debug__getComponents: ->
		components
}

#@TODO
window.__components = components