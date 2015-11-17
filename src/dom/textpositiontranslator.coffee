# DOMUtil = require './domutil'
# DOMCursor = require '../selection/domcursor'

# TextPositionTranslator =
# 	getChunkTextPositionAtCursor: (targetTextNode, offset, element) ->
# 		totalCharactersFromStart = 0
# 		element ?= DOMUtil.getOboElementFromChild targetTextNode.parentElement, 'chunk'

# 		for textNode in DOMUtil.getTextNodesInOrder(element)
# 			break if textNode is targetTextNode
# 			totalCharactersFromStart += textNode.nodeValue.length

# 		totalCharactersFromStart + offset

# 	getDOMCursorForElementAtTextPosition: (element, textPos) ->
# 		totalCharactersFromStart = 0

# 		for textNode in DOMUtil.getTextNodesInOrder(element)
# 			if totalCharactersFromStart + textNode.nodeValue.length > textPos
# 				return new DOMCursor textNode, textPos - totalCharactersFromStart

# 			totalCharactersFromStart += textNode.nodeValue.length

# 		# We are at the end, so return the last node
# 		new DOMCursor textNode, Math.min(textPos - totalCharactersFromStart + textNode.nodeValue.length, textNode.nodeValue.length)


# module.exports = TextPositionTranslator