import mcAssessmentResults from './mc-assessment-results'

describe('ObojoboDraft.Chunks.MCAssessment mc-assessment-results', () => {
	test.each([
		['default', 100, true, true],
		['default', 100, true, false],
		['default', 100, false, true],
		['default', 100, false, false],
		['default', 0, true, true],
		['default', 0, true, false],
		['default', 0, false, true],
		['default', 0, false, false],
		['survey', 100, true, true],
		['survey', 100, true, false],
		['survey', 100, false, true],
		['survey', 100, false, false],
		['survey', 0, true, true],
		['survey', 0, true, false],
		['survey', 0, false, true],
		['survey', 0, false, false]
	])(
		'type=%s, score=%i, isTypePickAll=%s, isForScreenReader=%s',
		(type, score, isTypePickAll, isForScreenReader) => {
			expect(
				mcAssessmentResults({
					type,
					score,
					isTypePickAll,
					isForScreenReader,
					correctLabel: 'mock-correct-label',
					incorrectLabel: 'mock-incorrect-label'
				})
			).toMatchSnapshot()
		}
	)
})
