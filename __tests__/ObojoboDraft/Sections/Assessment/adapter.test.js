import AssessmentAdapter from 'ObojoboDraft/Sections/Assessment/adapter'

describe('ObojoboDraft.Sections.Assessment adapter', () => {
	test('constructs with default values', () => {
		let model = { modelState: {} }
		AssessmentAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('constructs with N attempts', () => {
		let model = { modelState: {} }
		AssessmentAdapter.construct(model, { content: { attempts: 6 } })
		expect(model.modelState).toMatchSnapshot()
		expect(model.modelState.attempts).toBe(6)
	})

	test('constructs with unlimited attempts', () => {
		let model = { modelState: {} }
		AssessmentAdapter.construct(model, { content: { attempts: 'unlimited' } })
		expect(model.modelState).toMatchSnapshot()
		expect(model.modelState.attempts).toBe(Infinity)
	})

	test('constructor floors decimal attempt integers', () => {
		let model = { modelState: {} }
		AssessmentAdapter.construct(model, { content: { attempts: 6.9 } })
		expect(model.modelState).toMatchSnapshot()
		expect(model.modelState.attempts).toBe(6)
	})

	test('constructs with legacy score actions', () => {
		let model = { modelState: {} }

		// use the legacy action syntax
		let action = {
			from: 2,
			to: 4,
			page: 5
		}
		AssessmentAdapter.construct(model, { content: { scoreActions: [action] } })
		expect(model.modelState).toMatchObject({
			attempts: Infinity,
			scoreActions: {
				actions: [
					{
						page: 5,
						range: {
							isMaxInclusive: true,
							isMinInclusive: true,
							max: '4',
							min: '2'
						}
					}
				],
				originalActions: [action]
			}
		})
	})

	test('constructs with score actions', () => {
		let model = { modelState: {} }
		let action = {
			for: '[2,4]',
			page: 5
		}
		AssessmentAdapter.construct(model, { content: { scoreActions: [action] } })
		expect(model.modelState).toMatchObject({
			attempts: Infinity,
			scoreActions: {
				actions: [
					{
						page: 5,
						range: {
							isMaxInclusive: true,
							isMinInclusive: true,
							max: '4',
							min: '2'
						}
					}
				],
				originalActions: [action]
			}
		})
	})

	test('exports to json', () => {
		let model = { modelState: {} }
		let action = {
			for: '[2,4]',
			page: 5
		}
		AssessmentAdapter.construct(model, { content: { scoreActions: [action] } })
		expect(model.modelState).toMatchObject({
			attempts: Infinity,
			scoreActions: {
				actions: [
					{
						page: 5,
						range: {
							isMaxInclusive: true,
							isMinInclusive: true,
							max: '4',
							min: '2'
						}
					}
				],
				originalActions: [action]
			}
		})

		let json = { content: {} }
		AssessmentAdapter.toJSON(model, json)

		expect(json).toMatchObject({
			content: {
				attempts: Infinity,
				scoreActions: [
					{
						for: '[2,4]',
						page: 5
					}
				]
			}
		})
	})

	test.skip('clones itself', () => {
		let model = { modelState: {} }
		let model2 = { modelState: {} }
		let action = {
			for: '[2,4]',
			page: 5
		}
		AssessmentAdapter.construct(model, { content: { scoreActions: [action] } })
		expect(model.modelState).toMatchObject({
			attempts: Infinity,
			scoreActions: {
				actions: [
					{
						page: 5,
						range: {
							isMaxInclusive: true,
							isMinInclusive: true,
							max: '4',
							min: '2'
						}
					}
				],
				originalActions: [action]
			}
		})

		let json = { content: {} }
		AssessmentAdapter.clone(model, json)

		expect(model).not.toBe(model2)
		expect(model.modelState).not.toBe(model2.modelState)
		expect(model.modelState).toMatchObject(model2.modelState)
	})
})
