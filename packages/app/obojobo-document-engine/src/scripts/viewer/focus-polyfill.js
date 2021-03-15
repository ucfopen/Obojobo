// focus - focusOptions - preventScroll polyfill
let supportsPreventScrollOption = false
try {
	const focusElem = document.createElement('div')
	focusElem.addEventListener(
		'focus',
		function(event) {
			event.preventDefault()
			event.stopPropagation()
		},
		true
	)
	focusElem.focus(
		Object.defineProperty({}, 'preventScroll', {
			// eslint-disable-next-line getter-return
			get: function() {
				supportsPreventScrollOption = true
			}
		})
	)
	// eslint-disable-next-line no-empty
} catch (e) {}

// eslint-disable-next-line no-undefined
if (HTMLElement.prototype.nativeFocus === undefined && !supportsPreventScrollOption) {
	HTMLElement.prototype.nativeFocus = HTMLElement.prototype.focus

	const patchedFocus = function(args) {
		const actualPosition = window.scrollY || window.pageYOffset
		this.nativeFocus()
		if (args && args.preventScroll) {
			// Hijacking the event loop order, since the focus() will trigger
			// internally an scroll that goes to the event loop
			setTimeout(function() {
				window.scroll(window.scrollX || window.pageXOffset, actualPosition)
			}, 0)
		}
	}

	HTMLElement.prototype.focus = patchedFocus
}
