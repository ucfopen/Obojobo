import NumericRuleSetEvaluator from '../../evaluation/numeric-rule-set-evaluator'
import NumericRuleOutcome from '../../rule/numeric-rule-outcome'

jest.mock('../../rule/numeric-rule-outcome', () => {
	class MockNumericRuleOutcome {
		constructor(studentEntry, rules) {
			;(this.studentEntry = studentEntry), (this.rules = rules)
		}
	}

	return MockNumericRuleOutcome
})

describe('NumericRuleSetEvaluator', () => {
	test('getRuleOutcomes returns NumericRuleOutcome objects', () => {
		expect(NumericRuleSetEvaluator.getRuleOutcomes('mockStudentEntry', ['rule1', 'rule2'])).toEqual(
			[
				new NumericRuleOutcome('mockStudentEntry', 'rule1'),
				new NumericRuleOutcome('mockStudentEntry', 'rule2')
			]
		)
	})

	test('constructor sets default null values and calls init', () => {
		const initSpy = jest
			.spyOn(NumericRuleSetEvaluator.prototype, 'init')
			.mockImplementation(jest.fn())

		const inst = new NumericRuleSetEvaluator({ rules: 'mockRules', types: 'mockTypes' })

		expect(initSpy).toHaveBeenCalledWith({ rules: 'mockRules', types: 'mockTypes' })
		expect(inst.rules).toBe(null)
		expect(inst.types).toBe(null)

		initSpy.mockRestore()
	})

	test('init sets rules and types values', () => {
		const e = new NumericRuleSetEvaluator({ rules: 'mock-rules', types: 'mock-types' })

		expect(e.rules).toBe('mock-rules')
		expect(e.types).toBe('mock-types')

		e.init({ rules: 'mock-rules-2', types: 'mock-types-2' })

		expect(e.rules).toBe('mock-rules-2')
		expect(e.types).toBe('mock-types-2')
	})

	test('evaluate returns expected details object with no rules', () => {
		const e = new NumericRuleSetEvaluator({ rules: 'mock-rules', types: 'mock-types' })

		const getRuleOutcomesSpy = jest
			.spyOn(NumericRuleSetEvaluator, 'getRuleOutcomes')
			.mockReturnValue([])

		expect(e.evaluate('mockStudentEntry')).toEqual({
			status: 'noMatchingRules',
			details: {
				ruleOutcomes: [],
				score: 0
			}
		})

		getRuleOutcomesSpy.mockRestore()
	})

	test('evaluate returns expected details object with no matching rules', () => {
		const e = new NumericRuleSetEvaluator({ rules: 'mock-rules', types: 'mock-types' })

		const getRuleOutcomesSpy = jest
			.spyOn(NumericRuleSetEvaluator, 'getRuleOutcomes')
			.mockReturnValue([{ isMatched: false }])

		expect(e.evaluate('mockStudentEntry')).toEqual({
			status: 'noMatchingRules',
			details: {
				ruleOutcomes: [{ isMatched: false }],
				score: 0
			}
		})

		getRuleOutcomesSpy.mockRestore()
	})

	test('evaluate returns expected details object with matching rules', () => {
		const e = new NumericRuleSetEvaluator({ rules: 'mock-rules', types: 'mock-types' })

		const getRuleOutcomesSpy = jest
			.spyOn(NumericRuleSetEvaluator, 'getRuleOutcomes')
			.mockReturnValue([
				{ isMatched: false },
				{ isMatched: true, rule: { score: 100 } },
				{ isMatched: true, rule: { score: 99 } }
			])

		expect(e.evaluate('mockStudentEntry')).toEqual({
			status: 'ruleMatched',
			details: {
				ruleOutcomes: [
					{ isMatched: false },
					{ isMatched: true, rule: { score: 100 } },
					{ isMatched: true, rule: { score: 99 } }
				],
				matchingOutcomes: [
					{ isMatched: true, rule: { score: 100 } },
					{ isMatched: true, rule: { score: 99 } }
				],
				matchingOutcome: { isMatched: true, rule: { score: 100 } },
				score: 100
			}
		})

		getRuleOutcomesSpy.mockRestore()
	})
})
