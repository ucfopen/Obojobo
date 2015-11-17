StyleType = require './styletype'
StyleRange = require './stylerange'


keySortFn = (a, b) ->
	Number(a) - Number(b)


class ChunkStyleList
	constructor: ->
		@styles = []

		# Object.observe @styles, ->
		# 	console.log 'chunkstylelist changed'

	getExportedObject: ->
		output = []

		for style in @styles
			output.push style.getExportedObject()

		output

	clone: ->
		cloneStyleList = new ChunkStyleList

		for style in @styles
			cloneStyleList.add style.clone()

		cloneStyleList

	length: ->
		@styles.length

	get: ->
		@styles[i]

	add: (styleRange) ->
		@styles.push styleRange

	remove: (styleRange) ->
		comparisons = @getStyleComparisonsForRange styleRange.start, styleRange.end, styleRange.type

		# For any ranges that are enscapulated by this range we simply delete them
		for co in comparisons.enscapsulatedBy
			co.invalidate()

		# For any left ranges we need to trim off the right side
		for co in comparisons.left
			co.end = styleRange.start

		# For any right ranges we need to trim off the left side
		for co in comparisons.right
			co.start = styleRange.end

		# For any contained ranges we have to split them into two new ranges
		for co in comparisons.contains
			origEnd = co.end
			co.end = styleRange.start
			@add new StyleRange(styleRange.end, origEnd, co.type, co.data)

		@normalize()

	# type is optional
	getStyleComparisonsForRange: (from, to, type) ->
		type = type or null
		to = to or from

		comparisons =
			after: []
			before: []
			enscapsulatedBy: []
			contains: []
			left: []
			right: []

		#@TODO - optimize
		for style in @styles
			curComparison = style.compareToRange from, to
			if type is null or style.type is type
				comparisons[curComparison].push style

		comparisons

	# Return true if the entire text range is styled by styleType
	rangeHasStyle: (from, to, styleType) ->
		@getStyleComparisonsForRange(from, to, styleType).contains.length > 0

	# Return the ranges that are within the entire text range
	getRangesInRange: (from, to) ->
		@getStyleComparisonsForRange(from, to).contains

	# Returns a simple object with all the styles that are within the entire text range
	getStylesInRange: (from, to) ->
		styles = {}

		for range in @getRangesInRange(from, to)
			styles[range.type] = range.type

		styles

	cleanupSuperscripts: ->
		# console.log 'cleanupSubSup', @styles

		mark = []
		newStyles = []

		for styleRange in @styles
			if styleRange.type isnt StyleType.SUPERSCRIPT
				newStyles.push styleRange
				continue

			mark[styleRange.start] = 0 if not mark[styleRange.start]?
			mark[styleRange.end]   = 0 if not mark[styleRange.end]?

			level = parseInt styleRange.data, 10

			mark[styleRange.start] += level
			mark[styleRange.end]   -= level

		# console.log 'mark', mark

		curRange = new StyleRange -1, -1, StyleType.SUPERSCRIPT, 0
		curLevel = 0
		for level, i in mark
			continue if not mark[i]?

			curLevel += level

			if curRange.start is -1
				curRange.start = i
				curRange.data = curLevel
			else if curRange.end is -1
				curRange.end = i

				newStyles.push curRange if curRange.data isnt 0

				curRange = new StyleRange i, -1, StyleType.SUPERSCRIPT, curLevel

		# console.log 'styles before', JSON.stringify(@styles, null, 2)
		@styles = newStyles
		# @styles.length = 0
		# for style in newStyles
		# 	@styles.push style
		# console.log 'styles after ', JSON.stringify(@styles, null, 2)

	# 1. Loop through every style range for every type
	# 2. In an array A add 1 to A[range.start] and add -1 to A[range.end]
	# 3. Clear out the style list.
	# 4. Loop through A
	# 5. When you find a 1, that starts a new range
	# 6. Continue to add up numbers that you discover
	# 7. When your total is a 0 that ends the range
	normalize: ->
		# console.time 'normalize'
		#@TODO - possible to improve runtime if we sort the styles?

		@cleanupSuperscripts()

		newStyles = []

		# We can't merge in link styles since they might have different URLs!
		# We have to treat them seperately
		# [b: [b], i: [i], a: [google, microsoft]]
		datasToCheck = {};
		dataValues = {};
		#@TODO - is it ok here to rely on this object's order?
		for styleName, styleType of StyleType
			datasToCheck[styleType] = []
			dataValues[styleType] = []

		for i in [@styles.length - 1..0] by -1
			styleRange = @styles[i]
			curData = styleRange.data
			curEncodedData = JSON.stringify curData

			if datasToCheck[styleRange.type].indexOf(curEncodedData) is -1
				datasToCheck[styleRange.type].push curEncodedData
				dataValues[styleRange.type].push curData

		#console.log datasToCheck
		#console.log dataValues

		for styleType, datas of dataValues
			#console.log 'loop', styleType, datas
			for data in datas
				tmp = {}
				total = 0
				start = null

				for range in @styles
					range.invalidate() if range.length() is 0

					if range.isMergeable styleType, data
						tmp[range.start] ?= 0
						tmp[range.end] ?= 0

						tmp[range.start]++
						tmp[range.end]--

				keys = Object.keys(tmp).sort(keySortFn)

				for key in keys
					end = Number(key)
					t = tmp[key]
					# if not isNaN t
					# console.log 'here'
					start ?= end
					total += t
					if total is 0
						newStyles.push new StyleRange(start, end, styleType, data)
						start = null

		@styles = newStyles

		# console.timeEnd 'normalize'

ChunkStyleList.createFromObject = (o) ->
	styleList = new ChunkStyleList()

	for rangeObj in o
		styleList.add StyleRange.createFromObject rangeObj

	styleList


module.exports = ChunkStyleList