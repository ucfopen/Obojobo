import ChunkStyleList from './chunk-style-list'
import StyleRange from './style-range'
import StyleType from './style-type'
import { isElementInline } from '../../common/util/html-util'

// ceiling Infinity end values to the length
let trimStyleRange = function(styleRange, maxLength) {
	styleRange.end = Math.min(styleRange.end, maxLength)
	return styleRange
}

class StyleableText {
	constructor(text) {
		if (text == null) {
			text = ''
		}
		this.init()
		this.insertText(0, text)
	}

	init() {
		this.styleList = new ChunkStyleList()
		return (this.value = '')
	}

	clone() {
		let clone = new StyleableText()
		clone.value = this.value
		clone.styleList = this.styleList.clone()

		return clone
	}

	getExportedObject() {
		return {
			value: this.value,
			styleList: this.styleList.getExportedObject()
		}
	}

	setText(text) {
		this.init()
		return this.insertText(0, text)
	}

	replaceText(from, to, text) {
		if (text == null || text.length === 0) {
			return this.deleteText(from, to)
		}

		// Goal: The replaced text should adopt the styles of where the range starts.
		// The following combination of commands achieves what we want
		this.insertText(from + 1, text)
		this.normalizeStyles()
		this.deleteText(from, from + 1)
		this.normalizeStyles()
		this.deleteText(from + text.length, to + text.length - 1)
		return this.normalizeStyles()
	}

	appendText(text) {
		return this.insertText(this.length, text)
	}

	insertText(atIndex, text) {
		let insertLength = text.length

		for (let range of Array.from(this.styleList.styles)) {
			switch (range.compareToRange(atIndex)) {
				case StyleRange.CONTAINS:
					range.end += insertLength
					break

				case StyleRange.AFTER:
					range.start += insertLength
					range.end += insertLength
					break
			}
		}

		this.value = this.value.substring(0, atIndex) + text + this.value.substring(atIndex)

		return this.normalizeStyles()
	}

	deleteText(from, to) {
		if (from == null) {
			from = -1
		}
		if (to == null) {
			to = Infinity
		}
		if (from > to) {
			return
		}

		from = Math.max(0, from)
		to = Math.min(to, this.value.length)

		let deleteLength = to - from

		for (let range of Array.from(this.styleList.styles)) {
			switch (range.compareToRange(from, to)) {
				case StyleRange.CONTAINS:
					range.end -= deleteLength
					break

				case StyleRange.INSIDE_LEFT:
					range.end = from
					break

				case StyleRange.ENSCAPSULATED_BY:
					range.invalidate()
					break

				case StyleRange.INSIDE_RIGHT:
					range.start = from
					range.end -= deleteLength
					break

				case StyleRange.AFTER:
					range.start -= deleteLength
					range.end -= deleteLength
					break
			}
		}

		this.value = this.value.substring(0, from) + this.value.substring(to)

		return this.normalizeStyles()
	}

	toggleStyleText(styleType, from, to, styleData) {
		if (from == null) {
			from = 0
		}
		if (to == null) {
			to = this.length
		}
		let styleRange = trimStyleRange(
			new StyleRange(from, to, styleType, styleData),
			this.value.length
		)
		if (this.styleList.rangeHasStyle(from, Math.min(to, this.value.length), styleType)) {
			this.styleList.remove(styleRange)
		} else {
			this.styleList.add(styleRange)
		}

		return this.normalizeStyles()
	}

	styleText(styleType, from, to, styleData) {
		if (from == null) {
			from = 0
		}
		if (to == null) {
			to = this.length
		}
		let range = new StyleRange(from, to, styleType, styleData)

		let styleRange = trimStyleRange(range, this.value.length)
		this.styleList.add(styleRange)

		return this.normalizeStyles()
	}

	unstyleText(styleType, from, to) {
		if (from == null) {
			from = 0
		}
		if (to == null) {
			to = this.length
		}
		let styleRange = trimStyleRange(new StyleRange(from, to, styleType), this.value.length)
		this.styleList.remove(styleRange)
		return this.normalizeStyles()
	}

