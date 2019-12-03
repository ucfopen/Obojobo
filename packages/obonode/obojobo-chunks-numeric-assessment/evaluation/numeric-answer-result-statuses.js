const {
	INPUT_MATCHES_MULTIPLE_TYPES,
	INPUT_NOT_SAFE,
	INPUT_NOT_MATCHED,
	INPUT_INVALID
} = require('../entry/numeric-entry-statuses')

const FAILED_VALIDATION = 'failedValidation'
const FAILED = 'failed'
const PASSED = 'passed'

module.exports = {
	FAILED,
	PASSED,
	FAILED_VALIDATION,
	INPUT_INVALID,
	INPUT_NOT_SAFE,
	INPUT_MATCHES_MULTIPLE_TYPES,
	INPUT_NOT_MATCHED
}
