import MCAssessmentAdapter from '../../../../ObojoboDraft/Chunks/MCAssessment/adapter'

describe('MCAssessment adapter', () => {
	it('can be constructed WITHOUT attributes', () => {
		let model = { modelState: {} }
		MCAssessmentAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = { content: { responseType: 'pick-one' } }

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

	it('can convert to JSON', () => {
		let model = { modelState: {} }
		let attrs = { content: { responseType: 'pick-one' } }
		let json = { content: {} }

		MCAssessmentAdapter.construct(model, attrs)
		MCAssessmentAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})
})
