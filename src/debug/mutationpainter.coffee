
timeoutId = null

#select the target node
target = document.body

#create an observer instance
observer = new MutationObserver (mutations) ->
	for mutation in mutations
		continue if mutation.attributeName is 'class' and mutation.oldValue is 'mutate'

		node = mutation.target
		if node.nodeType is Node.TEXT_NODE then node = node.parentNode
		node.classList.add 'mutate'

	clearTimeout timeoutId
	timeoutId = setTimeout ->
		els = document.querySelectorAll('.mutate')
		for el in els
			el.classList.remove 'mutate'
	, 500



#configuration of the observer:
config = { attributes: false, childList: true, characterData: true, subtree:true, attributeOldValue:false };

#pass in the target node, as well as the observer options



#later, you can stop observing
#

module.exports =
	observe: -> observer.observe(target, config)
	disconnect: -> observer.disconnect()