	getStyles(from, to) {
		return this.styleList.getStylesInRange(from, to)
	}

	split(atIndex) {
		if (isNaN(atIndex)) {
			return null
		}

		let splitAtEnd = atIndex === this.value.length

		let sibling = this.clone()

		this.deleteText(atIndex, this.value.length)

		sibling.deleteText(0, atIndex)

		// special case - if splitting at the end of a line
		// we want to shove the last character styles as
		// initial styles into the new sibling.
		if (splitAtEnd) {
			let lastCharStyles = this.styleList.getStylesInRange(this.value.length - 1, this.value.length)
			for (let style in lastCharStyles) {
				sibling.styleText(style, 0, 0)
			} //@TODO - what about data?
		}

		return sibling
	}

	normalizeStyles() {
		return this.styleList.normalize()
	}

	merge(otherText, atIndex) {
		if (atIndex == null) {
			atIndex = null
		}
		if (atIndex == null) {
			atIndex = this.value.length
		}

		let insertLength = otherText.value.length

		for (var range of Array.from(this.styleList.styles)) {
			switch (range.compareToRange(atIndex)) {
				case StyleRange.AFTER:
					range.start += insertLength
					range.end += insertLength
					break
			}
		}

		this.value = this.value.substring(0, atIndex) + otherText.value + this.value.substring(atIndex)

		this.styleList.normalize()

		for (range of Array.from(otherText.styleList.styles)) {
			let curRange = range.clone()
			curRange.start += atIndex
			curRange.end += atIndex

			this.styleList.add(curRange)
		}

		return this.styleList.normalize()
	}

	__debug_print() {
		let end, i
		let s1, s2, start
		console.log(`   |          |${this.value} |`)
		let fill = ''
		for (
			i = 0, end = this.value.length + 10, asc = 0 <= end;
			asc ? i <= end : i >= end;
			asc ? i++ : i--
		) {
			var asc
			fill += ' '
		}

		let j = 0
		return Array.from(this.styleList.styles).map(
			style => (
				(s1 = (style.type + '          ').substr(0, 10) + '|'),
				(s2 = ''),
				(() => {
					let result = []
					for (
						i = 0, end1 = style.start, asc1 = 0 <= end1;
						asc1 ? i < end1 : i > end1;
						asc1 ? i++ : i--
					) {
						var asc1, end1
						result.push((s2 += '·'))
					}
					return result
				})(),
				(s2 += '<'),
				(() => {
					let result1 = []
					for (
						start = style.start + 1, i = start, end2 = style.end, asc2 = start <= end2;
						asc2 ? i < end2 : i > end2;
						asc2 ? i++ : i--
					) {
						var asc2, end2
						result1.push((s2 += '='))
					}
					return result1
				})(),
				(s2 += '>'),
				(() => {
					let result2 = []
					for (
						start1 = style.end + 1, i = start1, end3 = fill.length, asc3 = start1 <= end3;
						asc3 ? i < end3 : i > end3;
						asc3 ? i++ : i--
					) {
						var asc3, end3, start1
						result2.push((s2 += '·'))
					}
					return result2
				})(),
				console.log(
					(j + '   ').substr(0, 3) +
						'|' +
						(s1 + s2 + fill).substr(0, fill.length + 1) +
						'|' +
						style.start +
						',' +
						style.end +
						'|' +
						JSON.stringify(style.data)
				), // + '|' + style.__debug
				j++
			)
		)
	}
}

Object.defineProperties(StyleableText.prototype, {
	length: {
		get() {
			return this.value.length
		}
	}
})

StyleableText.createFromObject = function(o) {
	let st = new StyleableText()
	st.styleList = ChunkStyleList.createFromObject(o.styleList)
	st.value = o.value

	return st
}

