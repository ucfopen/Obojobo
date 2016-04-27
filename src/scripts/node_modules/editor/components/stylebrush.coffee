class StyleBrush
	constructor: ->
		@clean()

	clean: ->
		@toApply = new Set()
		@toRemove = new Set()

	add: (style, toRemove = false) ->
		if toRemove
			if @toApply.has(style) then @toApply.delete(style)
			@toRemove.add style
		else
			if @toRemove.has(style) then @toRemove.delete(style)
			@toApply.add style

	getStyleState: (style) ->
		if @toRemove.has(style) then return 'remove'
		if @toApply.has(style) then return 'apply'
		null


Object.defineProperties StyleBrush.prototype,
	"isClean": get: -> @toApply.size + @toRemove.size is 0

	"stylesToApply": get: ->
		arr = []
		@toApply.forEach (value) ->
			arr.push value
		arr

	"stylesToRemove": get: ->
		arr = []
		@toRemove.forEach (value) ->
			arr.push value
		arr


module.exports = StyleBrush