class OboDocument
	constructor: ->
		@nodes = new Map

	register: (node) ->
		@nodes.set node.id, node

	unregister: (node) ->
		@nodes.delete node.id

	getNodeById: (id) ->
		@nodes.get(id)

	getNodeOfElement: (el) ->
		return if not el?.getAttribute? or not el.getAttribute('data-oboid')
		@nodes.get el.getAttribute('data-oboid')


oboDocument = new OboDocument()


module.exports = oboDocument