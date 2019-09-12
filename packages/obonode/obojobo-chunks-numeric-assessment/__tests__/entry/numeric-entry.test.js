/* eslint-disable new-cap */

jest.mock('../../numerics/numeric-classes', () => {
	class MockExact {
		constructor() {
			this.type = 'typeExact'
			this.matchType = 'exact'
			this.valueString = 'mockValueString'
		}

		get isSafe() {
			return true
		}
	}

	class MockInferred {
		constructor() {
			this.type = 'typeInferred'
			this.matchType = 'inferred'
			this.valueString = 'mockValueString'
		}

		get isSafe() {
			return true
		}
	}

	class MockNone {
		constructor() {
			this.type = 'typeNone'
			this.matchType = 'none'
			this.valueString = 'mockValueString'
		}

		get isSafe() {
			return true
		}
	}
	return {
		typeExact: MockExact,
		typeInferred: MockInferred,
		typeNone: MockNone
	}
})

import NumericMatches from '../../entry/numeric-matches.js'
import NumericClasses from '../../numerics/numeric-classes.js'
import NumericEntry from '../../entry/numeric-entry.js'

describe('NumericEntry', () => {
	test('getMatchingTypes returns a valid NumericMatches instance when no types given', () => {
		const matches = NumericEntry.getMatchingTypes('mockEntry')

		expect(matches.matches).toEqual({
			exact: ['typeExact'],
			inferred: ['typeInferred']
		})
	})

	test('getMatchingTypes returns a valid NumericMatches instance when types are given', () => {
		const matches = NumericEntry.getMatchingTypes('mockEntry', ['typeInferred'])

		expect(matches.matches).toEqual({
			exact: [],
			inferred: ['typeInferred']
		})
	})

	test('getNumericInstance returns the expected Numeric instance', () => {
		const matches = new NumericMatches()
		const mockExact = new NumericClasses.typeExact()
		const mockInferred = new NumericClasses.typeInferred()

		matches.add(mockExact)
		matches.add(mockInferred)

		expect(NumericEntry.getNumericInstance(matches, 'singleExact')).toEqual(mockExact)
		expect(NumericEntry.getNumericInstance(matches, 'singleInferred')).toEqual(mockInferred)
		expect(NumericEntry.getNumericInstance(matches, 'multipleExact')).toEqual(null)
		expect(NumericEntry.getNumericInstance(matches, 'multipleInferred')).toEqual(null)
		expect(NumericEntry.getNumericInstance(matches, 'noMatches')).toEqual(null)
	})

	test('getProcessedInput removes commas, extra whitespace and converts whitespace to spaces', () => {
		expect(NumericEntry.getProcessedInput(' 	 4,000  g	')).toBe('4000 g')
	})

	test('getStatus returns the expected status', () => {
		// Possible inputs
		// matches.status = 'multipleExact' || 'multipleInferred' || 'singleExact' || 'singleInferred' || 'noMatches' || 'someInvalidState'
		// numericInstance = (not defined) || isSafe || !isSafe
		// isValidInput = true or false

		const me = { status: 'multipleExact' }
		const mi = { status: 'multipleInferred' }
		const se = { status: 'singleExact' }
		const si = { status: 'singleInferred' }
		const nm = { status: 'noMatches' }
		const xx = { status: 'someInvalidState' }
		const notSafe = { isSafe: false }
		const safe = { isSafe: true }

		const gs = NumericEntry.getStatus

		expect(gs(me, null, false)).toBe('inputInvalid')
		expect(() => gs(me, null, true)).toThrow()
		expect(gs(me, notSafe, false)).toBe('inputInvalid')
		expect(() => gs(me, notSafe, true)).toThrow()
		expect(gs(me, safe, false)).toBe('inputInvalid')
		expect(() => gs(me, safe, true)).toThrow()

		expect(gs(mi, null, false)).toBe('inputInvalid')
		expect(gs(mi, null, true)).toBe('inputMatchesMultipleTypes')
		expect(gs(mi, notSafe, false)).toBe('inputInvalid')
		expect(gs(mi, notSafe, true)).toBe('inputNotSafe')
		expect(gs(mi, safe, false)).toBe('inputInvalid')
		expect(gs(mi, safe, true)).toBe('inputMatchesMultipleTypes')

		expect(gs(se, null, false)).toBe('inputInvalid')
		expect(() => gs(se, null, true)).toThrow()
		expect(gs(se, notSafe, false)).toBe('inputInvalid')
		expect(gs(se, notSafe, true)).toBe('inputNotSafe')
		expect(gs(se, safe, false)).toBe('inputInvalid')
		expect(gs(se, safe, true)).toBe('ok')

		expect(gs(si, null, false)).toBe('inputInvalid')
		expect(() => gs(si, null, true)).toThrow()
		expect(gs(si, notSafe, false)).toBe('inputInvalid')
		expect(gs(si, notSafe, true)).toBe('inputNotSafe')
		expect(gs(si, safe, false)).toBe('inputInvalid')
		expect(gs(si, safe, true)).toBe('ok')

		expect(gs(nm, null, false)).toBe('inputInvalid')
		expect(gs(nm, null, true)).toBe('inputNotMatched')
		expect(gs(nm, notSafe, false)).toBe('inputInvalid')
		expect(gs(nm, notSafe, true)).toBe('inputNotSafe')
		expect(gs(nm, safe, false)).toBe('inputInvalid')
		expect(gs(nm, safe, true)).toBe('inputNotMatched')

		expect(gs(xx, null, false)).toBe('inputInvalid')
		expect(() => gs(xx, null, true)).toThrow()
		expect(gs(xx, notSafe, false)).toBe('inputInvalid')
		expect(gs(xx, notSafe, true)).toBe('inputNotSafe')
		expect(gs(xx, safe, false)).toBe('inputInvalid')
		expect(() => gs(xx, safe, true)).toThrow()
	})

	test('constructor creates a new instance', () => {
		const allMatches = new NumericMatches()
		const matches = new NumericMatches()
		const mockExact = new NumericClasses.typeExact()
		const mockInferred = new NumericClasses.typeInferred()
		allMatches.add(mockExact)
		allMatches.add(mockInferred)
		matches.add(mockExact)
		matches.add(mockInferred)

		const entry = new NumericEntry('  4,000 	 g ')

		expect(entry.inputString).toBe('  4,000 	 g ')
		expect(entry.types).toBe(null)
		expect(entry.processedInputString).toBe('4000 g')
		expect(entry.allMatches).toEqual(allMatches)
		expect(entry.matches).toEqual(matches)
		expect(entry.isValidInput).toBe(true)
		expect(entry.numericInstance).toEqual(mockExact)
		expect(entry.status).toBe('ok')
	})

	test('constructor with types creates a new instance with types', () => {
		const allMatches = new NumericMatches()
		const matches = new NumericMatches()
		const mockExact = new NumericClasses.typeExact()
		const mockInferred = new NumericClasses.typeInferred()
		allMatches.add(mockExact)
		allMatches.add(mockInferred)

		const entry = new NumericEntry('  4,000 	 g ', ['typeNone'])

		expect(entry.inputString).toBe('  4,000 	 g ')
		expect(entry.types).toEqual(['typeNone'])
		expect(entry.processedInputString).toBe('4000 g')
		expect(entry.allMatches).toEqual(allMatches)
		expect(entry.matches).toEqual(matches)
		expect(entry.isValidInput).toBe(true)
		expect(entry.numericInstance).toEqual(null)
		expect(entry.status).toBe('inputNotMatched')
	})

	test('constructor throws error if wrong type of value passed in', () => {
		expect(() => {
			new NumericEntry(true) // eslint-disable-line no-new
		}).toThrow('inputString must be of type string!')
	})
})
