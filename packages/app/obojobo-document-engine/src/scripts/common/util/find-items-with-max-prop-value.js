// look up a nested object property using 'dot notation'
// EG: 'result.attemptScore' is split to ['result', 'attemptScore']
// then reduce runs over the splitProp array
// feeding in  `attempt` object
// iteration 1: o = attempt['result']
// iteration 2 o = o['attemptScore']
// Will return an array of the highest values
// Expected values would be any floating point number or `null`.
const digNested = (item, nestedPropArray) => nestedPropArray.reduce((o, i) => o[i], item)
const digOne = (item, propArray) => item[propArray[0]]

const findItemsWithMaxPropValue = (items, path) => {
	if (items.length === 0) return []

	const splitProp = path.split('.')
	const dig = splitProp.length === 1 ? digOne : digNested
	let maxValue = null
	let itemsWithMaxValue = [] // all items w/ max value

	items.forEach(item => {
		let propValue = dig(item, splitProp)

		if (propValue === undefined) return //eslint-disable-line no-undefined

		// Special case - We consider `null` but consider it the lowest possible value
		if (propValue === null) {
			propValue = Number.NEGATIVE_INFINITY
		}

		// new max value, reset
		if (maxValue === null || propValue > maxValue) {
			maxValue = propValue
			itemsWithMaxValue = []
		}

		// keep this item
		if (propValue === maxValue) itemsWithMaxValue.push(item)
	})

	return itemsWithMaxValue
}

export default findItemsWithMaxPropValue
