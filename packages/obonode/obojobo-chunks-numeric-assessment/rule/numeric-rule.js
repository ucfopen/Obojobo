const Big = require('../big')
const NumericEntryRange = require('../range/numeric-entry-range')
const BigValueRange = require('../range/big-value-range')
const ValueRange = require('../range/value-range')
const {
	ROUND_TYPE_NONE,
	ROUND_TYPE_ROUND_DECIMAL_DIGITS,
	ROUND_TYPE_ROUND_SIG_FIGS
} = require('./round-types')
const {
	INPUT_TYPE_SCIENTIFIC,
	INPUT_TYPE_DECIMAL,
	INPUT_TYPE_FRACTIONAL,
	INPUT_TYPE_BINARY,
	INPUT_TYPE_OCTAL,
	INPUT_TYPE_HEXADECIMAL,
	allTypes
} = require('../numerics/types/input-types')
const {
	SCIENTIFIC_TYPE_X,
	SCIENTIFIC_TYPE_E,
	SCIENTIFIC_TYPE_EE,
	SCIENTIFIC_TYPE_APOS,
	SCIENTIFIC_TYPE_ASTERISK
} = require('../numerics/types/scientific-types')
const { PERCENT_ERROR, ABSOLUTE_ERROR, NO_ERROR } = require('./rule-error-types')

const SCHEMA = [
	'percentError',
	'absoluteError',
	'types',
	'sigFigs',
	'decimals',
	'isInteger',
	'isFractionReduced',
	'isValidScientific',
	'score',
	'round',
	'scientificTypes',
	'feedback',
	'value'
]

const ZERO = Big(0)

/**
 * A rule config object used to create a NumericRule instance. Rules compare a student answer to the rules properties and "match" if the student answer agrees with all of the properties.
 * @typedef {Object} RuleConfigObject
 * @property {number} [percentError=0] The allowed amount of percent error calculated from a student's answer and the config value.
 * @property {number} [absoluteError=0] The allowed amount of absolute error calculated from a student's answer and the config value.
 * @property {string} [types=(All types)] A comma separated list of types (i.e. `'decimal,fractional'`). A student's answer must be one of these types to match. If omitted then any valid value is matched.
 * @property {ValueRangeString} [sigFigs=(*,*) (Any)] A range of significant figures. A student's answer must contain these amount of significant figures to match. If omitted then any valid value is matched.
 * @property {ValueRangeString} [decimals=(*,*) (Any)] A range of the number of decimal digits. A student's answer must have these amount of digits to match. If omitted then any valid value is matched.
 * @property {boolean} [isInteger=null] If true this rule matches if and only if a student's answer is an integer. If false a student's answer must not be an integer. If omitted then a student's answer can be either.
 * @property {boolean} [isFractionReduced=null] If true then this rule matches if and only if a given fractional value is in it's most reduced form. If false then a given fractional value must not be reduced. If omitted then fractional values can be either. If the student's answer is not fractional then this rule is ignored and always matches.
 * @property {boolean} [isValidScientific=null] If true then this rule matches if and only if a given scientific value has a digit term less than 10 (i.e. `6.02e23` is "valid" while `60.2e22` is not). If false than a given scientific value must not be valid. If omitted then scientific values can be either. IF the student's answer is not scientific then this rule is ignored and always matches.
 * @property {number} [score=0] This is the score to award the student if this rule matches. `score` **MUST** be included for rules in the score rule set. In the validation rule set `score` is ignored.
 * @property {string} [round=none] Determines how to round a student's answer compared to the `value`. This is useful in cases where a student value may be more precise (i.e. if `value` is `3.14` and a student answer is `3.141` round can allow the student answer to still match). Possible values are `none`, `sig-figs` or `decimals`. `none` performs no rounding. `sig-figs` rounds a given student answer to the number of significant figures of `value`. `decimals` rounds to the number of decimal digits of `value`.
 * @property {string} [scientificTypes=(Any)] A comma separated list of scientific types. This rule matches if a given scientific student answer contains one of the syntaxes specified (i.e. `'e,ee'`). If omitted then any valid scientific student answer matches. Non-scientific answers always match.
 * @property {NumericEntryRangeString} [value] The value or range of values to compare against a student's answer. This rule matches if the rounded student answer falls within `value` (or, if outside `value`, is within the accepted amount of absolute or percent error if such error tolerances are specified).
 */

/**
 * Represents different possible options which may or may not match a given NumericEntry.
 * NumericRules are used in rule sets which are used in validating or scoring a student's
 * answer. NumericRules are created by passing in a RuleConfigObject which is parsed
 * and then expanded to a complete NumericRule instance.
 * @example
 * // Create a rule looking for a response of "4" to "5"
 * const rule = new NumericRule({ value:'[4,5]' })
 * rule.value //Equivalent to new NumericEntryRange('[4,5]')
 */
