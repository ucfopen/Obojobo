import { Text } from 'slate'
import StyleableText from 'obojobo-document-engine/src/scripts/common/text/styleable-text'
import StyleType from 'obojobo-document-engine/src/scripts/common/text/style-type'

const TextUtil = {
	// Collapse multiple links into one  inline element
	collapseLinks(leaves) {
		let currentLink = null

		return leaves
			.map(leaf => {
				if (leaf.a) {
					// If this is the first link in a chain
					// create a new link element with leaf children
					if (!currentLink) {
						currentLink = {
							type: 'a',
							href: leaf.href,
							children: [leaf]
						}
						delete leaf.a
						delete leaf.href
						return currentLink
						// If the href of this link does not match the current href
						// create a new link element with leaf children
					} else if (currentLink.href !== leaf.href) {
						currentLink = {
							type: 'a',
							href: leaf.href,
							children: [leaf]
						}
						delete leaf.a
						delete leaf.href
						return currentLink
						// Otherwise, this is a leaf that matches the current link
						// so simply add it to the children of the current link
					} else {
						delete leaf.a
						delete leaf.href
						currentLink.children.push(leaf)
						return null
					}
				} else {
					currentLink = null
					return leaf
				}
			})
			.filter(mark => mark !== null)
	},

	// Parse Obojobo text object into Slate leaves array
	parseMarkings: line => {
		const fullText = line.text.value
		if (!line.text.styleList) return [{ text: fullText }]

		// Retrieve all important points in this text
		// Start and end of text, and the start and end of every style
		// Use a set to insure no points are duplicated
		// O(n) where n = number of styles
		const vitalPoints = new Set()
		vitalPoints.add(0)
		vitalPoints.add(fullText.length)

		line.text.styleList.forEach(style => {
			vitalPoints.add(style.start)
			vitalPoints.add(style.end)
		})

		// Sort the points so that consecutive points are adjacent
		const points = Array.from(vitalPoints)
		points.sort((a, b) => a - b)

		// loop through each vital point, and create a leaf for each range
		// O((n+2)*n) ~ O(n^2) where n = number of styles
		let last = -1
		const leafList = points.map(point => {
			if (last === -1) {
				last = point
				return null
			}

			// Range: [last, point)
			const leaf = {
				text: fullText.slice(last, point)
			}

			// Check if the current range is contained within each style and add
			// any relevant marks
			line.text.styleList.forEach(style => {
				// If the style ends before this range or starts after it, it doesnt apply
				if (style.end <= last || style.start >= point) return

				// Otherwise, add the type and the data to the mark
				leaf[style.type] = true
				switch (style.type) {
					case 'a':
						leaf.href = style.data.href
						break
					case 'sup':
						if (!leaf.num) leaf.num = 0
						leaf.num += style.data
						break
					case 'color':
						leaf.color = style.data.text
				}
			})

			// finished a range
			last = point
			return leaf
		})

		const leaves = leafList.filter(leaf => leaf !== null)
		return leaves.length === 0 ? [{ text: '' }] : TextUtil.collapseLinks(leaves)
	},

	slateToOboText: (text, line) => {
		const texts = [...text.children]

		/*
		Texts is an array of Text objects or links, like this:
		[
			{ text: 'ABC', b: true, color: '#FF0000' },
			{ type: 'a', href: 'example.com', children: [{ text: 'DEF' }, { text: 'GHI', i: true }] },
			{ text: 'JKL' }
		]

		We want to convert this to a StyleableText friendly format, which means
		turning the above example to the following
		[
			{ text: 'ABC', b: true, color: '#FF0000' },
			{ text: 'DEF', a: { href: 'example.com' } },
			{ text: 'GHI', i: true, a: { href: 'example.com' } },
			{ text: 'JKL' }
		]

		Then we iterate over these chunks of text and add them to a StyleableText object,
		which has built-in functions to simplify the styles
		*/

		const s = new StyleableText()

		texts.forEach((textRange, index) => {
			if (!Text.isText(textRange)) {
				// This is a link object - we expand it in place
				const linkChildren = textRange.children.map(child => ({
					...child,
					a: { href: textRange.href }
				}))
				texts.splice(index, 1, ...linkChildren)
				textRange = linkChildren[0]
			}

			// We manually append the text to the StyleableText object instead of using
			// the appendText method, as the appendText method will automatically continue
			// the style of the last character to the newly imported text
			s.value = s.value + textRange.text

			Object.keys(textRange).forEach(styleType => {
				const styleData = textRange[styleType]
				const from = s.length - textRange.text.length
				const to = s.length

				switch (styleType) {
					case StyleType.COLOR:
						s.styleText(styleType, from, to, { text: styleData })
						return

					case StyleType.SUPERSCRIPT:
						s.styleText(styleType, from, to, textRange.num)
						return

					case StyleType.LINK:
						s.styleText(styleType, from, to, styleData)
						return

					case StyleType.LATEX:
					case StyleType.QUOTE:
					case StyleType.BOLD:
					case StyleType.STRIKETHROUGH:
					case StyleType.MONOSPACE:
					case StyleType.ITALIC:
						s.styleText(styleType, from, to)
				}
			})
		})

		line.text = s.getExportedObject()
	}
}

export default TextUtil
