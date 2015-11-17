StyleableText = require '../../../text/styleabletext'

module.exports = ->
	return {
		createNewNodeData: ->
			text: new StyleableText()
			textIndent: 0

		createNodeDataFromDescriptor: (descriptor) ->
			text: StyleableText.createFromObject descriptor.data.text
			textIndent: 0

		getDataDescriptor: (oboNode) ->
			textIndent: oboNode.data.textIndent
			text: oboNode.data.text.getExportedObject()

		cloneNodeData: (data) ->
			console.log 'cloneNodeData', data
			text: data.text.clone()
			textIndent: data.textIndent

		splitNodeData: (dataLeft, dataRight, index) ->
			dataRight.text = dataLeft.text.split index

		mergeNodeData: (data, otherData) ->
			return if not otherData.text?
			data.text.merge otherData.text

		# insertText: (oboNode, commandEvent, range, text) ->
		# 	true

		# _oninsertText: (commandEvent, range, text) ->
		# 	sel = commandEvent.sel

		# 	if sel.type isnt 'caret'
		# 		deleteText commandEvent, range, text

		# 	if range.type is 'only' or range.type is 'start'
		# 		text.insertText range.start, commandEvent.data[0]
		# 		sel.start.index++

		# 	if range.type is 'only' or range.type is 'end'
		# 		sel.collapse()
	}