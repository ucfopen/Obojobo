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

		// if (!def.name) {
		// 	throw 'Missing required name property!'
		// }

		let value = null

		switch (def.type) {
			case 'list-random':
				value = this.getListRandom(def)
				break

			case 'list-sequence':
				value = this.getListSequence(def)
				break

			case 'numeric':
				value = this.getNumeric(def)
				break

			case 'pick-one':
				value = this.getPickOne(def)
				break

			case 'pick-list':
				value = this.getPickList(def)
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

	getListRandom(def) {
		return this.generateRandomArray(
			parseFloat(def.min),
			parseFloat(def.max),
			parseInt(def.size, 10),
			parseInt(def.decimals, 10),
			Boolean(def.unique)
		)
	}

	getListSequence(def) {
		const list = []

		const start = parseFloat(def.start) || 1
		const step = parseFloat(def.step) || 1

		for (let i = 0, len = parseInt(def.size, 10); i < len; i++) {
			list.push(start + i * step)
		}

		return list
	}

	getNumeric(def) {
		return this.getNumber(parseFloat(def.min), parseFloat(def.max), parseInt(def.decimals, 10))
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

	getNumber(min, max, decimals = 0) {
		if (min > max) {
			throw 'Min cannot be above max!'
		}

		if (decimals < 0) {
			throw 'Decimals must be >= 0!'
		}

		// debugger

		return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
	}

	generateRandomArray(min, max, size, decimals = 0, unique = false) {
		const list = []

		while (list.length < size) {
			const n = this.getNumber(min, max, decimals)

			if (!unique || list.indexOf(n) === -1) {
				list.push(n)
			}
		}

		return list
	}

	pickOne(list) {
		return list[this.getNumber(0, list.length - 1)]
	}

	pickMany(list, minAmount, maxAmount, ordered = false) {
		if (minAmount > list.length || maxAmount > list.length) {
			throw 'min or max cannot be larger than the size of the list!'
		}

		if (minAmount > maxAmount) {
			throw 'min cannot be larger than max!'
		}

		const size = this.getNumber(minAmount, maxAmount)

		list = this.generateRandomArray(0, list.length - 1, size, 0, true)
			.sort()
			.map(i => list[i])

		return ordered ? list : _.shuffle(list)
	}
}

const variableGenerator = new VariableGenerator()

export default variableGenerator
