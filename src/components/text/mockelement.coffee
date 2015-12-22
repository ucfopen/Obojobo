class MockElement
	constructor: (@type, @attrs = {}) ->
		@nodeType = 'element'
		@children = []
		@parent = null

	addChild: (child) ->
		@children.push child
		child.parent = @

	addChildAt: (child, atIndex) ->
		@children.splice atIndex, 0, child
		child.parent = @

	getChildIndex: (child) ->
		@children.indexOf child

	addBefore: (childToAdd, targetChild) ->
		index = @getChildIndex targetChild
		@addChildAt childToAdd, index

	addAfter: (childToAdd, targetChild) ->
		index = @getChildIndex targetChild
		@addChildAt childToAdd, index + 1

	replaceChild: (childToReplace, newChild) ->
		index = @getChildIndex childToReplace
		@children[index] = newChild
		newChild.parent = @
		childToReplace.parent = null


Object.defineProperties MockElement.prototype,
	"firstChild": get: -> @children[0]
	"lastChild": get: -> @children[@children.length - 1]


module.exports = MockElement