import MCAssessmentAdapter from '../../../../ObojoboDraft/Chunks/MCAssessment/adapter'

describe('MCAssessment adapter', () => {
	test('construct builds without attributes', () => {
		const model = { modelState: {} }
		MCAssessmentAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				responseType: 'pick-one',
				correctLabels: 'Correct!|Great job!',
				incorrectLabels: 'Incorrect|wrong',
				shuffle: false
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('construct builds with responseType', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				responseType: 'pick-one'
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('construct builds with correctLabels', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				correctLabels: 'Correct!|Great job!'
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('construct builds with incorrectLabels', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				incorrectLabels: 'Incorrect|wrong'
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('construct builds with shuffle', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				shuffle: true
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		const a = { modelState: {} }
		const b = { modelState: {} }

		MCAssessmentAdapter.construct(a)
		MCAssessmentAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('clone creates a copy with attributes', () => {
		const a = {
			modelState: {
				responseType: 'pick-one',
				correctLabels: 'Correct!|Great job!',
				incorrectLabels: 'Incorrect|wrong',
				shuffle: true
			}
		}
		const attrs = {
			content: {
				responseType: 'pick-one',
				correctLabels: 'Correct!|Great job!',
				incorrectLabels: 'Incorrect|wrong',
				shuffle: true
			}
		}
		const b = {
			modelState: {
				responseType: null,
				correctLabels: null,
				incorrectLabels: null,
				shuffle: false
			}
		}

		MCAssessmentAdapter.construct(a, attrs)
		MCAssessmentAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('can convert to JSON', () => {
		const model = { modelState: {} }
		const attrs = { content: { responseType: 'pick-one' } }
		const json = { content: {} }

		MCAssessmentAdapter.construct(model, attrs)
		MCAssessmentAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('can convert to JSON WITH attributes', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				responseType: 'pick-one',
				correctLabels: 'Correct!|Great job!',
				incorrectLabels: 'Incorrect|wrong',
				shuffle: true
			}
		}
		const json = { content: {} }

		MCAssessmentAdapter.construct(model, attrs)
		MCAssessmentAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})
})
