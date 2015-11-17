module.exports =
	findTextWithId: (node) ->
		while node isnt document.body
			if node.getAttribute?('data-obo-text')?
				return node

			node = node.parentElement

		return null

	findNodeWithIndex: (index) ->
		document.body.querySelector("*[data-obo-index='#{index}']")

	# findTextByPath: (path) ->
	# 	console.log 'findTextByPath', path
	# 	el = document.body
	# 	for pathNode in path.all
	# 		console.log pathNode
	# 		console.log 'looking in'
	# 		console.log el
	# 		console.log 'for'
	# 		console.log "[data-obo-type='#{pathNode.oboType}'][data-obo-index='#{pathNode.index}']"
	# 		console.log el.querySelector("[data-obo-type='#{pathNode.oboType}'][data-obo-index='#{pathNode.index}']");
	# 		el = el.querySelector("[data-obo-type='#{pathNode.oboType}'][data-obo-index='#{pathNode.index}']");
	# 		return null if not el?

		# el.querySelector("[data-obo-text]")