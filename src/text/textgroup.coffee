ObjectAssign = require 'object-assign'
StyleableText = require './styleabletext'

createData = (data, template) ->
	clone = ObjectAssign {}, data

	for key of clone
		if not template[key]?
			delete clone[key]

	for key of template
		if not clone[key]?
			if typeof template[key] is 'object'
				clone[key] = ObjectAssign {}, template[key]
			else
				clone[key] = template[key]

	clone

defaultCloneFn = (data) ->
	ObjectAssign {}, data

defaultMergeFn = (consumer, digested) ->
	ObjectAssign consumer, digested


class TextGroupItem
	constructor: (@text = new StyleableText(), @data = {}) ->

	clone: (cloneDataFn = defaultCloneFn) ->
		new TextGroupItem @text.clone(), cloneDataFn(@data)


class TextGroup
	constructor: (@maxItems = Infinity, dataTemplate = {}, @items = []) ->
		@dataTemplate = Object.freeze ObjectAssign({}, dataTemplate)

	clear: ->
		@items = []

	init: (numItems = 1) ->
		@clear()

		while numItems--
			@add()

		@

	fill: ->
		return if @maxItems is Infinity

		while not @isFull
			@add()

		@

	add: (text, data) ->
		return @ if @isFull

		@items.push new TextGroupItem text, createData(data, @dataTemplate)
		@

	addAt: (index, text, data) ->
		return @ if @isFull

		@items.splice index, 0, new TextGroupItem(text, createData(data, @dataTemplate))
		@

	addGroup: (group, cloneDataFn = defaultCloneFn) ->
		for item in group.items
			clone = item.clone cloneDataFn
			@add clone.text, createData(clone.data, @dataTemplate)
		@

	get: (index) ->
		@items[index]

	remove: (index) ->
		@items.splice(index, 1)[0]

	clone: (cloneDataFn = defaultCloneFn) ->
		clonedItems = []

		for item in @items
			clonedItems.push item.clone(cloneDataFn)

		new TextGroup @maxItems, @dataTemplate, clonedItems

	toDescriptor: (dataToDescriptorFn = defaultCloneFn) ->
		desc = []

		for item in @items
			desc.push { text:item.text.getExportedObject(), data:dataToDescriptorFn(item.data) }

		desc

	slice: (from, to = Infinity) ->
		@items = @items.slice from, to

	split: (index) ->
		siblingItems = @items[index+1..]
		@items = @items[0..index]

		new TextGroup @maxItems, @dataTemplate, siblingItems

	splitText: (index, textIndex, cloneDataFn = defaultCloneFn) ->
		item = @items[index]

		newItem = new TextGroupItem
		newItem.data = cloneDataFn item.data
		newItem.text = item.text.split textIndex

		@items.splice index + 1, 0, newItem
		@

	merge: (index, mergeDataFn = defaultMergeFn) ->
		digestedItem = @items.splice(index + 1, 1)[0]
		consumerItem = @items[index]

		consumerItem.data = createData(mergeDataFn(consumerItem.data, digestedItem.data), @dataTemplate)

		consumerItem.text.merge digestedItem.text
		@

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

		@

	styleText: (startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) ->
		@applyStyleFunction 'styleText', arguments

	unstyleText: (startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) ->
		@applyStyleFunction 'unstyleText', arguments

	#@TODO - This won't work correctly
	toggleStyleText: (startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) ->
		@applyStyleFunction 'toggleStyleText', arguments

	applyStyleFunction: (fn, args) ->
		[startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData] = args

		# console.log 'APPLY STYLE FUNCTION', startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData

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

		@

	getStyles: (startIndex, startTextIndex, endIndex, endTextIndex) ->
		startItem = @items[startIndex]
		endItem   = @items[endIndex]
		startText = startItem.text
		endText   = endItem.text

		if startText is endText
			return startText.getStyles startTextIndex, endTextIndex

		numTexts = 0
		allStyles = {}
		foundStartText = false
		for item in @items
			styles = {}

			if item.text is startText
				numTexts++
				styles = item.text.getStyles startTextIndex, startText.length
				foundStartText = true
			else if item.text is endText
				numTexts++
				styles = item.text.getStyles 0, endTextIndex
			else if foundStartText
				numTexts++
				styles = item.text.getStyles 0, item.text.length

			for style of styles
				if allStyles[style]?
					allStyles[style]++
				else
					allStyles[style] = 1

			if item.text is endText then break

		returnedStyles = {}
		for style of allStyles
			if allStyles[style] is numTexts
				returnedStyles[style] = style

		returnedStyles


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
		"get": -> @items[@items.length - 1]

	"isFull":
		"get": -> @items.length is @maxItems

	"isEmpty":
		"get": -> @items.length is 0
}

TextGroup.fromDescriptor = (descriptor, maxItems, dataTemplate, restoreDataDescriptorFn = defaultCloneFn) ->
	items = []
	for item in descriptor
		items.push new TextGroupItem(StyleableText.createFromObject(item.text), restoreDataDescriptorFn(item.data))

	new TextGroup maxItems, dataTemplate, items

TextGroup.create = (maxItems = Infinity, dataTemplate = {}, numItemsToCreate = 1) ->
	group = new TextGroup maxItems, dataTemplate
	group.init numItemsToCreate

	group


#@TODO
window.TextGroup = TextGroup


module.exports = TextGroup