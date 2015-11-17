class OboSelectionRange
	constructor: (@type, @start, @end, @oboNode) ->

Object.defineProperties OboSelectionRange.prototype,
	component:
		get: -> ComponentMap.getComponentById @oboNode.id


module.exports = OboSelectionRange