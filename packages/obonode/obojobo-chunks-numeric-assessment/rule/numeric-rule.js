const Big = require('../big')
const NumericEntryRange = require('../range/numeric-entry-range')
const BigValueRange = require('../range/big-value-range')
const NumericEntry = require('../entry/numeric-entry')
const {
	ROUND_TYPE_NONE,
	ROUND_TYPE_ROUND_DIGITS,
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
const { ANY_UNIT, IGNORE_UNIT, NO_UNIT, MATCHES_UNIT } = require('./unit-types')

const SCHEMA = [
	'percentError',
	'absoluteError',
	'types',
	'sigFigs',
	'digits',
	'isInteger',
	'isFractionReduced',
	'isValidScientific',
	'score',
	'round',
	'unitsMatch',
	'additionalUnits',
	'unitsAreCaseSensitive',
	'scientificTypes',
	'feedback',
	'value'
]

const ZERO = new NumericEntry('0')

/**
 * A rule config object used to create a NumericRule instance. Rules compare a student answer to the rules properties and "match" if the student answer agrees with all of the properties.
 * @typedef {Object} RuleConfigObject
 * @property {number} [percentError=0] The allowed amount of percent error calculated from a student's answer and the config value.
 * @property {number} [absoluteError=0] The allowed amount of absolute error calculated from a student's answer and the config value.
 * @property {string} [types=(All types)] A comma separated list of types (i.e. `'decimal,fractional'`). A student's answer must be one of these types to match. If omitted then any valid value is matched.
 * @property {ValueRangeString} [sigFigs=[,] (Any)] A range of significant figures. A student's answer must contain these amount of significant figures to match. If omitted then any valid value is matched.
 * @property {ValueRangeString} [digits=[,] (Any)] A range of the number of digits. A student's answer must have these amount of digits to match. If omitted then any valid value is matched.
 * @property {boolean} [isInteger=null] If true this rule matches if and only if a student's answer is an integer. If false a student's answer must not be an integer. If omitted then a student's answer can be either.
 * @property {boolean} [isFractionReduced=null] If true then this rule matches if and only if a given fractional value is in it's most reduced form. If false then a given fractional value must not be reduced. If omitted then fractional values can be either. If the student's answer is not fractional then this rule is ignored and always matches.
 * @property {boolean} [isValidScientific=null] If true then this rule matches if and only if a given scientific value has a digit term less than 10 (i.e. `6.02e23` is "valid" while `60.2e22` is not). If false than a given scientific value must not be valid. If omitted then scientific values can be either. IF the student's answer is not scientific then this rule is ignored and always matches.
 * @property {number} [score=0] This is the score to award the student if this rule matches. `score` **MUST** be included for rules in the score rule set. In the validation rule set `score` is ignored.
 * @property {string} [round=none] Determines how to round a student's answer compared to the `value`. This is useful in cases where a student value may be more precise (i.e. if `value` is `3.14` and a student answer is `3.141` round can allow the student answer to still match). Possible values are `none`, `sig-figs` or `digits`. `none` performs no rounding. `sig-figs` rounds a given student answer to the number of significant figures of `value`. `digits` rounds to the number of digits of `value`.
 * @property {string} [unitsMatch=true] If true then a given student answer must match the units specified in `value` and optionally in `additionalUnits` (and should not have a unit if there are no units specified). If false then the given student answer must not match the specified units. If omitted then units are ignored and this rule always matches.
 * @property {string} [additionalUnits=''] A comma separated list of units that are allowed in addition to any units specified in `value`. For example, if `value` specifies `g` (for grams) it may be useful to allow `grams` as an alternate valid unit.
 * @property {boolean} [unitsAreCaseSensitive=false] If true then this rule matches only if their cases are the same (i.e. `g` and `g` match but `g` and `G` do not). If false then case is ignored.
 * @property {string} [scientificTypes=(Any)] A comma separated list of scientific types. This rule matches if a given scientific student answer contains one of the syntaxes specified (i.e. `'e,ee'`). If omitted then any valid scientific student answer matches. Non-scientific answers always match.
 * @property {NumericEntryRangeString} [value] The value or range of values to compare against a student's answer. This rule matches if the rounded student answer falls within `value` (or, if outside `value`, is within the accepted amount of absolute or percent error if such error tolerances are specified).
 */

/**
 * Represents different possible options which may or may not match a given NumericEntry.
 * NumericRules are used in rule sets which are used in validating or scoring a student's
 * answer. NumericRules are created by passing in a RuleConfigObject which is parsed
 * and then expanded to a complete NumericRule instance.
 * @example
 * // Create a rule looking for a response of "4g" to "5g" (also allowing 'gram' or 'grams')
 * const rule = new NumericRule({ value:'[4,5]g', additionalUnits:'grams,gram' })
 * rule.allUnits // ['g', 'gram', 'grams']
 * rule.unitsAreCaseSensitive // false (The default)
 * rule.value //Equivalent to new NumericEntryRange('[4,5]g')
 */
module.exports = class NumericRule {
	/**
	 * Return the error type as a rule can only specify one.
	 * @param {RuleConfigObject} config
	 * @return {'noError'|'absoluteError'|'percentError'}
	 * @throws Error if both percentError and absoluteError are defined on config.
	 */
	static getRuleErrorType(config) {
		if (config.percentError && config.absoluteError) throw 'Cant have both errors!'
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

		const minIsZero = value.minEq(ZERO)
		const maxIsZero = value.maxEq(ZERO)

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
		if (typeof config.absoluteError === 'undefined' || !config.absoluteError) return Big(0)
		return Big(config.absoluteError).abs()
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

	// static getExplicitRuleTypes(config, value) {
	// 	let types = []

	// 	if (value.min) types.push(value.min.numericInstance.type)
	// 	if (value.max) types.push(value.max.numericInstance.type)

	// 	if (config.types) {
	// 		types = types.concat(config.types.split(','))
	// 	}

	// 	if (!NumericRule.isTypesValid(types)) {
	// 		throw 'Invalid type given'
	// 	}

	// 	return [...new Set(types)]
	// }

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
	 */
	static getRuleSigFigs(config) {
		if (!config.sigFigs) return new BigValueRange()

		const range = new BigValueRange(config.sigFigs)
		if (range.min.lte(Big(0))) throw 'bad sig figs range'

		return range
	}

	/**
	 * Returns `config.digits` as a BigValueRange
	 * @param {RuleConfigObject} config
	 * @return {BigValueRange}
	 */
	static getRuleDigits(config) {
		if (!config.digits) return new BigValueRange()
		return new BigValueRange(config.digits)
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
		if (typeof config.isValidScientific === 'undefined' || config.isValidScientific === null) {
			return null
		}

		return !!config.isValidScientific
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
		if (!Number.isFinite(score) || score < 0 || score > 100) throw 'Bad score error'
		return score
	}

	/**
	 * Validates and returns `config.round`
	 * @param {RuleConfigObject} config
	 * @return {'none'|'digits'|'sigFigs'}
	 * @throws Error if an invalid round type is specified
	 */
	static getRuleRound(config) {
		if (!config.round) return ROUND_TYPE_NONE

		const round = config.round

		if (
			round !== ROUND_TYPE_NONE &&
			round !== ROUND_TYPE_ROUND_DIGITS &&
			round !== ROUND_TYPE_ROUND_SIG_FIGS
		) {
			throw 'Bad round value'
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

		const types = config.scientificTypes.split(',').map(getProcessedInput)

		if (
			types.filter(t => {
				switch (t) {
					case SCIENTIFIC_TYPE_APOS:
					case SCIENTIFIC_TYPE_ASTERISK:
					case SCIENTIFIC_TYPE_E:
					case SCIENTIFIC_TYPE_EE:
					case SCIENTIFIC_TYPE_X:
						return true
				}

				return false
			}).length > 0
		) {
			throw 'Invalid scientific type given'
		}

		return [...new Set(...types)]
	}

	static getFeedback(config) {
		return config.feedback || null
	}

	/**
	 * Validates and returns `config.unitsMatch`
	 * @param {RuleConfigObject} config
	 * @return {'no-unit'|'any-unit'|'ignore-unit'|'matches-unit'}
	 * @throws Error if an invalid unit match property is given
	 */
	static getUnitsMatch(config) {
		if (typeof config.unitsMatch === 'undefined') return MATCHES_UNIT

		switch (config.unitsMatch) {
			case NO_UNIT:
			case ANY_UNIT:
			case IGNORE_UNIT:
			case MATCHES_UNIT:
				return config.unitsMatch
		}

		throw 'Invalid unitsMatch property'
	}

	/**
	 * Combines the unit in `config.value` and `config.additionalUnits`
	 * @param {RuleConfigObject} config
	 * @param {NumericEntryRange} value
	 * @return {string[]}
	 */
	static getAllUnits(config, value) {
		const additionalUnits = NumericRule.getAdditionalUnits(config, value)
		const unit = value.unit
		let units = []

		if (unit.length > 0) {
			units.push(unit)
		}

		units = [...new Set([].concat(additionalUnits))]

		return units.length === 0 ? [''] : units
	}

	/**
	 * Returns `config.additionalUnits` as an array
	 * @param {RuleConfigObject} config
	 * @param {NumericEntryRange} value
	 * @return {string[]}
	 */
	static getAdditionalUnits(config, value) {
		if (typeof config.additionalUnits === 'string') {
			return config.additionalUnits
				.split(',')
				.map(s => s.trim())
				.map(s => s.replace(/ /g, ''))
				.filter(s => s.length > 0)
		}

		return []
	}

	/**
	 * Returns `config.unitsAreCaseSensitive`
	 * @param {RuleConfigObject} config
	 * @return {boolean}
	 */
	static getUnitsAreCaseSensitive(config) {
		return config.unitsAreCaseSensitive === true
	}

	/**
	 * Returns `config.value` as a NumericEntryRange
	 * @param {RuleConfigObject} config
	 * @param {string[]} types
	 * @return {NumericEntryRange}
	 * @throws Error if a closed range is specified
	 */
	static getRuleValue(config, types) {
		if (typeof config.value === 'undefined' || config.value === null) return new NumericEntryRange()

		const range = new NumericEntryRange(config.value, types)

		if (range.isClosed) throw 'Invalid range given for value'

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
		if (nonStandardProps.length > 0) throw 'invalid properties ' + nonStandardProps.join(',')

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
		this.digits = NumericRule.getRuleDigits(config)

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
		 * @type {boolean|null}
		 */
		this.unitsMatch = NumericRule.getUnitsMatch(config)

		/**
		 * @type {string[]}
		 */
		this.allUnits = NumericRule.getAllUnits(config, this.value)

		/**
		 * @type {boolean|null}
		 */
		this.unitsAreCaseSensitive = NumericRule.getUnitsAreCaseSensitive(config)

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
