getDFS = (arr, node) ->
	arr.push node
	for child in node.children
		getDFS arr, child

getRDFS = (arr, node) ->
	arr.push node
	for i in [node.children.length - 1..0] by -1
		child = node.children[i]
		getRDFS arr, child

module.exports =
	getDFS: getDFS
	getRDFS: getRDFS