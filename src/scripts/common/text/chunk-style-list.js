import StyleType from './style-type'
import StyleRange from './style-range'

const keySortFn = (a, b) => Number(a) - Number(b)

class ChunkStyleList {
	static createFromObject(o) {
		const styleList = new ChunkStyleList()

		if (o) {
			for (const rangeObj of Array.from(o)) {
				styleList.add(StyleRange.createFromObject(rangeObj))
			}
		}

		return styleList
	}

	constructor() {
		this.clear()
	}

	clear() {
		this.styles = []
	}

	getExportedObject() {
		if (this.styles.length === 0) {
			return null
		}

		const output = []

		for (const style of this.styles) {
			output.push(style.getExportedObject())
		}

		return output
	}

	clone() {
		const cloneStyleList = new ChunkStyleList()

		for (const style of this.styles) {
			cloneStyleList.add(style.clone())
		}

		return cloneStyleList
	}

	length() {
		return this.styles.length
	}

	get(i) {
		return this.styles[i]
	}

	add(styleRange) {
		return this.styles.push(styleRange)
	}

	// does not consider data
	remove(styleRange) {
		const comparisons = this.getStyleComparisonsForRange(
			styleRange.start,
			styleRange.end,
			styleRange.type
		)

		// For any ranges that are enscapulated by this range we simply delete them
		for (const co of comparisons.enscapsulatedBy) {
			co.invalidate()
		}

		// For any left ranges we need to trim off the right side
		for (const co of comparisons.left) {
			co.end = styleRange.start
		}

		// For any right ranges we need to trim off the left side
		for (const co of comparisons.right) {
			co.start = styleRange.end
		}

		// For any contained ranges we have to split them into two new ranges
		// However we remove any new ranges if they have a length of 0
		for (const co of comparisons.contains) {
			const leftRange = co
			const origEnd = leftRange.end
			const rightRange = new StyleRange(styleRange.end, origEnd, co.type, co.data)

			leftRange.end = styleRange.start

			if (leftRange.length() === 0) {
				leftRange.invalidate()
			}

			if (rightRange.length() > 0) {
				this.add(rightRange)
			}
		}

		return this.normalize()
	}

	getStyleComparisonsForRange(from, to, type) {
		type = type || null
		to = to || from

		const comparisons = {
			after: [],
			before: [],
			enscapsulatedBy: [],
			contains: [],
			left: [],
			right: []
		}

		for (const style of this.styles) {
			const curComparison = style.compareToRange(from, to)
			if (type === null || style.type === type) {
				comparisons[curComparison].push(style)
			}
		}

		return comparisons
	}

	// Return true if the entire text range is styled by styleType
	rangeHasStyle(from, to, styleType) {
		return this.getStyleComparisonsForRange(from, to, styleType).contains.length > 0
	}

	// Returns a simple object with all the styles that are within the entire text range
	getStylesInRange(from, to) {
		const styles = {}

		for (const range of this.getStyleComparisonsForRange(from, to).contains) {
			styles[range.type] = range.type
		}

		return styles
	}

	getStyles() {
		const styles = {}

		for (const range of this.styles) {
			styles[range.type] = range.type
		}

		return styles
	}

	cleanupSuperscripts() {
		let level
		const mark = []
		const newStyles = []

		for (const styleRange of this.styles) {
			if (styleRange.type !== StyleType.SUPERSCRIPT) {
				newStyles.push(styleRange)
				continue
			}

			if (typeof mark[styleRange.start] === 'undefined') {
				mark[styleRange.start] = 0
			}
			if (typeof mark[styleRange.end] === 'undefined') {
				mark[styleRange.end] = 0
			}

			level = parseInt(styleRange.data, 10)

			mark[styleRange.start] += level
			mark[styleRange.end] -= level
		}

		let curRange = new StyleRange(-1, -1, StyleType.SUPERSCRIPT, 0)
		let curLevel = 0
		for (let i = 0; i < mark.length; i++) {
			if (typeof mark[i] === 'undefined') {
				continue
			}

			level = mark[i]
			curLevel += level

			// Establish the first superscript range
			if (curRange.start === -1) {
				curRange.start = i
				curRange.data = curLevel
				// Close up the previous range and start a new one
			} else {
				curRange.end = i

				if (curRange.data !== 0) {
					newStyles.push(curRange)
				}

				curRange = new StyleRange(i, -1, StyleType.SUPERSCRIPT, curLevel)
			}
		}

		return (this.styles = newStyles)
	}

	// 1. Loop through every style range for every type
	// 2. In an array A add 1 to A[range.start] and add -1 to A[range.end]
	// 3. Clear out the style list.
	// 4. Loop through A
	// 5. When you find a 1, that starts a new range
	// 6. Continue to add up numbers that you discover
	// 7. When your total is a 0 that ends the range
	normalize() {
		let i, styleType
		this.cleanupSuperscripts()

		const newStyles = []

		// We can't merge in link styles since they might have different URLs!
		// We have to treat them separately
		// [b: [b], i: [i], a: [google, microsoft]]
		const datasToCheck = {}
		const dataValues = {}
		for (const styleName in StyleType) {
			styleType = StyleType[styleName]
			datasToCheck[styleType] = []
			dataValues[styleType] = []
		}

		for (i = this.styles.length - 1; i >= 0; i--) {
			const styleRange = this.styles[i]
			const curData = styleRange.data
			const curEncodedData = JSON.stringify(curData)

			if (datasToCheck[styleRange.type].indexOf(curEncodedData) === -1) {
				datasToCheck[styleRange.type].push(curEncodedData)
				dataValues[styleRange.type].push(curData)
			}
		}

		for (styleType in dataValues) {
			//console.log 'loop', styleType, datas
			const datas = dataValues[styleType]
			for (const data of datas) {
				const tmp = {}
				let total = 0
				let start = null

				for (const range of this.styles) {
					if (range.isMergeable(styleType, data)) {
						if (typeof tmp[range.start] === 'undefined') {
							tmp[range.start] = 0
						}
						if (typeof tmp[range.end] === 'undefined') {
							tmp[range.end] = 0
						}

						tmp[range.start]++
						tmp[range.end]--
					}
				}

				const keys = Object.keys(tmp).sort(keySortFn)

				for (const key of keys) {
					const end = Number(key)
					const t = tmp[key]
					if (start === null) {
						start = end
					}
					total += t
					if (total === 0) {
						newStyles.push(new StyleRange(start, end, styleType, data))
						start = null
					}
				}
			}
		}

		for (i = newStyles.length - 1; i >= 0; i--) {
			const style = newStyles[i]
			if (style.isInvalid()) {
				newStyles.splice(i, 1)
			}
		}

		return (this.styles = newStyles)
	}
}

export default ChunkStyleList
