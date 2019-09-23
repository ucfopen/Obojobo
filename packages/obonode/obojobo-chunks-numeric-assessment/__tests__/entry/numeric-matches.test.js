import NumericMatches from '../../entry/numeric-matches'
import NumericClasses from '../../numerics/numeric-classes'

jest.mock('../../numerics/numeric-classes', () => {
	class MockExactLong {
		constructor() {
			this.type = 'typeExactLong'
			this.matchType = 'exact'
			this.valueString = 'mockValueStringWhichIsLong'
		}
	}

	class MockExactShort {
		constructor() {
			this.type = 'typeExactShort'
			this.matchType = 'exact'
			this.valueString = 'mockValueString'
		}
	}

	class MockExactSameLengthAsShort {
		constructor() {
			this.type = 'typeExactShort2'
			this.matchType = 'exact'
			this.valueString = 'sameLenAsShort!'
		}
	}

	class MockInferred {
		constructor() {
			this.type = 'typeInferred'
			this.matchType = 'inferred'
			this.valueString = 'mockValueString'
		}
	}

	class MockInferred2 {
		constructor() {
			this.type = 'typeInferred2'
			this.matchType = 'inferred'
			this.valueString = 'mockValueString2'
		}
	}

	class MockNone {
		constructor() {
			this.type = 'typeNone'
			this.matchType = 'none'
			this.valueString = 'mockValueString'
		}
	}
	return {
		TypeExactLong: MockExactLong,
		TypeExactShort: MockExactShort,
		TypeExactSameLengthAsShort: MockExactSameLengthAsShort,
		TypeInferred: MockInferred,
		TypeInferred2: MockInferred2,
		TypeNone: MockNone
	}
})

describe('NumericMatches', () => {
	test('Constructor creates new instance', () => {
		const matches = new NumericMatches()

		expect(matches.matches).toEqual({
			exact: [],
			inferred: []
		})

		expect(matches.instances).toEqual({})

		expect(matches.matchTypes).toEqual({})

		expect(matches.numMatches).toBe(0)
	})

	test('removeShorterExactMatches removes shorter exact matches', () => {
		const matches = new NumericMatches()
		const mockExactLong = new NumericClasses.TypeExactLong()
		const mockExactShort = new NumericClasses.TypeExactShort()
		matches.add(mockExactLong)
		matches.add(mockExactShort)

		expect(matches.status).toBe('singleExact')
		expect(matches.matches).toEqual({
			exact: ['typeExactLong'],
			inferred: []
		})
		expect(matches.numMatches).toBe(1)
	})

	test('remove will remove matches', () => {
		const matches = new NumericMatches()
		const mockExactLong = new NumericClasses.TypeExactLong()
		matches.add(mockExactLong)

		expect(matches.status).toBe('singleExact')
		expect(matches.matches).toEqual({
			exact: ['typeExactLong'],
			inferred: []
		})
		expect(matches.numMatches).toBe(1)

		matches.remove('typeExactLong')

		expect(matches.status).toBe('noMatches')
		expect(matches.numMatches).toBe(0)
		expect(matches.matches).toEqual({
			exact: [],
			inferred: []
		})
	})

	test('remove will do nothing if no matches are found', () => {
		const matches = new NumericMatches()
		const mockExactLong = new NumericClasses.TypeExactLong()
		matches.add(mockExactLong)

		matches.remove('typeExactShort')

		expect(matches.matches).toEqual({
			exact: ['typeExactLong'],
			inferred: []
		})
	})

	test('getMatchesForNumericType', () => {
		const matches = new NumericMatches()
		const mockExactLong = new NumericClasses.TypeExactLong()
		const mockTypeInferred = new NumericClasses.TypeInferred()
		matches.add(mockExactLong)
		matches.add(mockTypeInferred)

		expect(matches.getMatchesForNumericType('typeExactLong')).toEqual({
			matchType: 'exact',
			instance: mockExactLong
		})
		expect(matches.getMatchesForNumericType('typeInferred')).toEqual({
			matchType: 'inferred',
			instance: mockTypeInferred
		})
	})

	test('getNumericTypesForMatches', () => {
		const matches = new NumericMatches()
		const mockExactLong = new NumericClasses.TypeExactLong()
		const mockTypeInferred = new NumericClasses.TypeInferred()
		matches.add(mockExactLong)
		matches.add(mockTypeInferred)

		expect(matches.getNumericTypesForMatches('exact')).toEqual({
			numericTypes: ['typeExactLong'],
			instances: [mockExactLong]
		})
		expect(matches.getNumericTypesForMatches('inferred')).toEqual({
			numericTypes: ['typeInferred'],
			instances: [mockTypeInferred]
		})
	})

	test('getNumericTypesForMatches throws error if given bad type', () => {
		const matches = new NumericMatches()
		expect(() => {
			matches.getNumericTypesForMatches('someInvalidType')
		}).toThrow('Invalid matchType given')
	})

	test('getInstance', () => {
		const matches = new NumericMatches()
		const mockExactLong = new NumericClasses.TypeExactLong()
		const mockTypeInferred = new NumericClasses.TypeInferred()
		matches.add(mockExactLong)
		matches.add(mockTypeInferred)

		expect(matches.getInstance('typeExactLong')).toBe(mockExactLong)
		expect(matches.getInstance('typeInferred')).toBe(mockTypeInferred)
		expect(matches.getInstance('typeExactShort')).toBe(null)
	})

	test('getStatus returns the expected status value', () => {
		const matches = new NumericMatches()
		const mockExactShort = new NumericClasses.TypeExactShort()
		const mockExactShort2 = new NumericClasses.TypeExactSameLengthAsShort()
		const mockInferred = new NumericClasses.TypeInferred()
		const mockInferred2 = new NumericClasses.TypeInferred2()

		matches.add(mockExactShort)
		matches.add(mockExactShort2)
		matches.add(mockInferred)
		matches.add(mockInferred2)
		expect(matches.status).toBe('multipleExact')

		matches.remove('typeExactShort2')
		expect(matches.status).toBe('singleExact')

		matches.remove('typeExactShort')
		expect(matches.status).toBe('multipleInferred')

		matches.remove('typeInferred2')
		expect(matches.status).toBe('singleInferred')

		matches.remove('typeInferred')
		expect(matches.status).toBe('noMatches')
	})
})
