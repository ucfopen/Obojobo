import mcAssessmentResults from './mc-assessment-results'

const tc = (type, score, isTypePickAll, isForScreenReader) => {
	return mcAssessmentResults({
		type,
		score,
		isTypePickAll,
		isForScreenReader
	})
}

describe('ObojoboDraft.Chunks.MCAssessment mc-assessment-results', () => {
	test('...', () => {
		expect(tc('default', 100, true, true)).toMatchSnapshot()
		expect(tc('default', 100, true, false)).toMatchSnapshot()
		expect(tc('default', 100, false, true)).toMatchSnapshot()
		expect(tc('default', 100, false, false)).toMatchSnapshot()

		expect(tc('default', 0, true, true)).toMatchSnapshot()
		expect(tc('default', 0, true, false)).toMatchSnapshot()
		expect(tc('default', 0, false, true)).toMatchSnapshot()
		expect(tc('default', 0, false, false)).toMatchSnapshot()

		expect(tc('survey', 100, true, true)).toMatchSnapshot()
		expect(tc('survey', 100, true, false)).toMatchSnapshot()
		expect(tc('survey', 100, false, true)).toMatchSnapshot()
		expect(tc('survey', 100, false, false)).toMatchSnapshot()

		expect(tc('survey', 0, true, true)).toMatchSnapshot()
		expect(tc('survey', 0, true, false)).toMatchSnapshot()
		expect(tc('survey', 0, false, true)).toMatchSnapshot()
		expect(tc('survey', 0, false, false)).toMatchSnapshot()
	})
})
