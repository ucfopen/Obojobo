import MCAssessmentAdapter from '../../../../ObojoboDraft/Chunks/MCAssessment/adapter'

describe('MCAssessment adapter', () => {
	test('construct builds without attributes', () => {
		let model = { modelState: {} }
		MCAssessmentAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		let model = { modelState: {} }
		let attrs = {
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
		let model = { modelState: {} }
		let attrs = {
			content: {
				responseType: 'pick-one'
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('construct builds with correctLabels', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				correctLabels: 'Correct!|Great job!'
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('construct builds with incorrectLabels', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				incorrectLabels: 'Incorrect|wrong'
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('construct builds with shuffle', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				shuffle: true
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		MCAssessmentAdapter.construct(a)
		MCAssessmentAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('clone creates a copy with attributes', () => {
		let a = {
			modelState: {
				responseType: 'pick-one',
				correctLabels: 'Correct!|Great job!',
				incorrectLabels: 'Incorrect|wrong',
				shuffle: true
			}
		}
		let attrs = {
			content: {
				responseType: 'pick-one',
				correctLabels: 'Correct!|Great job!',
				incorrectLabels: 'Incorrect|wrong',
				shuffle: true
			}
		}
		let b = {
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
		let model = { modelState: {} }
		let attrs = { content: { responseType: 'pick-one' } }
		let json = { content: {} }

		MCAssessmentAdapter.construct(model, attrs)
		MCAssessmentAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('can convert to JSON WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				responseType: 'pick-one',
				correctLabels: 'Correct!|Great job!',
				incorrectLabels: 'Incorrect|wrong',
				shuffle: true
			}
		}
		let json = { content: {} }

		MCAssessmentAdapter.construct(model, attrs)
		MCAssessmentAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})
})
