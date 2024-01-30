// ideally we could import the list of constants defined in the document engine
// unfortunately they're exported in a way Node doesn't like because JavaScript is stupid
// revisit this when JavaScript is less stupid
const STATIC_VALUE = 'static-value'
const RANDOM_NUMBER = 'random-number'
const STATIC_LIST = 'static-list'
const RANDOM_LIST = 'random-list'
const RANDOM_SEQUENCE = 'random-sequence'
const PICK_ONE = 'pick-one'
const PICK_LIST = 'pick-list'

const shuffle = require('obojobo-document-engine/src/scripts/common/util/shuffle')

const getParsedRange = range => {
	if (typeof range === 'undefined' || range === null) return null

	if (range.indexOf(',') === -1) return getParsedRangeFromSingleValue(range)

	const ints = range.replace(/[([)\] ]+/g, '')
	const rangeValues = ints.split(',')

	return {
		min: rangeValues[0],
		isMinInclusive: range.charAt(0) === '[',
		max: rangeValues[1],
		isMaxInclusive: range.charAt(range.length - 1) === ']'
	}
}

const getParsedRangeFromSingleValue = value => {
	return {
		min: value,
		isMinInclusive: true,
		max: value,
		isMaxInclusive: true
	}
}

const parse = s => s.split(',')

const getRange = rangeString => {
	const range = getParsedRange(rangeString)

	if (!range) {
		throw `Range '${rangeString}' is invalid!`
	}

	if (!range.isMinInclusive || !range.isMaxInclusive) {
		throw `Range '${rangeString}' must be inclusive!`
	}

	const min = parseFloat(range.min)
	const max = parseFloat(range.max)

	if (!Number.isFinite(min) || !Number.isFinite(max)) {
		throw `Range '${rangeString}' has non-numeric values!`
	}

	if (min > max) {
		throw `Range '${rangeString}' is inverted!`
	}

	return [min, max]
}

const getPosIntRange = rangeString => {
	const [min, max] = getRange(rangeString)

	// max < 0 should not be reachable since getRange will throw before it gets here
	if (min < 0 || max < 0) {
		throw `Range '${rangeString}' must be positive!`
	}

	if (parseInt(min, 10) !== min || parseInt(max, 10) !== max) {
		throw `Range '${rangeString}' must be int values only!`
	}

	return [min, max]
}

const getPosNonZeroIntRange = rangeString => {
	const [min, max] = getPosIntRange(rangeString)

	if (min < 1 || max < 1) {
		throw `Range '${rangeString}' values must be non-zero!`
	}

	return [min, max]
}

class VariableGenerator {
	generateOne(def) {
		let value = null

		switch (def.type) {
			case RANDOM_LIST:
				value = this.getRandomList(def)
				break

			case RANDOM_SEQUENCE:
				value = this.getRandomSequence(def)
				break

			case RANDOM_NUMBER:
				value = this.getRandomNumber(def)
				break

			case PICK_ONE:
				value = this.getPickOne(def)
				break

			case PICK_LIST:
				value = this.getPickList(def)
				break

			case STATIC_VALUE:
			case STATIC_LIST:
				value = def.value
				break

			default:
				throw 'Unexpected type!'
		}

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

	rand(min, max, decimals = 0) {
		if (min > max) {
			throw 'Min cannot be above max!'
		}

		if (decimals < 0) {
			throw 'Decimals must be >= 0!'
		}

		return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
	}

	generateRandomArray(size, valueMin, valueMax, decimalsMin, decimalsMax, unique) {
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

	pickMany(list, sizeMin, sizeMax, ordered) {
		if (sizeMin > list.length || sizeMax > list.length) {
			throw 'min or max cannot be larger than the size of the list!'
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
