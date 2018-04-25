import getScoreComparisionData from '../../../../src/scripts/viewer/assessment/assessment-score-reporter/get-score-comparision-data.js'

// expect(getScoreComparisionData).toBe(true)

let AssessmentUtil = require('../../../../src/scripts/viewer/util/assessment-util')

// let AssessmentUtil = require('../../../../src/scripts/viewer/util/assessment-util')
// console.log('yo', AssessmentUtil)

jest.mock('../../../../src/scripts/viewer/util/assessment-util', () => ({
	findHighestAttempt: jest.fn()
}))

describe('getScoreChangeData', () => {
	test('Returns correct data', () => {
		// expect(AssessmentUtil).toBe(true)
		AssessmentUtil.findHighestAttempts = attempts => [attempts[attempts.length - 1]]
		expect(
			getScoreComparisionData(
				[
					{ assessmentScoreDetails: 'attempt-1' },
					{ assessmentScoreDetails: 'attempt-2' },
					{ assessmentScoreDetails: 'attempt-3' }
				],
				3
			)
		).toEqual({
			prevHighestInfo: 'attempt-2',
			newInfo: 'attempt-3'
		})

		AssessmentUtil.findHighestAttempts = attempts => []
		expect(
			getScoreComparisionData(
				[
					{ assessmentScoreDetails: 'attempt-1' },
					{ assessmentScoreDetails: 'attempt-2' },
					{ assessmentScoreDetails: 'attempt-3' }
				],
				2
			)
		).toEqual({
			prevHighestInfo: null,
			newInfo: 'attempt-2'
		})
	})

	test('Handles case with no attempts', () => {
		expect(getScoreComparisionData([], 2)).toEqual({
			prevHighestInfo: null,
			newInfo: null
		})
	})
})
