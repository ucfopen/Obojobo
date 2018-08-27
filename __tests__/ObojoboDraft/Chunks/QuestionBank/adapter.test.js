import QuestionBankAdapter from '../../../../ObojoboDraft/Chunks/QuestionBank/adapter'

describe('QuestionBank adapter', () => {
	test('construct builds without attributes', () => {
		const model = { modelState: {} }
		QuestionBankAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const model = { modelState: {} }
		const attrs = {
			content: {
				choose: 2,
				select: 'random-all',
				shuffleGroup: true,
				groupSize: 2
			}
		}

		QuestionBankAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		const a = { modelState: {} }
		const b = { modelState: {} }
		const attrs = {
			content: {
				choose: 2,
				select: 'random-all',
				shuffleGroup: true,
				groupSize: 2
			}
		}

		QuestionBankAdapter.construct(a, attrs)
		QuestionBankAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	test('toJSON builds a JSON representation', () => {
		const model = { modelState: {} }
		const json = { content: {} }
		const attrs = {
			content: {
				choose: 2,
				select: 'random-all',
				shuffleGroup: true,
				groupSize: 2
			}
		}

		QuestionBankAdapter.construct(model, attrs)
		QuestionBankAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})
})
