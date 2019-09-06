import NumericRuleOutcome from '../../rule/numeric-rule-outcome'
import NumericRule from '../../rule/numeric-rule'

import Big from 'big.js'
import NumericEntryRange from '../../range/numeric-entry-range'
import NumericEntry from '../../entry/numeric-entry'
import BigValueRange from '../../range/big-value-range'

describe('NumericRule', () => {
	test.each`
		config                                   | throwsOrReturns | result
		${{ percentError: 1, absoluteError: 1 }} | ${'throws'}     | ${"Can't have both errors!"}
		${{ percentError: 1 }}                   | ${'returns'}    | ${'percent'}
		${{ absoluteError: 1 }}                  | ${'returns'}    | ${'absolute'}
		${{}}                                    | ${'returns'}    | ${'noError'}
	`(
		`getRuleErrorType($config) = $throwsOrReturns $result`,
		({ config, throwsOrReturns, result }) => {
			if (throwsOrReturns === 'throws') {
				expect(() => {
					NumericRule.getRuleErrorType(config)
				}).toThrow(result)
			} else {
				expect(NumericRule.getRuleErrorType(config)).toEqual(result)
			}
		}
	)

	test('getRuleErrorValue calls the expected method', () => {
		const percSpy = jest
			.spyOn(NumericRule, 'getRulePercentError')
			.mockImplementation(() => 'mock-percent-value')
		const absSpy = jest
			.spyOn(NumericRule, 'getRuleAbsoluteError')
			.mockImplementation(() => 'mock-absolute-value')

		expect(NumericRule.getRuleErrorValue({ percentError: 1 })).toBe('mock-percent-value')
		expect(percSpy).toHaveBeenCalledTimes(1)
		expect(absSpy).toHaveBeenCalledTimes(0)

		expect(NumericRule.getRuleErrorValue({ absoluteError: 1 })).toBe('mock-absolute-value')
		expect(percSpy).toHaveBeenCalledTimes(1)
		expect(absSpy).toHaveBeenCalledTimes(1)

		expect(NumericRule.getRuleErrorValue({})).toEqual(Big(0))
		expect(percSpy).toHaveBeenCalledTimes(1)
		expect(absSpy).toHaveBeenCalledTimes(1)

		percSpy.mockRestore()
		absSpy.mockRestore()
	})

	test('getRuleAbsoluteError returns the expected value', () => {
		expect(NumericRule.getRuleAbsoluteError({})).toEqual(Big(0))
		expect(NumericRule.getRuleAbsoluteError({ absoluteError: false })).toEqual(Big(0))
		expect(NumericRule.getRuleAbsoluteError({ absoluteError: 9 })).toEqual(Big(9))
	})

	test('isTypesValid returns true if the given types are valid', () => {
		expect(NumericRule.isTypesValid([])).toBe(true)
		expect(
			NumericRule.isTypesValid(['decimal', 'scientific', 'fractional', 'hex', 'octal', 'binary'])
		).toBe(true)
		expect(
			NumericRule.isTypesValid([
				'doggos',
				'decimal',
				'scientific',
				'fractional',
				'hex',
				'octal',
				'binary'
			])
		).toBe(false)
	})

	test('getAllowedRuleTypes returns all rule types if no rules given', () => {
		expect(NumericRule.getAllowedRuleTypes({})).toEqual([
			'scientific',
			'decimal',
			'fractional',
			'hex',
			'octal',
			'binary'
		])

		expect(NumericRule.getAllowedRuleTypes({ types: '' })).toEqual([
			'scientific',
			'decimal',
			'fractional',
			'hex',
			'octal',
			'binary'
		])
	})

	test('getAllowedRuleTypes returns the types given', () => {
		expect(NumericRule.getAllowedRuleTypes({ types: 'decimal,fractional' })).toEqual([
			'decimal',
			'fractional'
		])
	})

	test('getAllowedRuleTypes throws an error if a bad type is given', () => {
		expect(() => {
			NumericRule.getAllowedRuleTypes({ types: 'doggos' })
		}).toThrow('Invalid type given')
	})

	test('getRuleSigFigs returns an infinite BigValueRange if nothing given', () => {
		expect(NumericRule.getRuleSigFigs({})).toEqual(new BigValueRange('*'))
		expect(NumericRule.getRuleSigFigs({ sigFigs: null })).toEqual(new BigValueRange('*'))
	})

	test('getRuleSigFigs returns a BigValueRange of the given range', () => {
		expect(NumericRule.getRuleSigFigs({ sigFigs: '2' })).toEqual(new BigValueRange('2'))
		expect(NumericRule.getRuleSigFigs({ sigFigs: '(2,6]' })).toEqual(new BigValueRange('(2,6]'))
	})

	test('getRuleSigFigs throws error if given an invalid range', () => {
		expect(() => {
			NumericRule.getRuleSigFigs({ sigFigs: '0' })
		}).toThrow('sigFigs range must be larger than 0')

		expect(() => {
			NumericRule.getRuleSigFigs({ sigFigs: '[0,2]' })
		}).toThrow('sigFigs range must be larger than 0')

		expect(() => {
			NumericRule.getRuleSigFigs({ sigFigs: '(*,2]' })
		}).toThrow('sigFigs range must be larger than 0')
	})

	test('getRuleDecimalDigits returns an infinte BigValueRange if not given a digits value', () => {
		expect(NumericRule.getRuleDecimalDigits({})).toEqual(new BigValueRange('*'))
		expect(NumericRule.getRuleDecimalDigits({ decimals: null })).toEqual(new BigValueRange('*'))
	})

	test('getRuleDecimalDigits returns a BigValueRange of the given value', () => {
		expect(NumericRule.getRuleDecimalDigits({ decimals: '0' })).toEqual(new BigValueRange('0'))
		expect(NumericRule.getRuleDecimalDigits({ decimals: '[0,2]' })).toEqual(
			new BigValueRange('[0,2]')
		)
		expect(NumericRule.getRuleDecimalDigits({ decimals: '2' })).toEqual(new BigValueRange('2'))
		expect(NumericRule.getRuleDecimalDigits({ decimals: '(2,6]' })).toEqual(
			new BigValueRange('(2,6]')
		)
	})

	test('getRuleDecimalDigits throws error if given an invalid range', () => {
		expect(() => {
			NumericRule.getRuleDecimalDigits({ decimals: '-1' })
		}).toThrow('decimals range must be 0 or larger')

		expect(() => {
			NumericRule.getRuleDecimalDigits({ decimals: '[-1,2]' })
		}).toThrow('decimals range must be 0 or larger')

		expect(() => {
			NumericRule.getRuleDecimalDigits({ decimals: '(*,2]' })
		}).toThrow('decimals range must be 0 or larger')
	})

	test('getIsInteger returns the config value if explicity boolean', () => {
		expect(NumericRule.getIsInteger({ isInteger: true })).toBe(true)
		expect(NumericRule.getIsInteger({ isInteger: false })).toBe(false)
		expect(NumericRule.getIsInteger({ isInteger: 1 })).toBe(null)
		expect(NumericRule.getIsInteger({ isInteger: 0 })).toBe(null)
		expect(NumericRule.getIsInteger({ isInteger: null })).toBe(null)
		expect(NumericRule.getIsInteger({})).toBe(null)
	})

	test('getRuleIsFractionReduced returns the config value if explicity boolean', () => {
		expect(NumericRule.getRuleIsFractionReduced({ isFractionReduced: true })).toBe(true)
		expect(NumericRule.getRuleIsFractionReduced({ isFractionReduced: false })).toBe(false)
		expect(NumericRule.getRuleIsFractionReduced({ isFractionReduced: 1 })).toBe(null)
		expect(NumericRule.getRuleIsFractionReduced({ isFractionReduced: 0 })).toBe(null)
		expect(NumericRule.getRuleIsFractionReduced({ isFractionReduced: null })).toBe(null)
		expect(NumericRule.getRuleIsFractionReduced({})).toBe(null)
	})

	test('getRuleIsValidScientific returns the config value if explicity boolean', () => {
		expect(NumericRule.getRuleIsValidScientific({ isValidScientific: true })).toBe(true)
		expect(NumericRule.getRuleIsValidScientific({ isValidScientific: false })).toBe(false)
		expect(NumericRule.getRuleIsValidScientific({ isValidScientific: 1 })).toBe(null)
		expect(NumericRule.getRuleIsValidScientific({ isValidScientific: 0 })).toBe(null)
		expect(NumericRule.getRuleIsValidScientific({ isValidScientific: null })).toBe(null)
		expect(NumericRule.getRuleIsValidScientific({})).toBe(null)
	})

	test('getRuleScore returns 0 if no score given', () => {
		expect(NumericRule.getRuleScore({})).toBe(0)
		expect(NumericRule.getRuleScore({ score: null })).toBe(0)
	})

	test('getRuleScore returns a float value of the score', () => {
		expect(NumericRule.getRuleScore({ score: 0 })).toBe(0)
		expect(NumericRule.getRuleScore({ score: 12.34 })).toBe(12.34)
		expect(NumericRule.getRuleScore({ score: 100 })).toBe(100)
		expect(NumericRule.getRuleScore({ score: '0' })).toBe(0)
		expect(NumericRule.getRuleScore({ score: '12.34' })).toBe(12.34)
		expect(NumericRule.getRuleScore({ score: '100' })).toBe(100)
	})

	test('getRuleScore throws error if given bad score value', () => {
		expect(() => {
			NumericRule.getRuleScore({ score: -1 })
		}).toThrowError('Score must be 0-100')

		expect(() => {
			NumericRule.getRuleScore({ score: 101 })
		}).toThrowError('Score must be 0-100')

		expect(() => {
			NumericRule.getRuleScore({ score: 'one hundered' })
		}).toThrowError('Score must be 0-100')
	})

	test('getRuleRound returns "none" if falsy', () => {
		expect(NumericRule.getRuleRound({})).toBe('none')
		expect(NumericRule.getRuleRound({ round: false })).toBe('none')
	})

	test('getRuleRound returns a valid round value', () => {
		expect(NumericRule.getRuleRound({ round: 'none' })).toBe('none')
		expect(NumericRule.getRuleRound({ round: 'decimals' })).toBe('decimals')
		expect(NumericRule.getRuleRound({ round: 'sig-figs' })).toBe('sig-figs')
	})

	test('getRuleRound throws an error if given an invalid round value', () => {
		expect(() => {
			NumericRule.getRuleRound({ round: 'abc123' })
		}).toThrow('Invalid round value')
	})

	//////

	test('getRuleScientificTypes returns all rule types if no rules given', () => {
		expect(NumericRule.getRuleScientificTypes({})).toEqual(['apos', 'asterisk', 'e', 'ee', 'x'])

		expect(NumericRule.getRuleScientificTypes({ scientificTypes: '' })).toEqual([
			'apos',
			'asterisk',
			'e',
			'ee',
			'x'
		])
	})

	test('getRuleScientificTypes returns the types given', () => {
		expect(NumericRule.getRuleScientificTypes({ scientificTypes: 'e,ee' })).toEqual(['e', 'ee'])
	})

	test('getRuleScientificTypes throws an error if a bad type is given', () => {
		expect(() => {
			NumericRule.getRuleScientificTypes({ scientificTypes: 'doggos' })
		}).toThrow('Invalid scientific type given')
	})

	test('getUnitsMatch returns "matches-unit" if falsy value given', () => {
		expect(NumericRule.getUnitsMatch({ unitsMatch: null })).toBe('matches-unit')
		expect(NumericRule.getUnitsMatch({ unitsMatch: false })).toBe('matches-unit')
		expect(NumericRule.getUnitsMatch({ unitsMatch: '' })).toBe('matches-unit')
		expect(NumericRule.getUnitsMatch({})).toBe('matches-unit')
	})

	test('getUnitsMatch returns value if valid value given', () => {
		expect(NumericRule.getUnitsMatch({ unitsMatch: 'no-unit' })).toBe('no-unit')
		expect(NumericRule.getUnitsMatch({ unitsMatch: 'any-unit' })).toBe('any-unit')
		expect(NumericRule.getUnitsMatch({ unitsMatch: 'ignore-unit' })).toBe('ignore-unit')
		expect(NumericRule.getUnitsMatch({ unitsMatch: 'matches-unit' })).toBe('matches-unit')
	})

	test('getUnitsMatch throws if invalid value given', () => {
		expect(() => {
			NumericRule.getUnitsMatch({ unitsMatch: true })
		}).toThrow('Invalid unitsMatch property')
	})

	test('getAllUnits returns both the unit in value with additionalUnits', () => {
		expect(NumericRule.getAllUnits({ additionalUnits: '' }, { unit: '' })).toEqual([''])
		expect(NumericRule.getAllUnits({}, { unit: '' })).toEqual([''])
		expect(NumericRule.getAllUnits({ additionalUnits: '' }, { unit: 'g' })).toEqual(['g'])
		expect(NumericRule.getAllUnits({ additionalUnits: 'grams' }, { unit: 'g' })).toEqual([
			'g',
			'grams'
		])
		expect(
			NumericRule.getAllUnits({ additionalUnits: 'grams,another-unit' }, { unit: 'g' })
		).toEqual(['g', 'grams', 'another-unit'])
		expect(NumericRule.getAllUnits({ additionalUnits: 'g,g,g' }, { unit: 'g' })).toEqual(['g'])
		expect(NumericRule.getAllUnits({ additionalUnits: 'g' }, { unit: '' })).toEqual(['g'])
	})

	test('getUnitsAreCaseSensitive only returns true if value is true', () => {
		expect(NumericRule.getUnitsAreCaseSensitive({ unitsAreCaseSensitive: false })).toBe(false)
		expect(NumericRule.getUnitsAreCaseSensitive({ unitsAreCaseSensitive: 0 })).toBe(false)
		expect(NumericRule.getUnitsAreCaseSensitive({ unitsAreCaseSensitive: 1 })).toBe(false)
		expect(NumericRule.getUnitsAreCaseSensitive({ unitsAreCaseSensitive: 'true' })).toBe(false)
		expect(NumericRule.getUnitsAreCaseSensitive({ unitsAreCaseSensitive: '' })).toBe(false)
		expect(NumericRule.getUnitsAreCaseSensitive({})).toBe(false)
		expect(NumericRule.getUnitsAreCaseSensitive({ unitsAreCaseSensitive: true })).toBe(true)
	})

	test('getRuleValue returns an infinite range if nothing given', () => {
		expect(NumericRule.getRuleValue({})).toEqual(new NumericEntryRange('*'))
		expect(NumericRule.getRuleValue({ value: null })).toEqual(new NumericEntryRange('*'))
		expect(NumericRule.getRuleValue({ value: false })).toEqual(new NumericEntryRange('*'))
		expect(NumericRule.getRuleValue({ value: 0 })).toEqual(new NumericEntryRange('*'))
		expect(NumericRule.getRuleValue({ value: '' })).toEqual(new NumericEntryRange('*'))
	})

	test('getRuleValue returns a NumericEntryRange', () => {
		expect(NumericRule.getRuleValue({ value: '0' })).toEqual(new NumericEntryRange('0'))
		expect(NumericRule.getRuleValue({ value: '1.77g' })).toEqual(new NumericEntryRange('1.77g'))
		expect(NumericRule.getRuleValue({ value: '(*,*)kCal' })).toEqual(
			new NumericEntryRange('(*,*)kCal')
		)
		expect(NumericRule.getRuleValue({ value: '[0xF0 bytes,0xFF bytes]' })).toEqual(
			new NumericEntryRange('[0xF0 bytes,0xFF bytes]')
		)
	})

	test('getNonStandardProperties returns props not in the schema', () => {
		expect(
			NumericRule.getNonStandardProperties({
				percentError: true,
				absoluteError: true,
				blueberries: true,
				types: true,
				sigFigs: true,
				decimals: true,
				isInteger: true,
				isFractionReduced: true,
				isValidScientific: true,
				strawberries: true,
				score: true,
				round: true,
				unitsMatch: true,
				additionalUnits: true,
				unitsAreCaseSensitive: true,
				scientificTypes: true,
				blackberries: true,
				value: true
			})
		).toEqual(['blueberries', 'strawberries', 'blackberries'])
	})

	test('constructor sets valid values', () => {
		expect(
			new NumericRule(
				{
					percentError: 0.2,
					types: 'decimal,fractional',
					sigFigs: '[1,3]',
					decimals: '[0,2]',
					isInteger: false,
					isFractionReduced: true,
					isValidScientific: true,
					score: 100,
					round: 'decimals',
					unitsMatch: 'ignore-unit',
					additionalUnits: 'g',
					unitsAreCaseSensitive: false,
					scientificTypes: 'e',
					value: '6.78 grams'
				},
				['decimal', 'fractional']
			)
		).toMatchSnapshot()
	})

	test('constructor throws error if invalid config properties given', () => {
		expect(() => {
			new NumericRule({
				invalidPropertyA: 'abc',
				invalidPropertyB: '123'
			})
		}).toThrow('Invalid properties: invalidPropertyA,invalidPropertyB')
	})
})
