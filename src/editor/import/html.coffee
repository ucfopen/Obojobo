ComponentClassMap = require '../../util/componentclassmap'

# We need to append our html that we're attempting to paste on the DOM
# so window.getComputedStyle will work.
class TempDOM
	constructor: ->
		@container = null

	init: ->
		@container = document.createElement 'div'
		document.body.appendChild @container

	create: (tagName) ->
		if not @container? then @init()

		el = document.createElement tagName
		@container.appendChild el

		el

	remove: (el) ->
		@container.removeChild el
		if @container.childNodes.length is 0 then @removeAll()

	removeAll: ->
		document.body.removeChild @container
		@container = null




getTagName = (node) ->
	return ''if node.nodeType isnt Node.ELEMENT_NODE
	node.tagName.toLowerCase()

createOboNodesFromDOMNode = (node) ->
	console.log 'createOboNodesFromDOMNode', node

	componentClass = null

	# first, see if this is copied from our HTML, in which case we can be more specific
	type = node.getAttribute('data-component-type')
	if type?
		componentClass = ComponentClassMap.getClassForType type
		mainEls = node.getElementsByClassName('main')
		console.log 'main els be'
		console.log node
		console.log mainEls, mainEls.length
		if mainEls?.length? and mainEls.length >= 1
			node = mainEls[0]
			console.log 'CHANGING NODE', mainEls, node

	# else, see if there's a component out there that can read elements of this type
	if not componentClass?
		tagName = getTagName(node)
		componentClass = ComponentClassMap.getClassForElement tagName

	console.log 'componentClass', componentClass

	if not componentClass then return [] # OR FRAGMENT?

	console.log 'SO', node
	nodes = componentClass.createNewNodesFromElement node

	console.log 'createOboNodesFromDOMNode___', nodes

	nodes

sanitize = (node) ->
	switch getTagName(node)
		when 'span'
			document.createTextNode(' ') if node.classList.contains 'Apple-converted-space'
		when 'meta'
			null
		else
			node

completeFragment = (oboNodes, fragment) ->
	if fragment.childNodes.length > 0
		createdOboNodes = createOboNodesFromDOMNode fragment

		if createdOboNodes.length > 0
			for oboNode in createdOboNodes
				oboNode.type = 'fragment'
				oboNodes.push oboNode

debug__cleanEl = (el) ->
	if el.removeAttribute?
		el.removeAttribute 'style'
		el.removeAttribute 'class'
	for childNode in el.childNodes
		debug__cleanEl(childNode)

getOboNodesFromHTML = (html) ->
	console.log 'PASTE HTML'
	console.log html
	tempDOM = new TempDOM

	container = tempDOM.create 'div'
	container.innerHTML = html
	container.normalize()

	container2 = tempDOM.create 'div'
	container2.innerHTML = html
	container2.normalize()
	debug__cleanEl(container2)
	console.log(container2);

	fragment = tempDOM.create 'p'

	oboNodes = [] #chunks = []

	getOboNodesFromHTMLHelper oboNodes, container, fragment

	console.log 'FRAGMENT'
	console.log fragment

	completeFragment oboNodes, fragment

	# we only allow fragments to exist as the first or last node - all others
	# we can simply turn into paragraphs
	# if oboNodes.length >= 3
		# for i in [1..oboNodes.length - 2]
			# oboNodes[i].init() if oboNodes[i].type is TextChunkNode.TYPE_FRAGMENT

	tempDOM.removeAll()

	oboNodes

getOboNodesFromHTMLHelper = (oboNodes, el, curFragment) ->
	for node in Array.prototype.slice.call(el.childNodes)
		node = sanitize node
		continue if not node?

		createdOboNodes = createOboNodesFromDOMNode node

		if createdOboNodes.length > 0
			completeFragment oboNodes, curFragment

			for oboNode in createdOboNodes
				oboNodes.push oboNode
		else
			clone = node.cloneNode false
			curFragment.appendChild clone

			if node.nodeType is Node.ELEMENT_NODE
				getOboNodesFromHTMLHelper node, clone


module.exports = getOboNodesFromHTML