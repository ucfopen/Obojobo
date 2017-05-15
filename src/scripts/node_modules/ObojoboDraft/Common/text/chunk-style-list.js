import StyleType from './style-type';
import StyleRange from './style-range';


let keySortFn = (a, b) => Number(a) - Number(b);


class ChunkStyleList {
	constructor() {
		this.clear();
	}

	clear() {
		return this.styles = [];
	}

		// Object.observe @styles, ->
		// 	console.log 'chunkstylelist changed'

	getExportedObject() {
		if (this.styles.length === 0) { return null; }

		let output = [];

		for (let style of Array.from(this.styles)) {
			output.push(style.getExportedObject());
		}

		return output;
	}

	clone() {
		let cloneStyleList = new ChunkStyleList;

		for (let style of Array.from(this.styles)) {
			cloneStyleList.add(style.clone());
		}

		return cloneStyleList;
	}

	length() {
		return this.styles.length;
	}

	get() {
		return this.styles[i];
	}

	add(styleRange) {
		return this.styles.push(styleRange);
	}

	// does not consider data
	remove(styleRange) {
		let comparisons = this.getStyleComparisonsForRange(styleRange.start, styleRange.end, styleRange.type);

		// For any ranges that are enscapulated by this range we simply delete them
		for (var co of Array.from(comparisons.enscapsulatedBy)) {
			co.invalidate();
		}

		// For any left ranges we need to trim off the right side
		for (co of Array.from(comparisons.left)) {
			co.end = styleRange.start;
		}

		// For any right ranges we need to trim off the left side
		for (co of Array.from(comparisons.right)) {
			co.start = styleRange.end;
		}

		// For any contained ranges we have to split them into two new ranges
		// However we remove any new ranges if they have a length of 0
		for (co of Array.from(comparisons.contains)) {
			let leftRange = co;
			let origEnd = leftRange.end;
			leftRange.end = styleRange.start;

			let rightRange = new StyleRange(styleRange.end, origEnd, co.type, co.data);

			if (leftRange.length() === 0) {
				leftRange.invalidate();
			}

			if (rightRange.length() > 0) {
				this.add(rightRange);
			}
		}



		return this.normalize();
	}

	// type is optional
	getStyleComparisonsForRange(from, to, type) {
		type = type || null;
		to = to || from;

		let comparisons = {
			after: [],
			before: [],
			enscapsulatedBy: [],
			contains: [],
			left: [],
			right: []
		};

		//@TODO - optimize
		for (let style of Array.from(this.styles)) {
			let curComparison = style.compareToRange(from, to);
			if ((type === null) || (style.type === type)) {
				comparisons[curComparison].push(style);
			}
		}

		return comparisons;
	}

	// Return true if the entire text range is styled by styleType
	rangeHasStyle(from, to, styleType) {
		return this.getStyleComparisonsForRange(from, to, styleType).contains.length > 0;
	}

	// Returns a simple object with all the styles that are within the entire text range
	getStylesInRange(from, to) {
		let styles = {};

		for (let range of Array.from(this.getStyleComparisonsForRange(from, to).contains)) {
			styles[range.type] = range.type;
		}

		return styles;
	}

	getStyles() {
		let styles = {};

		for (let range of Array.from(this.styles)) {
			styles[range.type] = range.type;
		}

		return styles;
	}

	// Moves each item in the list by byAmount
	// shift: (byAmount) ->
	// 	for range in @styles
	// 		range.start += byAmount
	// 		range.end += byAmount

