assign = require 'object-assign'
oboDocument = require './obodocument'
generateId = require '../util/uuid'
ComponentClassMap = require '../util/componentclassmap'

OboNodeUtil = require './obonodeutil'
getDFS = OboNodeUtil.getDFS
getRDFS = OboNodeUtil.getRDFS


class OboNode
	constructor: (@type, @data = {}) ->
		@id = generateId()
		@parent = null
		@children = []
		@componentClass = ComponentClassMap.getClassForType @type
		@document.register @

	clone: (deep = false) ->
		console.log 'clone', @
		clonedData = {}
		if @componentClass
			clonedData = @componentClass.cloneNodeData @data

		cloneNode = new OboNode @type, clonedData
		# cloneNode.data = assign({}, @data)
		# cloneNode.data = JSON.parse JSON.stringify(@data)

		if deep
			for child in @children
				cloneNode.addChild child.clone(true)

		cloneNode

	toDescriptor: (deep = false) ->
		# Copy data, using the component class' getDataDescriptor method.
		# If this is a classless node, do a simple scalar value copy.
		if @componentClass?.getDataDescriptor?
			dataDescriptor = @componentClass.getDataDescriptor @
		else
			dataDescriptor = {}
			for k, v of @data
				if typeof v is "string" or typeof v is "number"
					dataDescriptor[k] = v;

		children = []
		if deep
			for child in @children
				children.push child.toDescriptor(true)

		id: @id
		type: @type
		component: @component
		data: dataDescriptor
		children: children


	# Query methods
	# ------------------------------------
	hasChild: (child) ->
		@getIndexOfChild(child) > -1

	contains: (node) ->
		return false if not node?
		node.containedBy @

	containedBy: (node) ->
		return false if not node?
		return true if @ is node
		return false if not @parent?
		@parent.containedBy node


	# Child accessor methods
	# ------------------------------------
	getChildById: (id) ->
		for child in @children
			if child.id is id then return child

		null

	getIndexOfChild: (child) ->
		@children.indexOf child


	# Parenting methods
	# ------------------------------------
	disownChild: (child) ->
		child.parent = null

		index = @getIndexOfChild child
		if index > -1
			@children.splice(index, 1)

	claimChild: (child) ->
		if child.parent
			child.parent.disownChild child

		child.parent = @


	# Add methods
	# ------------------------------------
	addChild: (node) ->
		@addChildAt node, @children.length

	addChildAt: (node, atIndex) ->
		if @hasChild node
			@moveChild node, atIndex
			return node

		node.remove()
		@children.splice atIndex, 0, node
		@claimChild node

		node

	addChildBefore: (node, referenceNode) ->
		index = @getIndexOfChild referenceNode
		@addChildAt node, index

	addChildAfter: (node, referenceNode) ->
		index = @getIndexOfChild referenceNode
		@addChildAt node, index + 1

	addBefore: (newNode) ->
		if not @parent then throw "Can't call addBefore on a root node"
		@parent.addChildBefore newNode, @

	addAfter: (newNode) ->
		if not @parent then throw "Can't call addAfter on a root node"
		@parent.addChildAfter newNode, @


	# Move methods
	# ------------------------------------
	moveChild: (node, toIndex) ->
		if not @hasChild(node) then throw "Don't own child to move";

		fromIndex = @getIndexOfChild node
		toIndex = Math.max(0, Math.min(@children.length - 1, toIndex))

		# Remove node from list
		@children.splice fromIndex, 1

		# Add it back
		@children.splice toIndex, 0, node


	# Remove methods
	# ------------------------------------
	removeChild: (node) ->
		index = @getIndexOfChild node

		if index > -1
			@children.splice index, 1
			@disownChild node
			@document.unregister @
			# ComponentMap.unregisterComponent @id

		node

	removeChildAt: (index) ->
		@removeChild @children[index]

	remove: ->
		if @parent?
			@parent.removeChild @

		@


	# Replacement methods
	# ------------------------------------
	replaceChild: (oldNode, newNode) ->
		index = @getIndexOfChild oldNode
		@removeChildAt index
		@addChildAt newNode, index

	replaceWith: (replacement) ->
		@parent.replaceChild @, replacement


	# Slicing methods
	# ------------------------------------
	split: (childIndex) ->
		# new sibling has cloned data
		newSibling = @clone()
		curChild = @children[childIndex]
		while curChild
			newSibling.addChild curChild
			curChild = @children[childIndex]

		@addAfter newSibling



	# @TODO DEBUG
	# ------------------------------------
	__debug_print: (indent = '') ->
		nodeValue = ''
		if @data?.text?.value?
			nodeValue = @data.text.value

		console.log indent + @id + ' [' + @type + ']' + '<' + nodeValue + '>'
		for node in @children
			node.__debug_print(indent + '  ')

		return


