OboSelectionPathNode = require './oboselectionpathnode'

class OboSelectionPath
	constructor: (index) ->
		@all = []
		@last = null
		@text = null

		curToken = ''
		curTokens = []
		curNode = null
		tokens = index.split '.'
		for token in tokens
			curTokens.push token
			curToken = curTokens.join '.'
			curNode = new OboSelectionPathNode(curToken)
			@all.push curNode

			if curToken.indexOf('t') > -1
				@text = curNode
			else
				@last = curNode


	# constructorOLDDELETEME: (domContainer) ->
	# 	@all = []
	# 	@last = null

	# 	node = domContainer
	# 	while node isnt document.body
	# 		# if node.getAttribute?('data-oboid')
	# 		selNode = new OboSelectionPathNode(node)
	# 		if selNode.type is 'obo'
	# 			@all.unshift selNode
	# 			if @last is null then @last = selNode

	# 		node = node.parentElement


module.exports = OboSelectionPath