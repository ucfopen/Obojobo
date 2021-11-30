import NumericAnswerEvaluator from '../../evaluation/numeric-answer-evaluator'
import NumericRule from '../../rule/numeric-rule'
import NumericRuleSetEvaluator from '../../evaluation/numeric-rule-set-evaluator'
import NumericEntry from '../../entry/numeric-entry'
import NumericAnswerResults from '../../evaluation/numeric-answer-results'

jest.mock('../../rule/numeric-rule', () => {
	class NumericRule {
		static isTypesValid() {
			return true
		}

		constructor(config, types) {
			this.config = config
			this.types = types
		}
	}

	return NumericRule
})
jest.mock('../../evaluation/numeric-answer-results')
jest.mock('../../evaluation/numeric-rule-set-evaluator')
jest.mock('../../entry/numeric-entry', () => {
	class NumericEntry {
		static getStatus() {
			return 'mockStatus'
		}

		constructor(inputString, types) {
			this.inputString = inputString
			this.types = types
			this.status = NumericEntry.getStatus()
		}
	}

	return NumericEntry
})

describe('NumericAnswerEvaluator', () => {
	let evaluator

	beforeEach(() => {
		evaluator = new NumericAnswerEvaluator({
			scoreRuleConfigs: [{ a: 1 }, { b: 2 }],
			validationRuleConfigs: [{ c: 3 }],
			types: 'mockTypes'
		})
	})

	test('getTypes converts a string of types to an array', () => {
		expect(NumericAnswerEvaluator.getTypes()).toBe(null)
		expect(NumericAnswerEvaluator.getTypes('  alpha  , beta   ')).toEqual(['alpha', 'beta'])

		const spy = jest.spyOn(NumericRule, 'isTypesValid').mockReturnValueOnce(false)

		expect(() => NumericAnswerEvaluator.getTypes('mockType')).toThrow()

		spy.mockRestore()
	})

	test('getRules creates an array of NumericRules from objects', () => {
		expect(NumericAnswerEvaluator.getRules([{ a: 1 }, { b: 2 }])).toEqual([
			new NumericRule({ a: 1 }),
			new NumericRule({ b: 2 })
		])

		expect(NumericAnswerEvaluator.getRules([{ a: 1 }, { b: 2 }], 'mockTypes')).toEqual([
			new NumericRule({ a: 1 }, 'mockTypes'),
			new NumericRule({ b: 2 }, 'mockTypes')
		])
	})

	test('constructor calls init', () => {
		const spy = jest.spyOn(NumericAnswerEvaluator.prototype, 'init').mockImplementation(jest.fn())

		const evaluator = new NumericAnswerEvaluator({
			scoreRuleConfigs: 1,
			validationRuleConfigs: 2,
			types: 3
		})

		expect(evaluator.init).toHaveBeenCalledWith({
			scoreRuleConfigs: 1,
			validationRuleConfigs: 2,
			types: 3
		})

		spy.mockRestore()
	})

	test('constructor has defaults', () => {
		const spy = jest.spyOn(NumericAnswerEvaluator.prototype, 'init').mockImplementation(jest.fn())

		const evaluator = new NumericAnswerEvaluator({
			scoreRuleConfigs: 1
		})

		expect(evaluator.init).toHaveBeenCalledWith({
			scoreRuleConfigs: 1,
			validationRuleConfigs: [],
			types: ''
		})

		spy.mockRestore()
	})

	test('init sets properties on instance', () => {
		expect(evaluator.types).toEqual(['mocktypes'])
		expect(evaluator.validator).toBeInstanceOf(NumericRuleSetEvaluator)
		expect(evaluator.grader).toBeInstanceOf(NumericRuleSetEvaluator)
		expect(NumericRuleSetEvaluator).toHaveBeenCalledWith({
			rules: [
				{ config: { a: 1 }, types: ['mocktypes'] },
				{ config: { b: 2 }, types: ['mocktypes'] }
			],
			types: ['mocktypes']
		})
		expect(NumericRuleSetEvaluator).toHaveBeenCalledWith({
			rules: [{ config: { c: 3 }, types: ['mocktypes'] }],
			types: ['mocktypes']
		})
	})

	test('init works with default params', () => {
		const getTypesSpy = jest.spyOn(NumericAnswerEvaluator, 'getTypes').mockImplementation(jest.fn())

		NumericAnswerEvaluator.prototype.init({ scoreRuleConfigs: [] })
		expect(getTypesSpy).toHaveBeenCalledWith('')

		getTypesSpy.mockRestore()
	})

	test('evaluate does not validate or score if student input is bad', () => {
		evaluator.validator = { evaluate: jest.fn() }
		evaluator.grader = { evaluate: jest.fn() }

		const entrySpy = jest.spyOn(NumericEntry, 'getStatus').mockReturnValue('badStatus')

		evaluator.evaluate('mock-input')

		expect(evaluator.validator.evaluate).not.toHaveBeenCalled()
		expect(evaluator.grader.evaluate).not.toHaveBeenCalled()

		entrySpy.mockRestore()
	})

	test('evaluate does not score if validation fails', () => {
		evaluator.validator = { evaluate: jest.fn().mockReturnValue({ status: 'ruleMatched' }) }
		evaluator.grader = { evaluate: jest.fn() }

		const entrySpy = jest.spyOn(NumericEntry, 'getStatus').mockReturnValue('ok')

		evaluator.evaluate('mock-input')

		expect(evaluator.validator.evaluate).toHaveBeenCalled()
		expect(evaluator.grader.evaluate).not.toHaveBeenCalled()

		entrySpy.mockRestore()
	})

	test('evaluate validates AND scores if validation succeeds', () => {
		const validationResult = { status: 'someOtherStatus' }
		const scoreResult = {}

		evaluator.validator = { evaluate: jest.fn().mockReturnValue(validationResult) }
		evaluator.grader = { evaluate: jest.fn().mockReturnValue(scoreResult) }

		const entrySpy = jest.spyOn(NumericEntry, 'getStatus').mockReturnValue('ok')
		const getResultsSpy = jest
			.spyOn(NumericAnswerResults, 'getResult')
			.mockImplementation((...args) => args)

		const [studentEntry] = evaluator.evaluate('mock-input')

		expect(evaluator.validator.evaluate).toHaveBeenCalled()
		expect(evaluator.grader.evaluate).toHaveBeenCalled()

		expect(NumericAnswerResults.getResult).toHaveBeenCalledWith(
			studentEntry,
			validationResult,
			scoreResult
		)

		entrySpy.mockRestore()
		getResultsSpy.mockRestore()
	})
})
