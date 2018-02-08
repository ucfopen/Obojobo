import MCInteractionAdapter from '../../../../ObojoboDraft/Chunks/MCInteraction/adapter'

describe('MCInteraction adapter', () => {
	it('can be constructed WITHOUT attributes', () => {
		let model = { modelState: {} }
		MCInteractionAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = { content: { responseType: 'pick-one' } }

		MCInteractionAdapter.construct(model, attrs)

		expect(model).toMatchSnapshot()
	})

	it('can be cloned', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }

		MCInteractionAdapter.construct(a)
		MCInteractionAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	it('can convert to JSON', () => {
		let model = { modelState: {} }
		let attrs = { content: { responseType: 'pick-one' } }
		let json = { content: {} }

		MCInteractionAdapter.construct(model, attrs)
		MCInteractionAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})
})
