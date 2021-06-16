/* eslint-disable new-cap */

import NumericRuleOutcome from '../../rule/numeric-rule-outcome'
import NumericRule from '../../rule/numeric-rule'

import NumericEntry from '../../entry/numeric-entry'
import BigValueRange from '../../range/big-value-range'

describe('NumericRuleOutcome', () => {
	test('getPercentErrorRange returns a range of possible answer values', () => {
		const r1 = new NumericRule({ value: '2', percentError: 1 })
		expect(NumericRuleOutcome.getPercentErrorRange(r1).toString()).toEqual('[1.98,2.02]')

		const r2 = new NumericRule({ value: '[2,3]', percentError: 2 })
		expect(NumericRuleOutcome.getPercentErrorRange(r2).toString()).toEqual('[1.96,3.04]')

		const r3 = new NumericRule({ value: '(*,3]', percentError: 3 })
		expect(NumericRuleOutcome.getPercentErrorRange(r3).toString()).toEqual('(*,3.09]')

		const r4 = new NumericRule({ value: '[2,*)', percentError: 4 })
		expect(NumericRuleOutcome.getPercentErrorRange(r4).toString()).toEqual('[1.92,*)')

		const r5 = new NumericRule({ value: '(*,*)', percentError: 5 })
		expect(NumericRuleOutcome.getPercentErrorRange(r5).toString()).toEqual('(*,*)')
	})

	test('getAbsoluteErrorRange returns a range of possible answer values', () => {
		const r3 = new NumericRule({ value: '2', absoluteError: 0.5 })
		expect(NumericRuleOutcome.getAbsoluteErrorRange(r3).toString()).toEqual('[1.5,2.5]')

		const r4 = new NumericRule({ value: '[2,3]', absoluteError: 0.5 })
		expect(NumericRuleOutcome.getAbsoluteErrorRange(r4).toString()).toEqual('[1.5,3.5]')
	})

	test('extendBigValueRange extends a range', () => {
		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('[-1,1]'), 1)).toEqual(
			new BigValueRange('[-2,2]')
		)

		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('[1,2]'), 2)).toEqual(
			new BigValueRange('[-1,4]')
		)

		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('[-1,1]'), 3)).toEqual(
			new BigValueRange('[-4,4]')
		)

		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('(*,1]'), 1)).toEqual(
			new BigValueRange('(*,2]')
		)

		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('[-1,*)'), 2.2)).toEqual(
			new BigValueRange('[-3.2,*)')
		)

		expect(NumericRuleOutcome.extendBigValueRange(new BigValueRange('(*,*)'), 1)).toEqual(
			new BigValueRange('(*,*)')
		)
	})

	test('getScoreOutcome returns expected details', () => {
		expect(
			NumericRuleOutcome.getScoreOutcome(new NumericEntry('1'), new NumericRule({ value: '1' }))
		).toEqual({
			errorType: 'noError',
			isExactlyCorrect: true,
			isWithinError: true
		})

		expect(
			NumericRuleOutcome.getScoreOutcome(new NumericEntry('1.01'), new NumericRule({ value: '1' }))
		).toEqual({
			errorType: 'noError',
			isExactlyCorrect: false,
			isWithinError: false
		})

		expect(
			NumericRuleOutcome.getScoreOutcome(
				new NumericEntry('1'),
				new NumericRule({ value: '1', percentError: 1 })
			)
		).toEqual({
			errorType: 'percent',
			isExactlyCorrect: true,
			isWithinError: true
		})

		expect(
			NumericRuleOutcome.getScoreOutcome(
				new NumericEntry('1.01'),
				new NumericRule({ value: '1', percentError: 1 })
			)
		).toEqual({
			errorType: 'percent',
			isExactlyCorrect: false,
			isWithinError: true
		})

		expect(
			NumericRuleOutcome.getScoreOutcome(
				new NumericEntry('2'),
				new NumericRule({ value: '1', percentError: 1 })
			)
		).toEqual({
			errorType: 'percent',
			isExactlyCorrect: false,
			isWithinError: false
		})

		expect(
			NumericRuleOutcome.getScoreOutcome(
				new NumericEntry('1'),
				new NumericRule({ value: '1', absoluteError: 1 })
			)
		).toEqual({
			errorType: 'absolute',
			isExactlyCorrect: true,
			isWithinError: true
		})

		expect(
			NumericRuleOutcome.getScoreOutcome(
				new NumericEntry('1.01'),
				new NumericRule({ value: '1', absoluteError: 1 })
			)
		).toEqual({
			errorType: 'absolute',
			isExactlyCorrect: false,
			isWithinError: true
		})

		expect(
			NumericRuleOutcome.getScoreOutcome(
				new NumericEntry('2.01'),
				new NumericRule({ value: '1', absoluteError: 1 })
			)
		).toEqual({
			errorType: 'absolute',
			isExactlyCorrect: false,
			isWithinError: false
		})
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

	test.each`
		ruleType        | isValueInRange | result
		${'decimal'}    | ${true}        | ${true}
		${'scientific'} | ${true}        | ${true}
		${'hex'}        | ${true}        | ${true}
		${'octal'}      | ${true}        | ${true}
		${'binary'}     | ${true}        | ${true}
		${'fractional'} | ${true}        | ${true}
		${'decimal'}    | ${false}       | ${false}
		${'scientific'} | ${false}       | ${false}
		${'hex'}        | ${false}       | ${false}
		${'octal'}      | ${false}       | ${false}
		${'binary'}     | ${false}       | ${false}
		${'fractional'} | ${false}       | ${true}
	`(
		`getIsExpectedNumSigFigs ruleType=$ruleType, isValueInRange=$isValueInRange = $result`,
		({ ruleType, isValueInRange, result }) => {
			expect(
				NumericRuleOutcome.getIsExpectedNumSigFigs(
					{
						type: ruleType
					},
					{
						sigFigs: {
							isValueInRange: () => isValueInRange
						}
					}
				)
			).toBe(result)
		}
	)

	test('constructor sets properties as expected', () => {
		const o = new NumericRuleOutcome(new NumericEntry('42'), new NumericRule({ value: '42' }))

		expect(o).toMatchSnapshot()
	})
})
