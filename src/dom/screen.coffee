OboSelectionRect = require '../obodom/selection/oboselectionrect'

PX_EDGE_PADDING = 50

class Screen
	constructor: ->
		@intervalId = null
		@distance = 0
		@distanceLeft = 0
		@travelBy = 0

	getScrollPosition: ->
		x: window.scrollX || window.pageXOffset || document.scrollLeft || document.body.scrollLeft || 0
		y: window.scrollY || window.pageYOffset || document.scrollTop  || document.body.scrollTop  || 0

	saveScrollPosition: (fn) ->
		@savedScrollPos = @getScrollPosition()

	restoreScrollPosition: ->
		return if not @savedScrollPos?
		window.scrollTo @savedScrollPos.x, @savedScrollPos.y

	getScrollDistanceNeededToPutSelectionIntoView: ->
		selScreenRect = OboSelectionRect.createFromSelection()

		if not selScreenRect.valid                   then return 0
		if selScreenRect.top < 0                     then return selScreenRect.top - PX_EDGE_PADDING
		if selScreenRect.bottom > window.innerHeight then return selScreenRect.bottom - window.innerHeight + PX_EDGE_PADDING
		0

	scrollSelectionIntoViewIfNeeded: ->
		@distance = @getScrollDistanceNeededToPutSelectionIntoView()
		document.body.scrollTop += @distance

	#@TODO - delete this?
	tweenSelectionIntoViewIfNeeded: ->
		@distance = @getScrollDistanceNeededToPutSelectionIntoView()
		@distanceLeft = @distance

		if @distance isnt 0
			@travelBy = Math.max 1, parseInt(Math.abs(@distance) / 10, 10)

			clearInterval @intervalId
			@intervalId = setInterval (->
				if @distance < 1
					travel = Math.min @travelBy, @distanceLeft * -1
					document.body.scrollTop -= travel
					@distanceLeft += travel

					if @distanceLeft >= 0
						clearInterval @intervalId
				else
					travel = Math.min @travelBy, @distanceLeft
					document.body.scrollTop += travel
					@distanceLeft -= travel

					if @distanceLeft <= 0
						clearInterval @intervalId

			).bind(@), 10



module.exports = Screen