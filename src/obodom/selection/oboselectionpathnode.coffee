ComponentMap = require '../../util/componentmap'
OboNode = require '../obonode'

OboSelectionDOMUtil = require './oboselectiondomutil'

class OboSelectionPathNode
	constructor: (@index) ->
		@domNode = OboSelectionDOMUtil.findNodeWithIndex @index
		@id = @domNode.getAttribute 'data-oboid'
		@oboType = @domNode.getAttribute 'data-obo-type'

	# constructorOLDDELETEME: (domNode) ->
	# 	isOboNode = domNode.getAttribute?('data-oboid')

	# 	@type = if isOboNode then 'obo' else 'dom'
	# 	@id = if isOboNode then domNode.getAttribute 'data-oboid' else null
	# 	@index = if isOboNode then domNode.getAttribute 'data-obo-index' else null
	# 	@oboType = if isOboNode then domNode.getAttribute 'data-obo-type' else null

	# toDescriptor: ->
	# 	type: @type
	# 	id: @id
	# 	index: @index
	# 	oboType: @oboType


Object.defineProperties OboSelectionPathNode.prototype,
	"component":
		get: ->
			if @type is 'dom' then return null
			ComponentMap.getComponentById @id
	"oboNode":
		get: ->
			if @type is 'dom' then return null
			OboNode.document.getNodeById @id


module.exports = OboSelectionPathNode