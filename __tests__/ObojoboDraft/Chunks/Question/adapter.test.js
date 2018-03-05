import Common from 'Common'
import QuestionAdapter from '../../../../ObojoboDraft/Chunks/Question/adapter'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Question adapter', () => {
	// @ADD BACK
	it.skip('can be created WITHOUT attributes', () => {
		let model = { modelState: {} }
		QuestionAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	// @ADD BACK
	it.skip('can be constructed WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = {
			content: {
				limit: 2,
				practice: false,
				solution: {
					id: '249138ca-be09-4ab5-b015-3a8107b4c79e',
					type: 'ObojoboDraft.Pages.Page',
					content: {},
					children: [
						{
							id: '7fa8ecca-cdd2-4cb8-ae55-5435db9fb05e',
							type: 'ObojoboDraft.Chunks.Text',
							content: {
								textGroup: [
									{
										text: {
											value: 'this is some example solution text',
											styleList: []
										},
										data: null
									}
								]
							},
							children: []
						}
					]
				}
			}
		}

		QuestionAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	it('can be cloned', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }
		let attrs = {
			content: {
				limit: 2,
				practice: false,
				solution: {
					id: '249138ca-be09-4ab5-b015-3a8107b4c79e',
					type: 'ObojoboDraft.Pages.Page',
					content: {},
					children: [
						{
							id: '7fa8ecca-cdd2-4cb8-ae55-5435db9fb05e',
							type: 'ObojoboDraft.Chunks.Text',
							content: {
								textGroup: [
									{
										text: {
											value: 'this is some example solution text',
											styleList: []
										},
										data: null
									}
								]
							},
							children: []
						}
					]
				}
			}
		}

		QuestionAdapter.construct(a, attrs)
		QuestionAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	it('can be converted to JSON', () => {
		let model = { modelState: {} }
		let json = { content: {} }
		let attrs = {
			content: {
				limit: 2,
				practice: false,
				solution: {
					id: '249138ca-be09-4ab5-b015-3a8107b4c79e',
					type: 'ObojoboDraft.Pages.Page',
					content: {},
					children: [
						{
							id: '7fa8ecca-cdd2-4cb8-ae55-5435db9fb05e',
							type: 'ObojoboDraft.Chunks.Text',
							content: {
								textGroup: [
									{
										text: {
											value: 'this is some example solution text',
											styleList: []
										},
										data: null
									}
								]
							},
							children: []
						}
					]
				}
			}
		}
		QuestionAdapter.construct(model, attrs)
		QuestionAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})
})
