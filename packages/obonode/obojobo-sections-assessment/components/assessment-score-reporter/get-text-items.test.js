import getTextItems from './get-text-items'
import {
	TYPE_ATTEMPT_WITHOUT_MODS_REWARDED,
	TYPE_ATTEMPT_WITH_MODS_REWARDED,
	TYPE_PASSFAIL_PASSED_GIVEN_SCORE,
	TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_RESULT_IS_LESS_THAN_100,
	TYPE_PASSFAIL_FAILED_GIVEN_ATTEMPT_SCORE,
	TYPE_PASSFAIL_FAILED_GIVEN_NO_SCORE,
	TYPE_PASSFAIL_FAILED_GIVEN_SCORE,
	TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE,
	TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_HIGHEST_ATTEMPT_SCORE,
	TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_SCORE,
	ERROR_UNKNOWN_DISPLAY_TYPE
} from './display-types'

const getDisplayType = require('./get-display-type').default

jest.mock('./get-display-type')

describe('getTextItems', () => {
	const mods = [
		{
			attemptCondition: '1',
			reward: '5'
		}
	]

	const displayValues = {
		passingAttemptScore: 'PassingAttemptScore',
		attemptNum: 'AttemptNumber',
		attemptScore: 'AttemptScore',
		assessScore: 'AssessmentScore',
		totalNumberOfAttemptsAllowed: 'TotalAttempts'
	}

	test('TYPE_ATTEMPT_WITHOUT_MODS_REWARDED', () => {
		getDisplayType.mockReturnValueOnce(TYPE_ATTEMPT_WITHOUT_MODS_REWARDED)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: true,
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'total',
				text: 'Score',
				updated: 'AssessmentScore'
			}
		])

		getDisplayType.mockReturnValueOnce(TYPE_ATTEMPT_WITHOUT_MODS_REWARDED)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: false,
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'total',
				text: 'Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_ATTEMPT_WITH_MODS_REWARDED', () => {
		getDisplayType.mockReturnValueOnce(TYPE_ATTEMPT_WITH_MODS_REWARDED)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: true,
					mods
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score',
				updated: 'AttemptScore'
			},
			{
				type: 'extra-credit',
				text: 'Passed on first attempt',
				updated: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score (Max 100%)',
				updated: 'AssessmentScore'
			}
		])

		getDisplayType.mockReturnValueOnce(TYPE_ATTEMPT_WITH_MODS_REWARDED)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: false,
					mods
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score',
				updated: 'AttemptScore'
			},
			{
				type: 'extra-credit',
				text: 'Passed on first attempt',
				updated: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_PASSED_GIVEN_SCORE (Without mods)', () => {
		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_PASSED_GIVEN_SCORE)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: true,
					mods: [],
					statusResult: 100
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score (Passed)',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'updated',
				text: 'Score adjusted for passing',
				updated: '100'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score (Max 100%)',
				updated: 'AssessmentScore'
			}
		])

		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_PASSED_GIVEN_SCORE)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: false,
					mods: [],
					statusResult: 100
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score (Passed)',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'updated',
				text: 'Score adjusted for passing',
				updated: '100'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_PASSED_GIVEN_SCORE (With mods)', () => {
		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_PASSED_GIVEN_SCORE)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: true,
					mods,
					statusResult: 100
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score (Passed)',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'updated',
				text: 'Score adjusted for passing',
				updated: '100'
			},
			{
				type: 'extra-credit',
				text: 'Passed on first attempt',
				updated: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score (Max 100%)',
				updated: 'AssessmentScore'
			}
		])

		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_PASSED_GIVEN_SCORE)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: false,
					mods,
					statusResult: 100
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score (Passed)',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'updated',
				text: 'Score adjusted for passing',
				updated: '100'
			},
			{
				type: 'extra-credit',
				text: 'Passed on first attempt',
				updated: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_RESULT_IS_LESS_THAN_100 (Without mods)', () => {
		getDisplayType.mockReturnValueOnce(
			TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_RESULT_IS_LESS_THAN_100
		)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: true,
					mods: [],
					statusResult: 90
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score (Passed)',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'updated',
				text: 'Score adjusted for passing',
				updated: '90'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score (Max 100%)',
				updated: 'AssessmentScore'
			}
		])

		getDisplayType.mockReturnValueOnce(
			TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_RESULT_IS_LESS_THAN_100
		)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: false,
					mods: [],
					statusResult: 90
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score (Passed)',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'updated',
				text: 'Score adjusted for passing',
				updated: '90'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_RESULT_IS_LESS_THAN_100 (With mods)', () => {
		getDisplayType.mockReturnValueOnce(
			TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_RESULT_IS_LESS_THAN_100
		)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: true,
					mods,
					statusResult: 90
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score (Passed)',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'updated',
				text: 'Score adjusted for passing',
				updated: '90'
			},
			{
				type: 'extra-credit',
				text: 'Passed on first attempt',
				updated: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score (Max 100%)',
				updated: 'AssessmentScore'
			}
		])

		getDisplayType.mockReturnValueOnce(
			TYPE_PASSFAIL_PASSED_GIVEN_SCORE_AND_ATTEMPT_SCORE_IS_100_AND_RESULT_IS_LESS_THAN_100
		)
		expect(
			getTextItems(
				{
					isAssessScoreOver100: false,
					mods,
					statusResult: 90
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score (Passed)',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'updated',
				text: 'Score adjusted for passing',
				updated: '90'
			},
			{
				type: 'extra-credit',
				text: 'Passed on first attempt',
				updated: '5'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_FAILED_GIVEN_ATTEMPT_SCORE', () => {
		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_FAILED_GIVEN_ATTEMPT_SCORE)
		expect(
			getTextItems(
				{
					passingAttemptScore: 50,
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You need 50% or higher to pass'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_FAILED_GIVEN_NO_SCORE', () => {
		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_FAILED_GIVEN_NO_SCORE)
		expect(
			getTextItems(
				{
					passingAttemptScore: 50,
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You need 50% or higher to pass'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_FAILED_GIVEN_SCORE', () => {
		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_FAILED_GIVEN_SCORE)
		expect(
			getTextItems(
				{
					passingAttemptScore: 50,
					statusResult: 0,
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'updated',
				text: 'Score adjusted for not passing (less than 50%)',
				updated: '0'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE', () => {
		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE)
		expect(
			getTextItems(
				{
					passingAttemptScore: 50,
					statusResult: 0,
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You needed 50% or higher to pass'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE with 100% needed', () => {
		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE)
		expect(
			getTextItems(
				{
					passingAttemptScore: '100',
					statusResult: 0,
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You needed 100% to pass'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE with null needed', () => {
		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_NO_SCORE)
		expect(
			getTextItems(
				{
					passingAttemptScore: null,
					statusResult: 0,
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text: 'You needed --% or higher to pass'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_HIGHEST_ATTEMPT_SCORE', () => {
		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_HIGHEST_ATTEMPT_SCORE)
		expect(
			getTextItems(
				{
					passingAttemptScore: 50,
					statusResult: 0,
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text:
					'You did not achieve a passing 50% or higher score within the number of attempts available. Your highest attempt score will be used instead.'
			},
			{
				type: 'divider'
			},
			{
				type: 'updated',
				text: 'Highest attempt score (Attempt\u00a0AttemptNumber)',
				updated: 'AssessmentScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_SCORE', () => {
		getDisplayType.mockReturnValueOnce(TYPE_PASSFAIL_UNABLE_TO_PASS_GIVEN_SCORE)
		expect(
			getTextItems(
				{
					passingAttemptScore: 50,
					statusResult: 0,
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'updated',
				text: 'Attempt Score',
				updated: 'AttemptScore'
			},
			{
				type: 'divider'
			},
			{
				type: 'text',
				text:
					'You did not achieve a passing 50% or higher score within the number of attempts available.'
			},
			{
				type: 'updated',
				text: 'Score for not achieving a passing attempt',
				updated: '0'
			},
			{
				type: 'divider'
			},
			{
				type: 'total',
				text: 'Total Score',
				updated: 'AssessmentScore'
			}
		])
	})

	test('ERROR_UNKNOWN_DISPLAY_TYPE still shows score', () => {
		getDisplayType.mockReturnValueOnce(ERROR_UNKNOWN_DISPLAY_TYPE)
		expect(
			getTextItems(
				{
					mods: []
				},
				displayValues
			)
		).toEqual([
			{
				type: 'total',
				text: 'Score',
				updated: 'AssessmentScore'
			}
		])
	})
})
