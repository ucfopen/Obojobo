import NumericMatches from '../../entry/numeric-matches'
import NumericClasses from '../../numerics/numeric-classes'
import NumericEntry from '../../entry/numeric-entry'

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

	class MockInferred {
		constructor() {
			this.type = 'typeInferred'
			this.matchType = 'inferred'
			this.valueString = 'mockValueString'
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
		typeExactLong: MockExactLong,
		typeExactShort: MockExactShort,
		typeInferred: MockInferred,
		typeNone: MockNone
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
		const mockExactLong = new NumericClasses.typeExactLong()
		const mockExactShort = new NumericClasses.typeExactShort()
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
		const mockExactLong = new NumericClasses.typeExactLong()
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

	test('getMatchesForNumericType', () => {
		const matches = new NumericMatches()
		const mockExactLong = new NumericClasses.typeExactLong()
		const mockTypeInferred = new NumericClasses.typeInferred()
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
		const mockExactLong = new NumericClasses.typeExactLong()
		const mockTypeInferred = new NumericClasses.typeInferred()
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

	test('getInstance', () => {
		const matches = new NumericMatches()
		const mockExactLong = new NumericClasses.typeExactLong()
		const mockTypeInferred = new NumericClasses.typeInferred()
		matches.add(mockExactLong)
		matches.add(mockTypeInferred)

		expect(matches.getInstance('typeExactLong')).toBe(mockExactLong)
		expect(matches.getInstance('typeInferred')).toBe(mockTypeInferred)
		expect(matches.getInstance('typeExactShort')).toBe(null)
	})
})
