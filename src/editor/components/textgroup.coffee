StyleableText = require '../../text/styleabletext'

class TextGroupItem
	constructor: (@text = new StyleableText(), @data = {}) ->

defaultCloneFn = (data) ->
	Object.assign {}, data

defaultMergeFn = (consumer, digested) ->
	Object.assign consumer, digested

class TextGroup
	constructor: (@items = [new TextGroupItem]) ->

	add: (text, data) ->
		@items.push new TextGroupItem text, data

	addAt: (index, text, data) ->
		@items.splice index, 0, new TextGroupItem(text, data)

	get: (index) ->
		@items[index]

	remove: (index) ->
		@items.splice index, 1

	clone: (cloneDataFn = defaultCloneFn) ->
		clonedItems = []

		for item in @items
			clonedItems.push new TextGroupItem(item.text.clone(), cloneDataFn(item.data))

		new TextGroup clonedItems

	toDescriptor: (dataToDescriptorFn = defaultCloneFn) ->
		desc = []

		for item in @items
			desc.push { text:item.text.getExportedObject(), data:dataToDescriptorFn(item.data) }

		desc

	split: (index) ->
		siblingItems = @items[index+1..]
		@items = @items[0..index]

		new TextGroup siblingItems

	splitText: (index, textIndex, cloneDataFn = defaultCloneFn) ->
		item = @items[index]

		newItem = new TextGroupItem
		newItem.data = cloneDataFn item.data
		newItem.text = item.text.split textIndex

		@items.splice index + 1, 0, newItem

	merge: (index, mergeDataFn = defaultMergeFn) ->
		digestedItem = @items.splice(index + 1, 1)[0]
		consumerItem = @items[index]

		consumerItem.data = mergeDataFn consumerItem.data, digestedItem.data

		consumerItem.text.merge digestedItem.text

	deleteSpan: (startIndex, startTextIndex, endIndex, endTextIndex, mergeFn = defaultMergeFn) ->
		startItem = @items[startIndex]
		endItem   = @items[endIndex]
		startText = startItem.text
		endText   = endItem.text

		if startText is endText
			startText.deleteText startTextIndex, endTextIndex
			return

		startText.deleteText startTextIndex, startText.length
		endText.deleteText 0, endTextIndex

		newItems = []
		for item, i in @items
			if i < startIndex or i > endIndex
				newItems.push item
			else if i is startIndex
				newItems.push startItem
			else if i is endIndex
				newItems.push endItem

		@items = newItems
		@merge startIndex

	clearSpan: (startIndex, startTextIndex, endIndex, endTextIndex) ->
		startItem = @items[startIndex]
		endItem   = @items[endIndex]
		startText = startItem.text
		endText   = endItem.text

		if startText is endText
			startText.deleteText startTextIndex, endTextIndex
			return

		startText.deleteText startTextIndex, startText.length
		endText.deleteText 0, endTextIndex

		for item, i in @items
			if i > startIndex and i < endIndex
				item.text.init()

	styleText: (startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) ->
		@applyStyleFunction 'styleText', arguments

	unstyleText: (startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) ->
		@applyStyleFunction 'unstyleText', arguments

	#@TODO - This won't work correctly
	toggleStyleText: (startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) ->
		@applyStyleFunction 'toggleStyleText', arguments

	applyStyleFunction: (fn, args) ->
		[startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData] = args

		console.log 'APPLY STYLE FUNCTION', startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData

		startItem = @items[startIndex]
		endItem   = @items[endIndex]
		startText = startItem.text
		endText   = endItem.text

		if startText is endText
			startText[fn] startTextIndex, endTextIndex, styleType, styleData
			return


		foundStartText = false
		for item in @items
			if item.text is startText
				item.text[fn] startTextIndex, startText.length, styleType, styleData
				foundStartText = true
			else if item.text is endText
				item.text[fn] 0, endTextIndex, styleType, styleData
				break
			else if foundStartText
				item.text[fn] 0, item.text.length, styleType, styleData




	__debug_print: ->
		console.log '========================'
		for item in @items
			item.text.__debug_print()
			console.log JSON.stringify item.data
			console.log '---------------------'


Object.defineProperties TextGroup.prototype, {
	"length":
		"get": -> @items.length

	"first":
		"get": -> @items[0]

	"last":
		"get": ->
			@items[@items.length - 1]
}

TextGroup.fromDescriptor = (descriptor, restoreDataDescriptorFn = defaultCloneFn) ->
	items = []
	for item in descriptor
		items.push new TextGroupItem(StyleableText.createFromObject(item.text), restoreDataDescriptorFn(item.data))

	new TextGroup items




module.exports = TextGroup