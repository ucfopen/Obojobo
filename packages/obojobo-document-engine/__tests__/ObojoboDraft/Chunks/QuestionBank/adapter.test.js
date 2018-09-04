import QuestionBankAdapter from '../../../../ObojoboDraft/Chunks/QuestionBank/adapter'

describe('QuestionBank adapter', () => {
	it('can be constructed WITHOUT attributes', () => {
		let model = { modelState: {} }
		QuestionBankAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = {
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

	it('can be cloned', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }
		let attrs = {
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

	it('can be converted to JSON', () => {
		let model = { modelState: {} }
		let json = { content: {} }
		let attrs = {
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