module.exports = class NumericRule {
	/**
	 * Return the error type as a rule can only specify one.
	 * @param {RuleConfigObject} config
	 * @return {'noError'|'absoluteError'|'percentError'}
	 * @throws Error if both percentError and absoluteError are defined on config.
	 */
	static getRuleErrorType(config) {
		if (config.percentError && config.absoluteError) throw "Can't have both errors!"
		if (!config.percentError && !config.absoluteError) return NO_ERROR
		return config.absoluteError ? ABSOLUTE_ERROR : PERCENT_ERROR
	}

	/**
	 * Returns the amount of error
	 * @param {RuleConfigObject} config
	 * @param {NumericEntryRange} value
	 * @return {Big|number}
	 */
	static getRuleErrorValue(config, value) {
		switch (NumericRule.getRuleErrorType(config)) {
			case PERCENT_ERROR:
				return NumericRule.getRulePercentError(config, value)

			case ABSOLUTE_ERROR:
				return NumericRule.getRuleAbsoluteError(config)

			case NO_ERROR:
				return Big(0)
		}
	}

	/**
	 * Returns `config.percentError` as a number
	 * @param {RuleConfigObject} config
	 * @param {NumericEntryRange} value
	 * @return {number}
	 * @throw Error if value is "0" (Percent error not defined for 0)
	 */
	static getRulePercentError(config, value) {
		if (typeof config.percentError === 'undefined' || !config.percentError) return 0

		const percentError = parseFloat(config.percentError)
		if (!Number.isFinite(percentError) || percentError < 0) throw 'Bad percentError error'

		const bigValueRange = value.toBigValueRange()
		const minIsZero = bigValueRange.minEq(ZERO)
		const maxIsZero = bigValueRange.maxEq(ZERO)

		if ((minIsZero || maxIsZero) && percentError !== 0) {
			throw 'percentError not allowed when value is zero'
		}

		return percentError
	}

	/**
	 * Returns `config.absoluteError` as a Big instance
	 * @param {RuleConfigObject} config
	 * @return {Big}
	 */
	static getRuleAbsoluteError(config) {
		return config.absoluteError ? Big(config.absoluteError).abs() : Big(0)
	}

	/**
	 * @param {string[]} types
	 * @return {boolean} True if the given array of types only contain valid numeric types
	 */
	static isTypesValid(types) {
		return (
			types.filter(t => {
				switch (t) {
					case INPUT_TYPE_SCIENTIFIC:
					case INPUT_TYPE_DECIMAL:
					case INPUT_TYPE_FRACTIONAL:
					case INPUT_TYPE_HEXADECIMAL:
					case INPUT_TYPE_OCTAL:
					case INPUT_TYPE_BINARY:
						return true
				}

				return false
			}).length === types.length
		)
	}

	/**
	 * Returns `config.types` as an array
	 * @param {RuleConfigObject} config
	 * @return {string[]}
	 * @throw Error if an invalid type is given
	 */
	static getAllowedRuleTypes(config) {
		let types = []

		if (config.types) {
			types = config.types.split(',')
		}

		if (!NumericRule.isTypesValid(types)) {
			throw 'Invalid type given'
		}

		if (types.length === 0) {
			return [].concat(allTypes)
		}

		return [...new Set(types)]
	}

	/**
	 * Returns `config.sigFigs` as a BigValueRange
	 * @param {RuleConfigObject} config
	 * @return {BigValueRange}
	 * @throws Error if the range contains values <= 0
	 * @throws Error if fractional values are allowed
	 */
	static getRuleSigFigs(config) {
		if (!config.sigFigs) return new BigValueRange()

		const range = new BigValueRange(config.sigFigs)
		if (range.getValuePosition(Big(0)) !== ValueRange.VALUE_BELOW_MIN) {
			throw 'sigFigs range must be larger than 0'
		}

		if (config.types.split(',').includes(INPUT_TYPE_FRACTIONAL)) {
			throw 'sigFigs cannot be defined if fractional values are allowed'
		}

		return range
	}

	/**
	 * Returns `config.decimals` as a BigValueRange
	 * @param {RuleConfigObject} config
	 * @return {BigValueRange}
	 */
	static getRuleDecimalDigits(config) {
		if (!config.decimals) return new BigValueRange()

		const range = new BigValueRange(config.decimals)
		const pos = range.getMinValuePosition(Big(0))
		if (pos !== ValueRange.VALUE_BELOW && pos !== ValueRange.VALUE_EQUAL) {
			throw 'decimals range must be 0 or larger'
		}

		return range
	}

	/**
	 * Returns `config.isInteger`
	 * @param {RuleConfigObject} config
	 * @return {boolean|null}
	 */
	static getIsInteger(config) {
		if (config.isInteger === true || config.isInteger === false) return config.isInteger
		return null
	}

	/**
	 * Returns `config.isFractionReduced`
	 * @param {RuleConfigObject} config
	 * @return {boolean|null}
	 */
	static getRuleIsFractionReduced(config) {
		if (config.isFractionReduced === true || config.isFractionReduced === false) {
			return config.isFractionReduced
		}

		return null
	}

	/**
	 * Returns `config.isValidScientific`
	 * @param {RuleConfigObject} config
	 * @return {boolean|null}
	 */
	static getRuleIsValidScientific(config) {
		if (config.isValidScientific === true || config.isValidScientific === false) {
			return config.isValidScientific
		}

		return null
	}

	/**
	 * Returns `config.score`
	 * @param {RuleConfigObject} config
	 * @return {number}
	 * @throws Error if a non 0-100 value is given
	 */
	static getRuleScore(config) {
		if (typeof config.score === 'undefined' || config.score === null) return 0
		const score = parseFloat(config.score)
		if (!Number.isFinite(score) || score < 0 || score > 100) throw 'Score must be 0-100'
		return score
	}

	/**
	 * Validates and returns `config.round`
	 * @param {RuleConfigObject} config
	 * @return {'none'|'decimals'|'sigFigs'}
	 * @throws Error if an invalid round type is specified
	 */
	static getRuleRound(config) {
		if (!config.round) return ROUND_TYPE_NONE

		const round = config.round

		if (
			round !== ROUND_TYPE_NONE &&
			round !== ROUND_TYPE_ROUND_DECIMAL_DIGITS &&
			round !== ROUND_TYPE_ROUND_SIG_FIGS
		) {
			throw 'Invalid round value'
		}

		return round
	}

	/**
	 * Validates and returns `config.scientificTypes`
	 * @param {RuleConfigObject} config
	 * @return {'x'|'e'|'ee'|'apos'|'asterisk'}
	 * @throws Error if an invalid type is given
	 */
	static getRuleScientificTypes(config) {
		if (!config.scientificTypes) {
			return [
				SCIENTIFIC_TYPE_APOS,
				SCIENTIFIC_TYPE_ASTERISK,
				SCIENTIFIC_TYPE_E,
				SCIENTIFIC_TYPE_EE,
				SCIENTIFIC_TYPE_X
			]
		}

		const types = config.scientificTypes.split(',')

		if (
			types.filter(t => {
				switch (t) {
					case SCIENTIFIC_TYPE_APOS:
					case SCIENTIFIC_TYPE_ASTERISK:
					case SCIENTIFIC_TYPE_E:
					case SCIENTIFIC_TYPE_EE:
					case SCIENTIFIC_TYPE_X:
						return false
				}

				return true
			}).length > 0
		) {
			throw 'Invalid scientific type given'
		}

		return [...new Set(types)]
	}

	static getFeedback(config) {
		return config.feedback || null
	}

	/**
	 * Returns `config.value` as a NumericEntryRange
	 * @param {RuleConfigObject} config
	 * @param {string[]} types
	 * @return {NumericEntryRange}
	 */
	static getRuleValue(config, types) {
		if (typeof config.value === 'undefined' || config.value === null || config.value === false) {
			return new NumericEntryRange('(*,*)')
		}

		const range = new NumericEntryRange('' + config.value, types)

		if (range.isEmpty) throw 'Invalid range given for value'

		return range
	}

	/**
	 * Returns any non-expected properties on a given RuleConfigObject
	 * @param {RuleConfigObject} config
	 * @return {string[]}
	 */
	static getNonStandardProperties(config) {
		return Object.keys(config).filter(a => SCHEMA.indexOf(a) === -1)
	}

	/**
	 * Create a new NumericRule instance
	 * @param {RuleConfigObject} config
	 * @param {string[]} types
	 */
	constructor(config, types) {
		const nonStandardProps = NumericRule.getNonStandardProperties(config)
		if (nonStandardProps.length > 0) throw 'Invalid properties: ' + nonStandardProps.join(',')

		/**
		 * @type {NumericEntryRange}
		 */
		this.value = NumericRule.getRuleValue(config, types)

		/**
		 * @type {string}
		 */
		this.errorType = NumericRule.getRuleErrorType(config)

		/**
		 * @type {Big|number}
		 */
		this.errorValue = NumericRule.getRuleErrorValue(config, this.value)

		/**
		 * @type {BigValueRange}
		 */
		this.sigFigs = NumericRule.getRuleSigFigs(config)

		/**
		 * @type {BigValueRange}
		 */
		this.decimals = NumericRule.getRuleDecimalDigits(config)

		/**
		 * @type {boolean|null}
		 */
		this.isInteger = NumericRule.getIsInteger(config)

		/**
		 * @type {boolean|null}
		 */
		this.isFractionReduced = NumericRule.getRuleIsFractionReduced(config)

		/**
		 * @type {boolean|null}
		 */
		this.isValidScientific = NumericRule.getRuleIsValidScientific(config)

		/**
		 * @type {BigValueRange}
		 */
		this.score = NumericRule.getRuleScore(config)

		/**
		 * @type {string}
		 */
		this.round = NumericRule.getRuleRound(config)

		// this.explicitTypes = NumericRule.getExplicitRuleTypes(config, this.value)

		/**
		 * @type {string[]}
		 */
		this.allowedTypes = NumericRule.getAllowedRuleTypes(config)

		/**
		 * @type {string[]}
		 */
		this.scientificTypes = NumericRule.getRuleScientificTypes(config)

		/**
		 * @type {object}
		 */
		this.feedback = NumericRule.getFeedback(config)
	}
}
