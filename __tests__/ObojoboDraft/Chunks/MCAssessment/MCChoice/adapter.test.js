import MCChoiceAdapter from '../../../../../ObojoboDraft/Chunks/MCAssessment/MCChoice/adapter'

describe('MCChoice adapter', () => {
	test('construct builds without attributes', () => {
		const model = { modelState: {} }
		MCChoiceAdapter.construct(model)
		expect(model.modelState).toMatchObject({ score: '' })
	})

	test('construct builds with attributes', () => {
		const model = { modelState: {} }
		MCChoiceAdapter.construct(model, { content: { score: 999 } })
		expect(model.modelState).toMatchObject({ score: 999 })
	})

	test('clone creates a copy', () => {
		const a = { modelState: {} }
		const b = { modelState: {} }

		MCChoiceAdapter.construct(a, { content: { score: 999 } })
		MCChoiceAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).not.toBe(b.modelState)
		expect(a.modelState).toMatchObject(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		const model = { modelState: {} }
		const attrs = { content: { score: 777 } }
		const json = { content: {} }

		MCChoiceAdapter.construct(model, attrs)
		MCChoiceAdapter.toJSON(model, json)

		expect(json).toMatchObject({ content: { score: 777 } })
	})
})
