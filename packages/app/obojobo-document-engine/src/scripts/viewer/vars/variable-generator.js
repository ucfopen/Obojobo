import _ from 'underscore'
import parse from './parser'

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
		if (def.type === 'set') {
			return this.getSet(def)
		}

		console.log('def', def)

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
		return this.generateRandomArray(
			this.rand(parseInt(def.sizeMin, 10), parseInt(def.sizeMax, 10)),
			parseFloat(def.valueMin),
			parseFloat(def.valueMax),
			parseInt(def.decimalPlacesMin, 10),
			parseInt(def.decimalPlacesMax, 10),
			Boolean(def.unique)
		)
	}

	getRandomSequence(def) {
		const list = []

		const start = parseFloat(def.start) || 1
		const step = parseFloat(def.step) || 1
		const size = this.rand(parseInt(def.sizeMin, 10), parseInt(def.sizeMax, 10))
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
		return this.rand(
			parseFloat(def.valueMin),
			parseFloat(def.valueMax),
			this.rand(parseInt(def.decimalPlacesMin, 10), parseInt(def.decimalPlacesMax, 10))
		)
	}

	getPickOne(def) {
		// console.log('p1', this.pickOne(def.values.split('|').map(parse)))
		// return this.pickOne(def.values.split('|').map(parse))
		return this.pickOne(parse(def.values))
	}

	getPickList(def) {
		return this.pickMany(
			// def.values.split('|').map(parse),
			parse(def.values),
			parseInt(def.min, 10),
			parseInt(def.max, 10),
			Boolean(def.ordered)
		)
	}

	getSet(def) {
		const names = {}
		def.values.forEach(arr => {
			arr.forEach(childDef => {
				if (childDef.type === 'set') {
					throw 'Unable to nest sets!'
				}

				if (!names[childDef.name]) {
					names[childDef.name] = 0
				}

				names[childDef.name]++
			})
		})

		const nameCounts = Object.values(names)
		const expectedCount = nameCounts[0]
		nameCounts.forEach(c => {
			if (c !== expectedCount) {
				throw 'Variable mismatch inside set!'
			}
		})

		const chosenDefs = this.pickOne(def.values)

		const results = chosenDefs.map(this.generateOne)

		return results
	}

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

		return ordered ? list : _.shuffle(list)
	}
}

const variableGenerator = new VariableGenerator()

export default variableGenerator
