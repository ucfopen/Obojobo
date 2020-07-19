// look up a nested object property using 'dot notation'
// EG: 'result.attemptScore' is split to ['result', 'attemptScore']
// then reduce runs over the splitProp array
// feeding in  `attempt` object
// iteration 1: o = attempt['result']
// iteration 2 o = o['attemptScore']
const digNested = (item, nestedPropArray) => nestedPropArray.reduce((o, i) => o[i], item)
const digOne = (item, propArray) => item[propArray[0]]

const findItemsWithMaxPropValue = (items, nestedProperty) => {
	if (items.length === 0) return []

	const splitProp = nestedProperty.split('.')
	const dig = splitProp.length === 1 ? digOne : digNested
	let maxValue = Number.NEGATIVE_INFINITY // initialize to minimum value
	let itemsWithMaxValue = [] // all items w/ max value

	items.forEach(item => {
		const propValue = dig(item, splitProp)

		if (propValue === undefined) return //eslint-disable-line no-undefined

		// new max value, reset
		if (propValue > maxValue) {
			maxValue = propValue
			itemsWithMaxValue = []
		}

		// keep this item
		if (propValue === maxValue) itemsWithMaxValue.push(item)
	})

	return itemsWithMaxValue
}

export default findItemsWithMaxPropValue