Object.defineProperties OboNode.prototype,
	"firstChild":
		get: -> @children[0]
	"lastChild":
		get: -> @children[@children.length - 1]
	"isFirstChild":
		get: ->
			return true if @parent is null
			@ is @parent.firstChild
	"isLastChild":
		get: ->
			return true if @parent is null
			@ is @parent.lastChild
	"index":
		get: ->
			return -1 if not @parent?
			@parent.getIndexOfChild @
	"prevSibling":
		get: ->
			i = @index
			return null if not @parent? or i is 0
			@parent.children[i - 1]
	"prev":
		get: ->
			rdfs = []
			getRDFS rdfs, @root

			for child, i in rdfs
				if child is @
					return rdfs[i + 1] if rdfs[i + 1]?
					break

			return null
	"nextSibling":
		get: ->
			i = @index
			return null if not @parent? or i is @parent.children.length - 1
			@parent.children[i + 1]
	"next":
		get: ->
			dfs = []
			getDFS dfs, @root

			for child, i in dfs
				if child is @
					return dfs[i + 1] if dfs[i + 1]?
					break

			return null
	"document":
		get: ->
			OboNode.document
	"root":
		get: ->
			# optimizeable?
			node = @
			while node.parent isnt null
				node = node.parent

			node

	# "component":
	# 	get: ->
	# 		ComponentMap.getComponentById @id
	# 	set: (componentInstance) ->
	# 		ComponentMap.registerComponent componentInstance, @id
	"domEl":
		get: ->
			document.querySelector "[data-oboid='#{@id}']"


#@TODO - should this be here?
OboNode.create = (ComponentClass = null, data = null) ->
	ComponentClass ?= ComponentClassMap.getDefaultComponentClass()
	data ?= ComponentClass.createNewNodeData()

	new OboNode ComponentClassMap.getTypeOfClass(ComponentClass), data

OboNode.document = oboDocument




# -------------------------------------------------
# -------------------------------------------------
# -------------------------------------------------
# -------------------------------------------------
# -------------------------------------------------
# -------------------------------------------------
# -------------------------------------------------
# -------------------------------------------------
# -------------------------------------------------
# -------------------------------------------------

# class OboNodeOld
# 	constructor: (@nodeType = 'none', data = {}) ->
# 		@id = OboNode.generateId()
# 		@parent = null
# 		@children = []
# 		@childrenById = {}

# 		@containingElement = null
# 		@element = null

# 		@ingestData data

# 		# OboNode.registerNode @

# 	ingestData: (data) ->
# 		null

# 	composeData: ->
# 		{}

# 	getMeta: ->
# 		meta = new OboMeta @id, @nodeType, @constructor.name, @composeData()

# 		for child in @children
# 			meta.children.push child.getMeta()

# 		meta

# 	ingestMeta: (meta) ->
# 		newNode = OboNode.createFromMeta meta

# 		@id = newNode.id
# 		@ingestData newNode.composeData()
# 		@children = newNode.children
# 		@childrenById = newNode.childrenById

# 	clear: ->
# 		@children = []
# 		@childrenById = {}












# 	clean: ->
# 		@onClean()
# 		for child in @children
# 			child.clean()



# 	__debug_print: (indent = '') ->
# 		nodeValue = ''
# 		if @text?
# 			nodeValue = @text.value
# 		console.log indent + @nodeType + ':' + @id + ' [' + @type + ']' + '<' + nodeValue + '>'
# 		for node in @children
# 			node.__debug_print(indent + '  ')






# OboNode.TYPE_ROOT    = 'root'
# OboNode.TYPE_PAGE    = 'page'
# OboNode.TYPE_PAGELET = 'pagelet'
# OboNode.TYPE_CHUNK   = 'chunk'
# OboNode.TYPE_NONE    = 'none'



# OboNode.generateId = ->
# 	#https://gist.github.com/jed/982883
# 	getId = (a) -> if a then (a^Math.random()*16>>a/4).toString(16) else ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,getId)
# 	getId()

# # need a way to hold onto constructors when importing content
# OboNode.registered = {}
# OboNode.register =  (label, constructor) ->
# 	OboNode.registered[label] = constructor

# OboNode.nodes = {}

# OboNode.registerNode = (node) ->
# 	OboNode.nodes[node.id] = node

# OboNode.getNodeById = (id) ->
# 	return null if not OboNode.nodes[id]
# 	OboNode.nodes[id]

# OboNode.getNodeOfElement = (el) ->
# 	OboNode.getNodeById el.getAttribute('data-oboid')

# # OboNode.getNodesBetween = (startingOboNode, endingOboNode) ->
# # 	nodes = []
# # 	curNode = startingOboNode
# # 	while curNode isnt null
# # 		nodes.push curNode
# # 		if curNode is endingOboNode then break
# # 		curNode = curNode.next

# # 	nodes

# OboNode.createFromObject = (o) ->
# 	console.log '@TODO - OboNode.createFromObject', o
# 	new OboNode.registered[o.name] o

# OboNode.createFromMeta = (meta) ->
# 	oboNode = new OboNode.registered[meta.nodeClass] meta.data
# 	oboNode.id = meta.id
# 	oboNode.nodeType

# 	for child in meta.children
# 		oboNode.addChild OboNode.createFromMeta(child)

# 	# OboNode.registerNode oboNode

# 	oboNode

# OboNode.createFromJSON = (json) ->
# 	OboNode.createFromMeta OboMeta.createFromJSON(json)


window.OboNode = OboNode

# console.log 'HAY'
# a = new OboNode()
# b = new OboNode()
# a.addChildAfter b
# a.data.fun = 1
# console.log a
# c = a.clone()
# console.log c
# console.log c == a
# console.log c.children[0] == a.children[0]
# console.log 'next', a.next


module.exports = OboNode