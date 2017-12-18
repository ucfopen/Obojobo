import AssessmentScoreConditions from '../../server/assessment-score-conditions'

describe('AssessmentScoreConditions', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Default case with no scores returns null', () => {
		let asc = new AssessmentScoreConditions()

		expect(asc.getAssessmentScore(10, [])).toEqual(null)
	})

	test('Default case with scores always returns highest score', () => {
		let asc = new AssessmentScoreConditions()

		expect(asc.getAssessmentScore(10, [0])).toEqual(0)
		expect(asc.getAssessmentScore(10, [0, 50])).toEqual(50)
		expect(asc.getAssessmentScore(10, [0, 50, 100])).toEqual(100)
		expect(asc.getAssessmentScore(10, [0, 50, 100, 75])).toEqual(100)
	})

	test('getAssessmentScore ignores scores recorded after the alloted number of attempts', () => {
		let asc = new AssessmentScoreConditions()

		expect(asc.getAssessmentScore(2, [0, 10, 20])).toEqual(10)
		expect(asc.getAssessmentScore(1, [1, 100])).toEqual(1)
	})

	test('getAssessmentScore supports $highestAttemptScore option', () => {
		let asc = new AssessmentScoreConditions([
			{
				setAssessmentScore: '$highestAttemptScore'
			}
		])

		expect(asc.getAssessmentScore(10, [0, 10, 20])).toEqual(20)
		expect(asc.getAssessmentScore(10, [0, 20, 10])).toEqual(20)
	})

	test('getAssessmentScore supports inclusive score ranges (return null if no rule matched)', () => {
		let asc = new AssessmentScoreConditions([
			{
				onHighestAttemptScore: '[50,100]',
				setAssessmentScore: '$highestAttemptScore'
			}
		])

		expect(asc.getAssessmentScore(10, [0, 10, 20])).toEqual(null)
		expect(asc.getAssessmentScore(10, [49])).toEqual(null)
		expect(asc.getAssessmentScore(10, [50])).toEqual(50)
		expect(asc.getAssessmentScore(10, [51])).toEqual(51)
		expect(asc.getAssessmentScore(10, [100])).toEqual(100)
	})

	test('getAssessmentScore supports non-inclusive score ranges (return null if no rule matched)', () => {
		let asc = new AssessmentScoreConditions([
			{
				onHighestAttemptScore: '(50,100]',
				setAssessmentScore: '$highestAttemptScore'
			}
		])

		expect(asc.getAssessmentScore(10, [0, 10, 20])).toEqual(null)
		expect(asc.getAssessmentScore(10, [49])).toEqual(null)
		expect(asc.getAssessmentScore(10, [50])).toEqual(null)
		expect(asc.getAssessmentScore(10, [51])).toEqual(51)
		expect(asc.getAssessmentScore(10, [100])).toEqual(100)
	})

	test('getAssessmentScore supports static score ranges', () => {
		let asc = new AssessmentScoreConditions([
			{
				onHighestAttemptScore: '[50,100]',
				setAssessmentScore: '100'
			}
		])

		expect(asc.getAssessmentScore(10, [0, 10, 20])).toEqual(null)
		expect(asc.getAssessmentScore(10, [49])).toEqual(null)
		expect(asc.getAssessmentScore(10, [50])).toEqual(100)
		expect(asc.getAssessmentScore(10, [51])).toEqual(100)
		expect(asc.getAssessmentScore(10, [100])).toEqual(100)
	})

	test('getAssessmentScore supports multiple score ranges', () => {
		let asc = new AssessmentScoreConditions([
			{
				onHighestAttemptScore: '[25,50)',
				setAssessmentScore: '25'
			},
			{
				onHighestAttemptScore: '[50,75)',
				setAssessmentScore: '50'
			},
			{
				onHighestAttemptScore: '[75,100)',
				setAssessmentScore: '75'
			},
			{
				onHighestAttemptScore: '[100,100]',
				setAssessmentScore: '100'
			}
		])

		expect(asc.getAssessmentScore(10, [0])).toEqual(null)

		expect(asc.getAssessmentScore(10, [24.999])).toEqual(null)
		expect(asc.getAssessmentScore(10, [25])).toEqual(25)
		expect(asc.getAssessmentScore(10, [25.001])).toEqual(25)

		expect(asc.getAssessmentScore(10, [49.999])).toEqual(25)
		expect(asc.getAssessmentScore(10, [50])).toEqual(50)
		expect(asc.getAssessmentScore(10, [50.001])).toEqual(50)

		expect(asc.getAssessmentScore(10, [74.999])).toEqual(50)
		expect(asc.getAssessmentScore(10, [75])).toEqual(75)
		expect(asc.getAssessmentScore(10, [75.001])).toEqual(75)

		expect(asc.getAssessmentScore(10, [99.999])).toEqual(75)
		expect(asc.getAssessmentScore(10, [100])).toEqual(100)
	})

	test('getAssessmentScore supports multiple score ranges, returns score result for highest attempt score', () => {
		let asc = new AssessmentScoreConditions([
			{
				onHighestAttemptScore: '[25,50)',
				setAssessmentScore: '25'
			},
			{
				onHighestAttemptScore: '[50,75)',
				setAssessmentScore: '50'
			},
			{
				onHighestAttemptScore: '[75,100)',
				setAssessmentScore: '75'
			},
			{
				onHighestAttemptScore: '[100,100]',
				setAssessmentScore: '100'
			}
		])

		expect(asc.getAssessmentScore(10, [0, 50])).toEqual(50)

		expect(asc.getAssessmentScore(10, [24.999, 50])).toEqual(50)
		expect(asc.getAssessmentScore(10, [25, 50])).toEqual(50)
		expect(asc.getAssessmentScore(10, [25.001, 50])).toEqual(50)

		expect(asc.getAssessmentScore(10, [49.999, 50])).toEqual(50)
		expect(asc.getAssessmentScore(10, [50, 50])).toEqual(50)
		expect(asc.getAssessmentScore(10, [50.001, 50])).toEqual(50)

		expect(asc.getAssessmentScore(10, [74.999, 50])).toEqual(50)
		expect(asc.getAssessmentScore(10, [75, 50])).toEqual(75)
		expect(asc.getAssessmentScore(10, [75.001, 50])).toEqual(75)

		expect(asc.getAssessmentScore(10, [99.999, 50])).toEqual(75)
		expect(asc.getAssessmentScore(10, [100, 50])).toEqual(100)
	})

	test('getAssessmentScore matches the first rule if rules overlap', () => {
		let asc = new AssessmentScoreConditions([
			{
				onHighestAttemptScore: '[25,75]',
				setAssessmentScore: '100'
			},
			{
				onHighestAttemptScore: '[0,100]',
				setAssessmentScore: '50'
			}
		])

		expect(asc.getAssessmentScore(10, [0])).toEqual(50)
		expect(asc.getAssessmentScore(10, [25])).toEqual(100)
		expect(asc.getAssessmentScore(10, [75])).toEqual(100)
		expect(asc.getAssessmentScore(10, [100])).toEqual(50)
	})

	test('getAssessmentScore supports single values for highest attempt score', () => {
		let asc = new AssessmentScoreConditions([
			{
				onHighestAttemptScore: '100',
				setAssessmentScore: '100'
			},
			{
				onHighestAttemptScore: '50',
				setAssessmentScore: '99'
			},
			{
				setAssessmentScore: '0'
			}
		])

		expect(asc.getAssessmentScore(10, [0])).toEqual(0)
		expect(asc.getAssessmentScore(10, [50])).toEqual(99)
		expect(asc.getAssessmentScore(10, [99])).toEqual(0)
		expect(asc.getAssessmentScore(10, [100])).toEqual(100)
	})

	test('getAssessmentScore supports onAttempt', () => {
		let asc = new AssessmentScoreConditions([
			{
				onAttempt: '1',
				onHighestAttemptScore: '[90,100]',
				setAssessmentScore: '100'
			},
			{
				onAttempt: '3',
				setAssessmentScore: '90'
			}
		])

		expect(asc.getAssessmentScore(10, [0])).toEqual(null)
		expect(asc.getAssessmentScore(10, [0, 1])).toEqual(null)
		expect(asc.getAssessmentScore(10, [0, 1, 2])).toEqual(90)
		expect(asc.getAssessmentScore(10, [0, 1, 2, 3])).toEqual(90)

		expect(asc.getAssessmentScore(10, [90])).toEqual(100)
		expect(asc.getAssessmentScore(10, [90, 91])).toEqual(100)
		expect(asc.getAssessmentScore(10, [90, 91, 92])).toEqual(100)
		expect(asc.getAssessmentScore(10, [90, 91, 92, 93])).toEqual(100)
	})

	test('getAssessmentScore supports ranges for onAttempt', () => {
		let asc = new AssessmentScoreConditions([
			{
				onAttempt: '[1,2]',
				onHighestAttemptScore: '[90,100]',
				setAssessmentScore: '100'
			},
			{
				onAttempt: '(4,5]',
				setAssessmentScore: '90'
			}
		])

		expect(asc.getAssessmentScore(10, [0])).toEqual(null)
		expect(asc.getAssessmentScore(10, [0, 1])).toEqual(null)
		expect(asc.getAssessmentScore(10, [0, 1, 2])).toEqual(null)
		expect(asc.getAssessmentScore(10, [0, 1, 2, 3])).toEqual(null)
		expect(asc.getAssessmentScore(10, [0, 1, 2, 3, 4])).toEqual(90)
		expect(asc.getAssessmentScore(10, [0, 1, 2, 3, 4, 5])).toEqual(90)
		expect(asc.getAssessmentScore(10, [0, 1, 2, 3, 4, 5, 6])).toEqual(90)

		expect(asc.getAssessmentScore(10, [90])).toEqual(100)
		expect(asc.getAssessmentScore(10, [90, 91])).toEqual(100)
		expect(asc.getAssessmentScore(10, [90, 91, 92])).toEqual(100)
		expect(asc.getAssessmentScore(10, [90, 91, 92, 93])).toEqual(100)
		expect(asc.getAssessmentScore(10, [90, 91, 92, 93, 94])).toEqual(100)
		expect(asc.getAssessmentScore(10, [90, 91, 92, 93, 94, 95])).toEqual(100)
		expect(asc.getAssessmentScore(10, [90, 91, 92, 93, 94, 95, 96])).toEqual(100)
	})

	test('getAssessmentScore supports $lastAttempt variable', () => {
		let asc = new AssessmentScoreConditions([
			{
				onAttempt: '$lastAttempt',
				setAssessmentScore: '$highestAttemptScore'
			},
			{
				onHighestAttemptScore: '[80,100]',
				setAssessmentScore: '$highestAttemptScore'
			}
		])

		expect(asc.getAssessmentScore(3, [0])).toEqual(null)
		expect(asc.getAssessmentScore(3, [0, 80])).toEqual(80)
		expect(asc.getAssessmentScore(3, [0, 50])).toEqual(null)
		expect(asc.getAssessmentScore(3, [0, 50, 20])).toEqual(50)
	})

	test('getAssessmentScore supports $lastAttempt variable in a range', () => {
		let asc = new AssessmentScoreConditions([
			{
				onAttempt: '[2,$lastAttempt]',
				setAssessmentScore: '$highestAttemptScore'
			}
		])

		expect(asc.getAssessmentScore(3, [80])).toEqual(null)
		expect(asc.getAssessmentScore(3, [80, 50])).toEqual(80)
		expect(asc.getAssessmentScore(3, [80, 50, 100])).toEqual(100)
	})

	test('Handles complex use case (multiple attempt and score conditions with overridden rules)', () => {
		let asc = new AssessmentScoreConditions([
			{
				onAttempt: '1',
				onHighestAttemptScore: '[80,100]',
				setAssessmentScore: '100'
			},
			{
				onAttempt: '1',
				onHighestAttemptScore: '[60,80)',
				setAssessmentScore: '80'
			},
			{
				onHighestAttemptScore: '[80,100]',
				setAssessmentScore: '90'
			},
			{
				onHighestAttemptScore: '[60,80)',
				setAssessmentScore: '70'
			},
			{
				onAttempt: '$lastAttempt',
				onHighestAttemptScore: '[80,100]',
				setAssessmentScore: '80'
			},
			{
				onAttempt: '$lastAttempt',
				onHighestAttemptScore: '[60,80)',
				setAssessmentScore: '60'
			},
			{
				onAttempt: '$lastAttempt',
				setAssessmentScore: '50'
			}
		])

		expect(asc.getAssessmentScore(3, [80])).toEqual(100)
		expect(asc.getAssessmentScore(3, [70])).toEqual(80)
		expect(asc.getAssessmentScore(3, [50])).toEqual(null)

		expect(asc.getAssessmentScore(3, [80, 80])).toEqual(100)
		expect(asc.getAssessmentScore(3, [70, 70])).toEqual(80)
		expect(asc.getAssessmentScore(3, [50, 50])).toEqual(null)

		expect(asc.getAssessmentScore(3, [0, 100])).toEqual(90)
		expect(asc.getAssessmentScore(3, [100, 100])).toEqual(100)

		expect(asc.getAssessmentScore(3, [0, 60])).toEqual(70)
		expect(asc.getAssessmentScore(3, [0, 60, 100])).toEqual(90)
		expect(asc.getAssessmentScore(3, [0, 60, 60])).toEqual(70)

		expect(asc.getAssessmentScore(3, [0, 40])).toEqual(null)
		expect(asc.getAssessmentScore(3, [0, 40, 100])).toEqual(90)
		expect(asc.getAssessmentScore(3, [100, 40, 0])).toEqual(100)
		expect(asc.getAssessmentScore(3, [0, 40, 60])).toEqual(70)
		expect(asc.getAssessmentScore(3, [0, 40, 59])).toEqual(50)
	})

	test('Respects order of conditions', () => {
		let asc = new AssessmentScoreConditions([
			{
				onHighestAttemptScore: '[80,100]',
				setAssessmentScore: '50'
			},
			{
				onHighestAttemptScore: '[80,100]',
				setAssessmentScore: '100'
			}
		])

		expect(asc.getAssessmentScore(3, [80])).toEqual(50)
	})

	test('Handles common use case (score ranges where first attempt with high score grants full credit, second attempt less credit, last attempt always sets score)', () => {
		let asc = new AssessmentScoreConditions([
			{
				onAttempt: '1',
				onHighestAttemptScore: '[80,100]',
				setAssessmentScore: '100'
			},
			{
				onAttempt: '2',
				onHighestAttemptScore: '[80,100]',
				setAssessmentScore: '90'
			},
			{
				onAttempt: '$lastAttempt',
				onHighestAttemptScore: '[80,100]',
				setAssessmentScore: '80'
			},
			{
				onAttempt: '$lastAttempt',
				onHighestAttemptScore: '[0,70)',
				setAssessmentScore: '$highestAttemptScore'
			},
			{
				onAttempt: '$lastAttempt',
				setAssessmentScore: '70'
			}
		])

		expect(asc.getAssessmentScore(3, [80])).toEqual(100)
		expect(asc.getAssessmentScore(3, [80, 80])).toEqual(100)
		expect(asc.getAssessmentScore(3, [80, 80, 80])).toEqual(100)

		expect(asc.getAssessmentScore(3, [70])).toEqual(null)
		expect(asc.getAssessmentScore(3, [70, 70])).toEqual(null)
		expect(asc.getAssessmentScore(3, [70, 70, 70])).toEqual(70)

		expect(asc.getAssessmentScore(3, [70, 80, 90])).toEqual(90)

		expect(asc.getAssessmentScore(3, [50, 50, 80])).toEqual(80)
		expect(asc.getAssessmentScore(3, [50, 50, 70])).toEqual(70)
		expect(asc.getAssessmentScore(3, [50, 50, 60])).toEqual(60)
	})

	test('handles floating point values', () => {
		let asc = new AssessmentScoreConditions([
			{
				onHighestAttemptScore: '[99,99.5)',
				setAssessmentScore: '99'
			},
			{
				onHighestAttemptScore: '[99.5,100]',
				setAssessmentScore: '100'
			}
		])

		expect(asc.getAssessmentScore(3, [99])).toEqual(99)
		expect(asc.getAssessmentScore(3, [99.49])).toEqual(99)
		expect(asc.getAssessmentScore(3, [99.5])).toEqual(100)
		expect(asc.getAssessmentScore(3, [100])).toEqual(100)
	})

	test('handles non-inclusive ranges', () => {
		let asc = new AssessmentScoreConditions([
			{
				onHighestAttemptScore: '(90,100)',
				setAssessmentScore: '100'
			},
			{
				onHighestAttemptScore: '(80,90)',
				setAssessmentScore: '90'
			}
		])

		expect(asc.getAssessmentScore(3, [80])).toEqual(null)
		expect(asc.getAssessmentScore(3, [80.01])).toEqual(90)
		expect(asc.getAssessmentScore(3, [89.99])).toEqual(90)
		expect(asc.getAssessmentScore(3, [90])).toEqual(null)
		expect(asc.getAssessmentScore(3, [90.01])).toEqual(100)
		expect(asc.getAssessmentScore(3, [99.99])).toEqual(100)
		expect(asc.getAssessmentScore(3, [100])).toEqual(null)
	})
})
