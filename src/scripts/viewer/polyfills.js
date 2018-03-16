import smoothScroll from 'smoothscroll-polyfill'

import arrayFrom from 'core-js/fn/array/from'
import es6set from 'core-js/library/fn/set'
import es6Symbol from 'core-js/es6/symbol'
import promise from 'core-js/es6/promise'

// Object.assign (IE)
if (typeof Object.assign != 'function') {
	Object.assign = function(target, varArgs) {
		// .length of function is 2
		'use strict'
		if (target == null) {
			// TypeError if undefined or null
			throw new TypeError('Cannot convert undefined or null to object')
		}

		let to = Object(target)

		for (let index = 1; index < arguments.length; index++) {
			let nextSource = arguments[index]

			if (nextSource != null) {
				// Skip over if undefined or null
				for (let nextKey in nextSource) {
					// Avoid bugs when hasOwnProperty is shadowed
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey]
					}
				}
			}
		}
		return to
	}
}

// Set (IE)
if (!window.Set) {
	window.Set = es6set
}

// Array.from (IE)
if (!Array.from) {
	Array.from = arrayFrom
}

// Promise (IE)
if (!window.Promise) {
	window.Promise = promise
}

// Symbol (IE)
if (!window.Symbol) {
	window.Symbol = es6Symbol
}

// Smooth scrollTo (non-FF)
smoothScroll.polyfill()

// Number.isFinite (IE)
Number.isFinite = Number.isFinite || (n => typeof n === 'number' && isFinite(n))
