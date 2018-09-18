const TextUtil = {
	// Parse Obojobo text object into Slate leaves array
	parseMarkings: line => {
		const fullText = line.text.value

		// Retrive all important points in this text
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
				text: fullText.slice(last, point),
				marks: []
			}

			// Check if the current range is contained within each style and add
			// any relevent marks
			line.text.styleList.forEach(style => {
				// If the style ends before this range or starts after it, it doesnt apply
				if (style.end <= last || style.start >= point) return

				// otherwise, add the type and the data to the mark
				const mark = {
					type: style.type,
					data: style.data
				}

				leaf.marks.push(mark)
			})

			// finished a range
			last = point
			return leaf
		})

		return leafList.filter(leaf => leaf !== null)
	},

	slateToOboText: (text, line) => {
		let currIndex = 0

		text.leaves.forEach(textRange => {
			textRange.marks.forEach(mark => {
				const style = {
					start: currIndex,
					end: currIndex + textRange.text.length,
					type: mark.type,
					data: JSON.parse(JSON.stringify(mark.data))
				}
				line.text.styleList.push(style)
			})
			currIndex += textRange.text.length
		})
	}
}

export default TextUtil
