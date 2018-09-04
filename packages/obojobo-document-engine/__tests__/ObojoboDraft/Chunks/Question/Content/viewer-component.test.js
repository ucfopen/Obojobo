import React from 'react'
import renderer from 'react-test-renderer'

const QuestionContent = require('../../../../../ObojoboDraft/Chunks/Question/Content/viewer-component')
	.default
const mockComponent = props => <div {...props} />

describe('QuestionContent', () => {
	test('QuestionContent component with no children', () => {
		let props = {
			model: {
				children: {
					models: []
				}
			},
			moduleData: 'mockModuleData'
		}

		const component = renderer.create(<QuestionContent {...props} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('QuestionContent component with multiple children', () => {
		let key = 0
		let mockChild = {
			getComponentClass: () => mockComponent,
			get: () => key++
		}

		let props = {
			model: {
				children: {
					models: [mockChild, mockChild, mockChild]
				}
			},
			moduleData: 'mockModuleData'
		}

		const component = renderer.create(<QuestionContent {...props} />)

		// this incrementing key indicates how many children were added
		expect(key).toBe(2)

		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