	cleanupSuperscripts() {
		// console.log 'cleanupSubSup', @styles

		let level;
		let mark = [];
		let newStyles = [];

		for (let styleRange of Array.from(this.styles)) {
			if (styleRange.type !== StyleType.SUPERSCRIPT) {
				newStyles.push(styleRange);
				continue;
			}

			if ((mark[styleRange.start] == null)) { mark[styleRange.start] = 0; }
			if ((mark[styleRange.end] == null)) { mark[styleRange.end]   = 0; }

			level = parseInt(styleRange.data, 10);

			mark[styleRange.start] += level;
			mark[styleRange.end]   -= level;
		}

		// console.log 'mark', mark

		let curRange = new StyleRange(-1, -1, StyleType.SUPERSCRIPT, 0);
		let curLevel = 0;
		for (let i = 0; i < mark.length; i++) {
			level = mark[i];
			if ((mark[i] == null)) { continue; }

			curLevel += level;

			if (curRange.start === -1) {
				curRange.start = i;
				curRange.data = curLevel;
			} else if (curRange.end === -1) {
				curRange.end = i;

				if (curRange.data !== 0) { newStyles.push(curRange); }

				curRange = new StyleRange(i, -1, StyleType.SUPERSCRIPT, curLevel);
			}
		}

		// console.log 'styles before', JSON.stringify(@styles, null, 2)
		return this.styles = newStyles;
	}
		// @styles.length = 0
		// for style in newStyles
		// 	@styles.push style
		// console.log 'styles after ', JSON.stringify(@styles, null, 2)

	// 1. Loop through every style range for every type
	// 2. In an array A add 1 to A[range.start] and add -1 to A[range.end]
	// 3. Clear out the style list.
	// 4. Loop through A
	// 5. When you find a 1, that starts a new range
	// 6. Continue to add up numbers that you discover
	// 7. When your total is a 0 that ends the range
	normalize() {
		// console.time 'normalize'
		//@TODO - possible to improve runtime if we sort the styles?

		let i, styleType;
		this.cleanupSuperscripts();

		let newStyles = [];

		// We can't merge in link styles since they might have different URLs!
		// We have to treat them seperately
		// [b: [b], i: [i], a: [google, microsoft]]
		let datasToCheck = {};
		let dataValues = {};
		//@TODO - is it ok here to rely on this object's order?
		for (let styleName in StyleType) {
			styleType = StyleType[styleName];
			datasToCheck[styleType] = [];
			dataValues[styleType] = [];
		}

		for (i = this.styles.length - 1; i >= 0; i--) {
			let styleRange = this.styles[i];
			let curData = styleRange.data;
			let curEncodedData = JSON.stringify(curData);

			if (datasToCheck[styleRange.type].indexOf(curEncodedData) === -1) {
				datasToCheck[styleRange.type].push(curEncodedData);
				dataValues[styleRange.type].push(curData);
			}
		}

		//console.log datasToCheck
		//console.log dataValues

		for (styleType in dataValues) {
			//console.log 'loop', styleType, datas
			let datas = dataValues[styleType];
			for (let data of Array.from(datas)) {
				let tmp = {};
				let total = 0;
				let start = null;

				for (let range of Array.from(this.styles)) {
					// range.invalidate() if range.length() is 0 #<-----@TODO

					if (range.isMergeable(styleType, data)) {
						if (tmp[range.start] == null) { tmp[range.start] = 0; }
						if (tmp[range.end] == null) { tmp[range.end] = 0; }

						tmp[range.start]++;
						tmp[range.end]--;
					}
				}

				let keys = Object.keys(tmp).sort(keySortFn);

				for (let key of Array.from(keys)) {
					let end = Number(key);
					let t = tmp[key];
					// if not isNaN t
					// console.log 'here'
					if (start == null) { start = end; }
					total += t;
					if (total === 0) {
						newStyles.push(new StyleRange(start, end, styleType, data));
						start = null;
					}
				}
			}
		}

		for (i = newStyles.length - 1; i >= 0; i--) {
			let style = newStyles[i];
			if (style.isInvalid()) {
				newStyles.splice(i, 1);
			}
		}

		return this.styles = newStyles;
	}
}

		// console.timeEnd 'normalize'

ChunkStyleList.createFromObject = function(o) {
	let styleList = new ChunkStyleList();

	if (o != null) {
		for (let rangeObj of Array.from(o)) {
			styleList.add(StyleRange.createFromObject(rangeObj));
		}
	}

	return styleList;
};


export default ChunkStyleList;