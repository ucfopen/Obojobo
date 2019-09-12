import NumericRuleOutcome from '../../rule/numeric-rule-outcome'
import NumericRule from '../../rule/numeric-rule'

import Big from 'big.js'
import NumericEntryRange from '../../range/numeric-entry-range'
import NumericEntry from '../../entry/numeric-entry'
import BigValueRange from '../../range/big-value-range'

describe('NumericRuleOutcome', () => {
	test('getPercentErrorRange returns a range of possible answer values', () => {
		const r1 = new NumericRule({ value: '2', percentError: 1 })
		expect(NumericRuleOutcome.getPercentErrorRange(r1).toString()).toEqual('[1,3]')

		const r2 = new NumericRule({ value: '[2,3]', percentError: 1 })
		expect(NumericRuleOutcome.getPercentErrorRange(r2).toString()).toEqual('[1,4.5]')

		const r3 = new NumericRule({ value: '(*,3]', percentError: 1 })
		expect(NumericRuleOutcome.getPercentErrorRange(r3).toString()).toEqual('(*,4.5]')

		const r4 = new NumericRule({ value: '[2,*)', percentError: 1 })
		expect(NumericRuleOutcome.getPercentErrorRange(r4).toString()).toEqual('[1,*)')
	})

	test('getAbsoluteErrorRange returns a range of possible answer values', () => {
		const r3 = new NumericRule({ value: '2', absoluteError: 0.5 })
		expect(NumericRuleOutcome.getAbsoluteErrorRange(r3).toString()).toEqual('[1.5,2.5]')

		const r4 = new NumericRule({ value: '[2,3]', absoluteError: 0.5 })
		expect(NumericRuleOutcome.getAbsoluteErrorRange(r4).toString()).toEqual('[1.5,3.5]')
	})

	test('extendBigValueRange extends a range', () => {
		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('[-1,1]'), 1, 2)).toEqual(
			new BigValueRange('[-2,3]')
		)

		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('[-1,1]'), 1, null)).toEqual(
			new BigValueRange('[-2,1]')
		)

		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('[-1,1]'), null, 2)).toEqual(
			new BigValueRange('[-1,3]')
		)

		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('(*,1]'), 1, 2)).toEqual(
			new BigValueRange('(*,3]')
		)

		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('[-1,*)'), 1, 2)).toEqual(
			new BigValueRange('[-2,*)')
		)

		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('(*,*)'), 1, 2)).toEqual(
			new BigValueRange('(*,*)')
		)
	})

	test('getIsWithinError works for percent errors', () => {
		const rule = new NumericRule({ value: '2', percentError: 1 })

		const mockIsValueInNoErrorRange = jest.fn().mockReturnValue('mock-result-no-error')
		rule.value = {
			toBigValueRange: () => ({
				isValueInRange: mockIsValueInNoErrorRange
			})
		}

		const mockIsValueInPercRange = jest.fn().mockReturnValue('mock-result-percent')
		const mockIsValueInAbsRange = jest.fn().mockReturnValue('mock-result-absolute')
		const getPercentErrorRangeSpy = jest
			.spyOn(NumericRuleOutcome, 'getPercentErrorRange')
			.mockReturnValue({
				isValueInRange: mockIsValueInPercRange
			})
		const getAbsErrorRangeSpy = jest
			.spyOn(NumericRuleOutcome, 'getAbsoluteErrorRange')
			.mockReturnValue({
				isValueInRange: mockIsValueInAbsRange
			})

		const roundedEntry = new NumericEntry('0')
		const result = NumericRuleOutcome.getIsWithinError(rule, roundedEntry)
		expect(result).toBe('mock-result-percent')
		expect(getPercentErrorRangeSpy).toHaveBeenCalledWith(rule)
		expect(getAbsErrorRangeSpy).not.toHaveBeenCalled()
		expect(mockIsValueInPercRange).toHaveBeenCalledWith(roundedEntry)
		expect(mockIsValueInAbsRange).not.toHaveBeenCalled()
		expect(mockIsValueInNoErrorRange).not.toHaveBeenCalled()

		getPercentErrorRangeSpy.mockRestore()
		getAbsErrorRangeSpy.mockRestore()
	})

	test('getIsWithinError works for absolute errors', () => {
		const rule = new NumericRule({ value: '2', absoluteError: 1 })

		const mockIsValueInNoErrorRange = jest.fn().mockReturnValue('mock-result-no-error')
		rule.value = {
			toBigValueRange: () => ({
				isValueInRange: mockIsValueInNoErrorRange
			})
		}

		const mockIsValueInPercRange = jest.fn().mockReturnValue('mock-result-percent')
		const mockIsValueInAbsRange = jest.fn().mockReturnValue('mock-result-absolute')
		const getPercentErrorRangeSpy = jest
			.spyOn(NumericRuleOutcome, 'getPercentErrorRange')
			.mockReturnValue({
				isValueInRange: mockIsValueInPercRange
			})
		const getAbsErrorRangeSpy = jest
			.spyOn(NumericRuleOutcome, 'getAbsoluteErrorRange')
			.mockReturnValue({
				isValueInRange: mockIsValueInAbsRange
			})

		const roundedEntry = new NumericEntry('0')
		const result = NumericRuleOutcome.getIsWithinError(rule, roundedEntry)
		expect(result).toBe('mock-result-absolute')
		expect(getPercentErrorRangeSpy).not.toHaveBeenCalled()
		expect(getAbsErrorRangeSpy).toHaveBeenCalledWith(rule)
		expect(mockIsValueInPercRange).not.toHaveBeenCalled()
		expect(mockIsValueInAbsRange).toHaveBeenCalledWith(roundedEntry)
		expect(mockIsValueInNoErrorRange).not.toHaveBeenCalled()

		getPercentErrorRangeSpy.mockRestore()
		getAbsErrorRangeSpy.mockRestore()
	})

	test('getIsWithinError works for no specified error amount', () => {
		const rule = new NumericRule({ value: '2' })

		const mockIsValueInNoErrorRange = jest.fn().mockReturnValue('mock-result-no-error')
		rule.value = {
			toBigValueRange: () => ({
				isValueInRange: mockIsValueInNoErrorRange
			})
		}

		const mockIsValueInPercRange = jest.fn().mockReturnValue('mock-result-percent')
		const mockIsValueInAbsRange = jest.fn().mockReturnValue('mock-result-absolute')
		const getPercentErrorRangeSpy = jest
			.spyOn(NumericRuleOutcome, 'getPercentErrorRange')
			.mockReturnValue({
				isValueInRange: mockIsValueInPercRange
			})
		const getAbsErrorRangeSpy = jest
			.spyOn(NumericRuleOutcome, 'getAbsoluteErrorRange')
			.mockReturnValue({
				isValueInRange: mockIsValueInAbsRange
			})

		const roundedEntry = new NumericEntry('0')
		const result = NumericRuleOutcome.getIsWithinError(rule, roundedEntry)
		expect(result).toBe('mock-result-no-error')
		expect(getPercentErrorRangeSpy).not.toHaveBeenCalled()
		expect(getAbsErrorRangeSpy).not.toHaveBeenCalled()
		expect(mockIsValueInPercRange).not.toHaveBeenCalled()
		expect(mockIsValueInAbsRange).not.toHaveBeenCalled()
		expect(mockIsValueInNoErrorRange).toHaveBeenCalledWith(roundedEntry)

		getPercentErrorRangeSpy.mockRestore()
		getAbsErrorRangeSpy.mockRestore()
	})

	test('getScoreOutcome returns expected details', () => {
		const getRoundedEntrySpy = jest
			.spyOn(NumericRuleOutcome, 'getRoundedBigValueForRule')
			.mockReturnValue('mock-big-value')
		const getIsWithinErrorSpy = jest
			.spyOn(NumericRuleOutcome, 'getIsWithinError')
			.mockReturnValue('mock-is-within-error')

		const numericEntry = jest.fn()
		const rule = {
			errorType: 'mock-error-type'
		}

		expect(NumericRuleOutcome.getScoreOutcome(numericEntry, rule)).toEqual({
			roundedBigValue: 'mock-big-value',
			isWithinError: 'mock-is-within-error',
			errorType: 'mock-error-type'
		})

		getRoundedEntrySpy.mockRestore()
		getIsWithinErrorSpy.mockRestore()
	})

	test('getRoundedEntryForRule returns a duplicate entry if no rounding specified', () => {
		const n = new NumericEntry('2')
		const r = new NumericRule({})

		const rounded = NumericRuleOutcome.getRoundedBigValueForRule(n, r)

		expect(rounded).toEqual(n.numericInstance.bigValue)
		expect(rounded).not.toBe(n.numericInstance.bigValue)
	})

	test('getRoundedBigValueForRule returns a rounded entry based on the number of digits', () => {
		const n = new NumericEntry('0.8888')
		const r = new NumericRule({ round: 'decimals', value: '1' })
		r.value.min.numericInstance.constructor.getNumDecimalDigits = () => 1
		r.value.max.numericInstance.constructor.getNumDecimalDigits = () => 2

		expect(NumericRuleOutcome.getRoundedBigValueForRule(n, r)).toEqual(Big('0.89'))

		r.value.min.numericInstance.constructor.getNumDecimalDigits = () => 2
		r.value.max.numericInstance.constructor.getNumDecimalDigits = () => 3

		expect(NumericRuleOutcome.getRoundedBigValueForRule(n, r)).toEqual(Big('0.889'))

		r.value.min.numericInstance.constructor.getNumDecimalDigits = () => 1
		r.value.max.numericInstance.constructor.getNumDecimalDigits = () => 1

		expect(NumericRuleOutcome.getRoundedBigValueForRule(n, r)).toEqual(Big('0.9'))

		r.value.min.numericInstance.constructor.getNumDecimalDigits = () => 6
		r.value.max.numericInstance.constructor.getNumDecimalDigits = () => 6

		expect(NumericRuleOutcome.getRoundedBigValueForRule(n, r)).toEqual(Big('0.888800'))
	})

	test('getRoundedBigValueForRule returns a rounded entry based on the number of significant figures', () => {
		const n = new NumericEntry('0.8888')
		const r = new NumericRule({ round: 'sig-figs', value: '1' })
		r.value.min.numericInstance.constructor.getNumSigFigs = () => 1
		r.value.max.numericInstance.constructor.getNumSigFigs = () => 2

		expect(NumericRuleOutcome.getRoundedBigValueForRule(n, r)).toEqual(Big('0.89'))

		r.value.min.numericInstance.constructor.getNumSigFigs = () => 2
		r.value.max.numericInstance.constructor.getNumSigFigs = () => 3

		expect(NumericRuleOutcome.getRoundedBigValueForRule(n, r)).toEqual(Big('0.889'))

		r.value.min.numericInstance.constructor.getNumSigFigs = () => 1
		r.value.max.numericInstance.constructor.getNumSigFigs = () => 1

		expect(NumericRuleOutcome.getRoundedBigValueForRule(n, r)).toEqual(Big('0.9'))
	})

	test('getIsExpectedNumSigFigs returns true if no sig-fig rule attr exists', () => {
		expect(
			NumericRuleOutcome.getIsExpectedNumSigFigs(new NumericEntry('-84.19760'), new NumericRule({}))
		).toBe(true)
	})

	test('getIsExpectedNumSigFigs returns true if number of sig figs match', () => {
		const r = new NumericRule({ sigFigs: '2' })
		const mockIsValueInRange = jest.fn().mockReturnValue('mock-is-value-in-range')
		r.sigFigs.isValueInRange = mockIsValueInRange
		const n = new NumericEntry('0').numericInstance
		n.constructor.getNumSigFigs = jest.fn()

		expect(NumericRuleOutcome.getIsExpectedNumSigFigs(n, r)).toBe('mock-is-value-in-range')
		expect(mockIsValueInRange).toHaveBeenCalledWith(n.numSigFigs)
	})

	test('getIsOneOfAllowedTypes checks if the type matches the allowed types', () => {
		expect(
			NumericRuleOutcome.getIsOneOfAllowedTypes(
				{
					type: 'decimal'
				},
				new NumericRule({})
			)
		).toBe(true)

		expect(
			NumericRuleOutcome.getIsOneOfAllowedTypes(
				{
					type: 'fractional'
				},
				new NumericRule({ types: 'decimal,fractional' })
			)
		).toBe(true)

		expect(
			NumericRuleOutcome.getIsOneOfAllowedTypes(
				{
					type: 'some-unexpected-type'
				},
				new NumericRule({ types: 'decimal,fractional' })
			)
		).toBe(false)
	})

	test.each`
		ruleType        | rifr     | niifr    | result
		${'decimal'}    | ${true}  | ${true}  | ${true}
		${'decimal'}    | ${true}  | ${false} | ${true}
		${'decimal'}    | ${false} | ${true}  | ${true}
		${'decimal'}    | ${false} | ${false} | ${true}
		${'decimal'}    | ${null}  | ${true}  | ${true}
		${'decimal'}    | ${null}  | ${false} | ${true}
		${'scientific'} | ${true}  | ${true}  | ${true}
		${'scientific'} | ${true}  | ${false} | ${true}
		${'scientific'} | ${false} | ${true}  | ${true}
		${'scientific'} | ${false} | ${false} | ${true}
		${'scientific'} | ${null}  | ${true}  | ${true}
		${'scientific'} | ${null}  | ${false} | ${true}
		${'hex'}        | ${true}  | ${true}  | ${true}
		${'hex'}        | ${true}  | ${false} | ${true}
		${'hex'}        | ${false} | ${true}  | ${true}
		${'hex'}        | ${false} | ${false} | ${true}
		${'hex'}        | ${null}  | ${true}  | ${true}
		${'hex'}        | ${null}  | ${false} | ${true}
		${'octal'}      | ${true}  | ${true}  | ${true}
		${'octal'}      | ${true}  | ${false} | ${true}
		${'octal'}      | ${false} | ${true}  | ${true}
		${'octal'}      | ${false} | ${false} | ${true}
		${'octal'}      | ${null}  | ${true}  | ${true}
		${'octal'}      | ${null}  | ${false} | ${true}
		${'binary'}     | ${true}  | ${true}  | ${true}
		${'binary'}     | ${true}  | ${false} | ${true}
		${'binary'}     | ${false} | ${true}  | ${true}
		${'binary'}     | ${false} | ${false} | ${true}
		${'binary'}     | ${null}  | ${true}  | ${true}
		${'binary'}     | ${null}  | ${false} | ${true}
		${'fractional'} | ${true}  | ${true}  | ${true}
		${'fractional'} | ${true}  | ${false} | ${false}
		${'fractional'} | ${false} | ${true}  | ${false}
		${'fractional'} | ${false} | ${false} | ${true}
		${'fractional'} | ${null}  | ${true}  | ${true}
		${'fractional'} | ${null}  | ${false} | ${true}
	`(
		`getIsExpectedFractionReduced rule.type=$ruleType, rule.isFractionReduced=$rifr, numericInstance.isFractionReduced=$niifr)=$result`,
		({ ruleType, rifr, niifr, result }) => {
			expect(
				NumericRuleOutcome.getIsExpectedFractionReduced(
					{
						isFractionReduced: niifr
					},
					{
						type: ruleType,
						isFractionReduced: rifr
					}
				)
			).toBe(result)
		}
	)

	test.each`
		ruleIsInteger | numericInstIsInteger | result
		${true}       | ${true}              | ${true}
		${false}      | ${true}              | ${false}
		${true}       | ${false}             | ${false}
		${null}       | ${true}              | ${true}
		${null}       | ${false}             | ${true}
	`(
		`getIsExpectedInteger rule.isInteger=$ruleIsInteger, numericInstance.isInteger=$numericInstIsInteger)=$result`,
		({ ruleIsInteger, numericInstIsInteger, result }) => {
			expect(
				NumericRuleOutcome.getIsExpectedInteger(
					{
						isInteger: numericInstIsInteger
					},
					{
						isInteger: ruleIsInteger
					}
				)
			).toBe(result)
		}
	)

	test('getIsExpectedUnits returns true if units are ignored', () => {
		expect(NumericRuleOutcome.getIsExpectedUnits({}, { unitsMatch: 'ignore-unit' })).toBe(true)
	})

	test('getIsExpectedUnits returns isWithUnit if any units are allowed', () => {
		expect(
			NumericRuleOutcome.getIsExpectedUnits({ isWithUnit: true }, { unitsMatch: 'any-unit' })
		).toBe(true)
		expect(
			NumericRuleOutcome.getIsExpectedUnits({ isWithUnit: false }, { unitsMatch: 'any-unit' })
		).toBe(false)
	})

	test('getIsExpectedUnits returns !isWithUnit if no units are allowed', () => {
		expect(
			NumericRuleOutcome.getIsExpectedUnits({ isWithUnit: true }, { unitsMatch: 'no-unit' })
		).toBe(false)
		expect(
			NumericRuleOutcome.getIsExpectedUnits({ isWithUnit: false }, { unitsMatch: 'no-unit' })
		).toBe(true)
	})

	test.each`
		unit   | allUnits      | unitsAreCaseSensitive | result
		${'a'} | ${['a', 'b']} | ${false}              | ${true}
		${'A'} | ${['a', 'b']} | ${false}              | ${true}
		${'b'} | ${['a', 'b']} | ${false}              | ${true}
		${'B'} | ${['a', 'b']} | ${false}              | ${true}
		${'c'} | ${['a', 'b']} | ${false}              | ${false}
		${'C'} | ${['a', 'b']} | ${false}              | ${false}
		${'a'} | ${['a', 'b']} | ${true}               | ${true}
		${'A'} | ${['a', 'b']} | ${true}               | ${false}
		${'b'} | ${['a', 'b']} | ${true}               | ${true}
		${'B'} | ${['a', 'b']} | ${true}               | ${false}
		${'c'} | ${['a', 'b']} | ${true}               | ${false}
		${'C'} | ${['a', 'b']} | ${true}               | ${false}
	`(
		`getIsExpectedUnits unit=$unit, allUnits=$allUnits, caseSensitive=$unitsAreCaseSensitive = $result`,
		({ unit, allUnits, unitsAreCaseSensitive, result }) => {
			expect(
				NumericRuleOutcome.getIsExpectedUnits(
					{
						unit
					},
					{
						unitsMatch: 'matches-unit',
						allUnits,
						unitsAreCaseSensitive
					}
				)
			).toBe(result)
		}
	)

	test.each`
		ruleType        | rivs     | niivs    | result
		${'decimal'}    | ${true}  | ${true}  | ${true}
		${'decimal'}    | ${true}  | ${false} | ${true}
		${'decimal'}    | ${false} | ${true}  | ${true}
		${'decimal'}    | ${false} | ${false} | ${true}
		${'decimal'}    | ${null}  | ${true}  | ${true}
		${'decimal'}    | ${null}  | ${false} | ${true}
		${'scientific'} | ${true}  | ${true}  | ${true}
		${'scientific'} | ${true}  | ${false} | ${false}
		${'scientific'} | ${false} | ${true}  | ${false}
		${'scientific'} | ${false} | ${false} | ${true}
		${'scientific'} | ${null}  | ${true}  | ${true}
		${'scientific'} | ${null}  | ${false} | ${true}
		${'hex'}        | ${true}  | ${true}  | ${true}
		${'hex'}        | ${true}  | ${false} | ${true}
		${'hex'}        | ${false} | ${true}  | ${true}
		${'hex'}        | ${false} | ${false} | ${true}
		${'hex'}        | ${null}  | ${true}  | ${true}
		${'hex'}        | ${null}  | ${false} | ${true}
		${'octal'}      | ${true}  | ${true}  | ${true}
		${'octal'}      | ${true}  | ${false} | ${true}
		${'octal'}      | ${false} | ${true}  | ${true}
		${'octal'}      | ${false} | ${false} | ${true}
		${'octal'}      | ${null}  | ${true}  | ${true}
		${'octal'}      | ${null}  | ${false} | ${true}
		${'binary'}     | ${true}  | ${true}  | ${true}
		${'binary'}     | ${true}  | ${false} | ${true}
		${'binary'}     | ${false} | ${true}  | ${true}
		${'binary'}     | ${false} | ${false} | ${true}
		${'binary'}     | ${null}  | ${true}  | ${true}
		${'binary'}     | ${null}  | ${false} | ${true}
		${'fractional'} | ${true}  | ${true}  | ${true}
		${'fractional'} | ${true}  | ${false} | ${true}
		${'fractional'} | ${false} | ${true}  | ${true}
		${'fractional'} | ${false} | ${false} | ${true}
		${'fractional'} | ${null}  | ${true}  | ${true}
		${'fractional'} | ${null}  | ${false} | ${true}
	`(
		`getIsExpectedScientific rule.type=$ruleType, rule.isValidScientific=$rivs, numInst.isValidScientific=$niivs = $result`,
		({ ruleType, rivs, niivs, result }) => {
			expect(
				NumericRuleOutcome.getIsExpectedScientific(
					{
						isValidScientific: niivs
					},
					{
						isValidScientific: rivs,
						type: ruleType
					}
				)
			).toBe(result)
		}
	)

	test('constructor sets properties as expected', () => {
		const o = new NumericRuleOutcome(new NumericEntry('42'), new NumericRule({ value: '42' }))

		expect(o.isMatched).toBe(true)
		expect(o).toMatchSnapshot()
	})
})
