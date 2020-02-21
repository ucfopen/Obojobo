import AssessmentScoreReporter from '../../../src/scripts/viewer/assessment/assessment-score-reporter'

const getTextItems = require('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-text-items')
	.default
jest.mock('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-text-items')

const getReportDetailsForAttempt = require('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-report-details-for-attempt')
	.default
jest.mock(
	'../../../src/scripts/viewer/assessment/assessment-score-reporter/get-report-details-for-attempt'
)

const getReportDisplayValuesForAttempt = require('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-report-display-values-for-attempt')
	.default
jest.mock(
	'../../../src/scripts/viewer/assessment/assessment-score-reporter/get-report-display-values-for-attempt'
)

const getScoreChangeDescription = require('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-score-change-description')
	.default
jest.mock(
	'../../../src/scripts/viewer/assessment/assessment-score-reporter/get-score-change-description'
)

const getScoreComparisionData = require('../../../src/scripts/viewer/assessment/assessment-score-reporter/get-score-comparision-data')
	.default
jest.mock(
	'../../../src/scripts/viewer/assessment/assessment-score-reporter/get-score-comparision-data'
)

describe('AssessmentScoreReporter', () => {
	test('getReportFor calls helper methods', () => {
		const assessmentRubric = { type: 'attempt' }
		const allScoreDetails = [
			{
				status: {}
			}
		]
		const totalNumberOfAttemptsAllowed = 100

		new AssessmentScoreReporter({
			assessmentRubric,
			allScoreDetails,
			totalNumberOfAttemptsAllowed
		}).getReportFor(1)

		expect(getTextItems).toHaveBeenCalledTimes(1)
		expect(getReportDetailsForAttempt).toHaveBeenCalledTimes(1)
		expect(getReportDisplayValuesForAttempt).toHaveBeenCalledTimes(1)
		expect(getScoreChangeDescription).toHaveBeenCalledTimes(1)
		expect(getScoreComparisionData).toHaveBeenCalledTimes(1)
	})

	test('throws error when given bad input', () => {
		const assessmentRubric = { type: 'attempt' }
		const allScoreDetails = []
		const totalNumberOfAttemptsAllowed = 100
		const asr = new AssessmentScoreReporter({
			assessmentRubric,
			allScoreDetails,
			totalNumberOfAttemptsAllowed
		})
		expect(() => {
			asr.getReportFor(0)
		}).toThrowErrorMatchingInlineSnapshot(
			`"getReportFor parameter is not zero-indexed - Use \\"1\\" for first attempt."`
		)
	})

	test('getReportFor calls helper methods', () => {
		const assessmentRubric = { type: 'attempt' }
		const allScoreDetails = [{}]
		const totalNumberOfAttemptsAllowed = 100

		const asr = new AssessmentScoreReporter({
			assessmentRubric,
			allScoreDetails,
			totalNumberOfAttemptsAllowed
		})
		expect(() => {
			asr.getReportFor(1)
		}).toThrowErrorMatchingInlineSnapshot(`"Error, score details for attempt 1 were not loaded."`)
	})
})
