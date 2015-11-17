ComponentMap = require '../../util/componentmap'

OboSelectionPath = require './oboselectionpath'
OboSelectionDOMUtil = require './oboselectiondomutil'

class OboTextSelectionCaret
	constructor: (@index, @textIndex) ->
		console.log 'new OboTextSelectionCaret', @index, @textIndex
		# @domNode = OboSelectionDOMUtil.findNodeWithIndex @index

	clone: ->
		new OboTextSelectionCaret @index, @textIndex

	toDescriptor: ->
		index:     @index
		textIndex: @textIndex

Object.defineProperties OboTextSelectionCaret.prototype,
	"path":
		get: ->
			@_path = new OboSelectionPath(@index) if not @_path

			@_path

	"domNode":
		get: ->
			# # try to select by id
			# nodeById = document.getElementById @id
			# return nodeById if nodeById?

			# # else, select by path
			# OboSelectionDOMUtil.findTextByPath @path
			OboSelectionDOMUtil.findNodeWithIndex @index

	"id":
		get: ->
			@domNode.id

	"component": # Text component
		get: ->
			console.log 'component ID', @id
			ComponentMap.getComponentById @id

	"styleableText":
		get: ->
			@component.getStyleableText()

	"oboNode":
		get: -> @path.last.oboNode


module.exports = OboTextSelectionCaret