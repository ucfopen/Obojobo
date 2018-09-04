import OboSelectionRect from '../../common/selection/obo-selection-rect'

const PX_EDGE_PADDING = 50

class Screen {
	constructor(el) {
		this.el = el
		this.intervalId = null
		this.distance = 0
		this.distanceLeft = 0
		this.travelBy = 0
	}

	// getScrollPosition: ->
	// 	x: @el.scrollTop
	// 	y: @el.scrollLeft

	// saveScrollPosition: ->
	// 	pos = @getScrollPosition()

	// 	@savedScrollPos = @getScrollPosition()
	// 	console.log 'Screen.saveScrollPosition', @savedScrollPos

	// restoreScrollPosition: ->
	// 	return if not @savedScrollPos?
	// 	console.log 'Screen.restoreScrollPosition', @savedScrollPos
	// 	window.scrollTo @savedScrollPos.x, @savedScrollPos.y

	scrollToTop() {
		return (this.el.scrollTop = 0)
	}

	scrollToBottom() {
		return (this.el.scrollTop = this.el.scrollHeight)
	}

	getScrollDistanceNeededToPutClientRectIntoView(clientRect) {
		const rect = this.el.getBoundingClientRect()

		if (!clientRect.valid) {
			return 0
		}
		if (clientRect.top < 0) {
			return clientRect.top - PX_EDGE_PADDING
		}
		if (clientRect.bottom > rect.height) {
			return clientRect.bottom - rect.height + PX_EDGE_PADDING
		}
		return 0
	}

	getScrollDistanceNeededToPutElementIntoView(el) {
		return this.getScrollDistanceNeededToPutClientRectIntoView(el.getBoundingClientRect())
	}

	getScrollDistanceNeededToPutSelectionIntoView() {
		return this.getScrollDistanceNeededToPutClientRectIntoView(
			OboSelectionRect.createFromSelection()
		)
	}

	scrollSelectionIntoViewIfNeeded() {
		this.distance = this.getScrollDistanceNeededToPutSelectionIntoView()
		return (this.el.scrollTop += this.distance)
	}

	tweenByDistance(distance) {
		this.distance = distance
		this.distanceLeft = this.distance

		if (this.distance !== 0) {
			this.travelBy = Math.max(1, parseInt(Math.abs(this.distance) / 10, 10))

			clearInterval(this.intervalId)
			return (this.intervalId = setInterval(() => {
				let travel
				if (this.distance < 1) {
					travel = Math.min(this.travelBy, this.distanceLeft * -1)
					this.el.scrollTop -= travel
					this.distanceLeft += travel

					if (this.distanceLeft >= 0) {
						return clearInterval(this.intervalId)
					}
				} else {
					travel = Math.min(this.travelBy, this.distanceLeft)
					this.el.scrollTop += travel
					this.distanceLeft -= travel

					if (this.distanceLeft <= 0) {
						return clearInterval(this.intervalId)
					}
				}
			}, 10))
		}
	}

	tweenElementIntoViewIfNeeded(el) {
		return this.tweenByDistance(this.getScrollDistanceNeededToPutElementIntoView(el))
	}
}

Screen.isElementVisible = function(node) {
	const rect = node.getBoundingClientRect()
	return !(rect.top > window.innerHeight || rect.bottom < 0)
}

export default Screen
