const { getParsedRange } = require('../../../common/util/range-parsing')
const shuffle = require('../../../common/util/shuffle').default

const parse = s => s.split(',')

const getRange = rangeString => {
	const range = getParsedRange(rangeString)

	if (!range.isMinInclusive || !range.isMaxInclusive) {
		throw 'Range ' + rangeString + ' must be inclusive!'
	}

	if (range.min > range.max) {
		throw 'Range ' + rangeString + ' is inverted'
	}

	const min = parseFloat(range.min)
	const max = parseFloat(range.max)

	if (!Number.isFinite(min) || !Number.isFinite(max)) {
		throw 'Range ' + rangeString + ' has non-numeric values'
	}

	return [min, max]
}

const getPosIntRange = rangeString => {
	const [min, max] = getRange(rangeString)

	if (min < 0 || max < 0) {
		throw 'Range ' + rangeString + ' must be positive!'
	}

	if (parseInt(min, 10) !== min || parseInt(max, 10) !== max) {
		throw 'Range ' + rangeString + ' must be int values only'
	}

	return [min, max]
}

const getPosNonZeroIntRange = rangeString => {
	const [min, max] = getPosIntRange(rangeString)

	if (min < 1 || max < 1) {
		throw 'Range ' + rangeString + ' values must be non-zero!'
	}

	return [min, max]
}

class VariableGenerator {
	// generate(defs) {
	// 	const generated = defs.reduce(
	// 		(acc, def) => acc.concat(this.generateOne(def)),
	// 		[]
	// 	)

	// 	const table = {}
	// 	generated.forEach(g => {
	// 		if (table[g.name]) {
	// 			throw 'Duplicate variable definition!'
	// 		}

	// 		table[g.name] = g.value
	// 	})

	// 	return table
	// }

	generateOne(def) {
		// if (def.type === 'set') {
		// 	return this.getSet(def)
		// }

		// if (!def.name) {
		// 	throw 'Missing required name property!'
		// }

		let value = null

		switch (def.type) {
			case 'random-list':
				value = this.getRandomList(def)
				break

			case 'random-sequence':
				value = this.getRandomSequence(def)
				break

			case 'random-number':
				value = this.getRandomNumber(def)
				break

			case 'pick-one':
				value = this.getPickOne(def)
				break

			case 'pick-list':
				value = this.getPickList(def)
				break

			case 'static-value':
			case 'static-list':
				value = def.value
				break

			// case 'fn':
			// 	value = parse(def)
			// 	break

			default:
				throw 'Unexpected type!'
		}

		// return {
		// 	name: def.name,
		// 	value
		// }
		return value
	}

	getRandomList(def) {
		const [sizeMin, sizeMax] = getPosIntRange(def.size)
		const [valueMin, valueMax] = getRange(def.value)
		const [decimalPlacesMin, decimalPlacesMax] = getPosIntRange(def.decimalPlaces)

		return this.generateRandomArray(
			this.rand(sizeMin, sizeMax),
			valueMin,
			valueMax,
			decimalPlacesMin,
			decimalPlacesMax,
			Boolean(def.unique)
		)
	}

	getRandomSequence(def) {
		const list = []

		const start = parseFloat(def.start) || 1
		const step = parseFloat(def.step) || 1
		const [sizeMin, sizeMax] = getPosIntRange(def.size)
		const size = this.rand(sizeMin, sizeMax)
		const seriesType = ('' + def.seriesType).toLowerCase()

		let next
		switch (seriesType) {
			case 'arithmetic':
				next = (arr, index, step) => arr[index - 1] + step
				break

			case 'geometric':
				next = (arr, index, step) => arr[index - 1] * step
				break

			default:
				throw 'Invalid sequence seriesType!'
		}

		list.push(start)
		for (let i = 1, len = size; i < len; i++) {
			list.push(next(list, i, step))
		}

		return list
	}

	getRandomNumber(def) {
		const [valueMin, valueMax] = getRange(def.value)
		const [decimalPlacesMin, decimalPlacesMax] = getPosIntRange(def.decimalPlaces)

		return this.rand(valueMin, valueMax, this.rand(decimalPlacesMin, decimalPlacesMax))
	}

	getPickOne(def) {
		return this.pickOne(parse(def.value))
	}

	getPickList(def) {
		const [chooseMin, chooseMax] = getPosNonZeroIntRange(def.choose)

		return this.pickMany(parse(def.value), chooseMin, chooseMax, Boolean(def.ordered))
	}

	// getSet(def) {
	// 	const names = {}
	// 	def.values.forEach(arr => {
	// 		arr.forEach(childDef => {
	// 			if (childDef.type === 'set') {
	// 				throw 'Unable to nest sets!'
	// 			}

	// 			if (!names[childDef.name]) {
	// 				names[childDef.name] = 0
	// 			}

	// 			names[childDef.name]++
	// 		})
	// 	})

	// 	const nameCounts = Object.values(names)
	// 	const expectedCount = nameCounts[0]
	// 	nameCounts.forEach(c => {
	// 		if (c !== expectedCount) {
	// 			throw 'Variable mismatch inside set!'
	// 		}
	// 	})

	// 	const chosenDefs = this.pickOne(def.values)

	// 	const results = chosenDefs.map(this.generateOne)

	// 	return results
	// }

	rand(min, max, decimals = 0) {
		if (min > max) {
			throw 'Min cannot be above max!'
		}

		if (decimals < 0) {
			throw 'Decimals must be >= 0!'
		}

		// debugger

		return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
	}

	generateRandomArray(size, valueMin, valueMax, decimalsMin, decimalsMax, unique = false) {
		const list = []

		while (list.length < size) {
			const n = this.rand(valueMin, valueMax, this.rand(decimalsMin, decimalsMax))

			if (!unique || list.indexOf(n) === -1) {
				list.push(n)
			}
		}

		return list
	}

	pickOne(list) {
		return list[this.rand(0, list.length - 1)]
	}

	pickMany(list, sizeMin, sizeMax, ordered = false) {
		if (sizeMin > list.length || sizeMax > list.length) {
			throw 'min or max cannot be larger than the size of the list!'
		}

		if (sizeMin > sizeMax) {
			throw 'min cannot be larger than max!'
		}

		const size = this.rand(sizeMin, sizeMax)

		list = this.generateRandomArray(size, 0, list.length - 1, 0, 0, true)
			.sort()
			.map(i => list[i])

		return ordered ? list : shuffle(list)
	}
}

const variableGenerator = new VariableGenerator()

module.exports = variableGenerator
