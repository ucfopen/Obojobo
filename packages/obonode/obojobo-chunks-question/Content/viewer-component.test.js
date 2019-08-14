import React from 'react'
import renderer from 'react-test-renderer'

const QuestionContent = require('./viewer-component').default
const mockComponent = props => <div {...props} />

describe('QuestionContent', () => {
	test('QuestionContent component with no children', () => {
		const props = {
			model: {
				modelState: {},
				children: {
					models: []
				}
			},
			moduleData: 'mockModuleData'
		}

		const component = renderer.create(<QuestionContent {...props} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('QuestionContent component with multiple children', () => {
		let key = 0
		const mockChild = {
			getComponentClass: () => mockComponent,
			get: () => key++
		}

		const props = {
			model: {
				modelState: {},
				children: {
					models: [mockChild, mockChild, mockChild]
				}
			},
			moduleData: 'mockModuleData'
		}

		const component = renderer.create(<QuestionContent {...props} />)

		// this incrementing key indicates how many children were added
		expect(key).toBe(2)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('QuestionContent survey component', () => {
		const props = {
			model: {
				modelState: {
					type: 'survey'
				},
				children: {
					models: []
				}
			},
			moduleData: 'mockModuleData'
		}

		const component = renderer.create(<QuestionContent {...props} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
