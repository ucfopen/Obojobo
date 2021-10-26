import { Text } from 'slate'

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
				if (style.type === 'a') {
					leaf.href = style.data.href
				}
				if (style.type === 'sup') {
					if (!leaf.num) leaf.num = 0
					leaf.num += style.data
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
		let currIndex = 0

		text.children.forEach(textRange => {
			if (Text.isText(textRange)) {
				Object.entries(textRange).forEach(([type, value]) => {
					// Only the object keys that have a value of true are marks
					if (value === true) {
						const style = {
							start: currIndex,
							end: currIndex + textRange.text.length,
							type: type,
							data: type === 'sup' ? textRange.num : {}
						}

						line.text.styleList.push(style)
					}
				})

				line.text.value += textRange.text
				currIndex += textRange.text.length
			} else {
				const inlineStyle = {
					start: currIndex,
					type: textRange.type,
					data: {
						href: textRange.href
					}
				}

				textRange.children.forEach(child => {
					Object.entries(child).forEach(([type, value]) => {
						// Only the object keys that have a value of true are marks
						if (value === true) {
							const style = {
								start: currIndex,
								end: currIndex + child.text.length,
								type: type,
								data: type === 'sup' ? child.num : {}
							}

							line.text.styleList.push(style)
						}
					})

					line.text.value += child.text
					currIndex += child.text.length
				})

				inlineStyle.end = currIndex
				line.text.styleList.push(inlineStyle)
			}
		})
	}
}

export default TextUtil
