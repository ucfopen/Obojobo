import MCAssessmentAdapter from '../../../../ObojoboDraft/Chunks/MCAssessment/adapter'

describe('MCAssessment adapter', () => {
	it('can be constructed WITHOUT attributes', () => {
		let model = { modelState: {} }
		MCAssessmentAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH attributes', () => {
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

	it('can be constructed WITH responseType', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				responseType: 'pick-one'
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH correctLabels', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				correctLabels: 'Correct!|Great job!'
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH incorrectLabels', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				incorrectLabels: 'Incorrect|wrong'
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH shuffle', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				shuffle: false
			}
		}

		MCAssessmentAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	it('can be cloned', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		MCAssessmentAdapter.construct(a)
		MCAssessmentAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	it('can be cloned WITH attributes', () => {
		let a = {
			modelState: {
				responseType: 'pick-one',
				correctLabels: 'Correct!|Great job!',
				incorrectLabels: 'Incorrect|wrong',
				shuffle: false
			}
		}
		let b = {
			modelState: {
				responseType: 'pick-one',
				correctLabels: 'Correct!|Great job!',
				incorrectLabels: 'Incorrect|wrong',
				shuffle: false
			}
		}

		MCAssessmentAdapter.construct(a)
		MCAssessmentAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	it('can convert to JSON', () => {
		let model = { modelState: {} }
		let attrs = { content: { responseType: 'pick-one' } }
		let json = { content: {} }

		MCAssessmentAdapter.construct(model, attrs)
		MCAssessmentAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	it('can convert to JSON WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				responseType: 'pick-one',
				correctLabels: 'Correct!|Great job!',
				incorrectLabels: 'Incorrect|wrong',
				shuffle: false
			}
		}
		let json = { content: {} }

		MCAssessmentAdapter.construct(model, attrs)
		MCAssessmentAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})
})