StyleableText.getStylesOfElement = function(el) {
	// console.warn 'MOVE THIS SOMEWHERE ELSE!!!!'

	if (el.nodeType !== Node.ELEMENT_NODE) {
		return []
	}

	let styles = []

	let computedStyle = window.getComputedStyle(el)

	// debugger;

	// console.log '___________', el, computedStyle, computedStyle.getPropertyValue('font-weight')

	switch (computedStyle.getPropertyValue('font-weight')) {
		case 'bold':
		case 'bolder':
		case '700':
		case '800':
		case '900':
			styles.push({ type: StyleType.BOLD })
			break
	}

	switch (computedStyle.getPropertyValue('text-decoration')) {
		case 'line-through':
			styles.push({ type: StyleType.STRIKETHROUGH })
			break
	}

	switch (computedStyle.getPropertyValue('font-style')) {
		case 'italic':
			styles.push({ type: StyleType.ITALIC })
			break
	}

	switch (computedStyle.getPropertyValue('font-family').toLowerCase()) {
		case 'monospace':
			styles.push({ type: StyleType.MONOSPACE })
			break
	}

	// switch computedStyle.getPropertyValue('vertical-align') + "|" + computedStyle.getPropertyValue('font-size')
	// 	when "super|smaller" then styles.push { type:StyleType.SUPERSCRIPT }
	// 	when "sub|smaller"   then styles.push { type:StyleType.SUBSCRIPT }

	switch (el.tagName.toLowerCase()) {
		//when 'b'               then styles.push { type:StyleType.BOLD }
		case 'a':
			if (el.getAttribute('href') != null) {
				styles.push({ type: StyleType.LINK, data: { href: el.getAttribute('href') } })
			}
			break
		case 'q':
			styles.push({ type: StyleType.QUOTE, data: el.getAttribute('cite') })
			break
		//@TODO:
		// when 'abbr', 'acronym' then styles.push { type:StyleType.COMMENT, data:el.getAttribute('title') }
		case 'sup':
			styles.push({ type: StyleType.SUPERSCRIPT, data: 1 })
			break
		case 'sub':
			styles.push({ type: StyleType.SUPERSCRIPT, data: -1 })
			break
	}
	// @TODO:
	// when 'span'
	// 	if el.classList.contains('comment') and el.hasAttribute('data-additional')
	// 		styles.push { type:StyleType.COMMENT, data:el.getAttribute('data-additional') }

	return styles
}

// StyleableText.createFromElement = function(node) {
// 	let state
// 	console.log('ST.cFE', node.tagName, node.innerHTML, arguments[1])
// 	if (node == null) {
// 		return new StyleableText()
// 	}

// 	// console.warn '@TODO - MOVE THIS method somewhere else!'

// 	if (arguments[1] == null) {
// 		state = {
// 			curText: new StyleableText(),
// 			texts: []
// 		}
// 		StyleableText.createFromElement(node, state)

// 		state.texts.push(state.curText)
// 		state.curText.styleList.normalize()

// 		return state.texts
// 	}

// 	state = arguments[1]

// 	switch (node.nodeType) {
// 		case Node.TEXT_NODE:
// 			return (state.curText.value += node.nodeValue)
// 		case Node.ELEMENT_NODE:
// 			if (state.curText.length > 0 && !isElementInline(node)) {
// 				state.texts.push(state.curText)
// 				state.curText.styleList.normalize()

// 				state.curText = new StyleableText()
// 			}

// 			let styles = StyleableText.getStylesOfElement(node)
// 			let ranges = []
// 			for (let style of Array.from(styles)) {
// 				let styleRange = new StyleRange(
// 					state.curText.value.length,
// 					Infinity,
// 					style.type,
// 					style.data
// 				)
// 				ranges.push(styleRange)
// 			}

// 			for (let childNode of Array.from(node.childNodes)) {
// 				StyleableText.createFromElement(childNode, state)
// 			}

// 			return Array.from(ranges).map(
// 				range => ((range.end = state.curText.value.length), state.curText.styleList.add(range))
// 			)
// 	}
// }

// @TODO
window.__st = StyleableText

export default StyleableText
