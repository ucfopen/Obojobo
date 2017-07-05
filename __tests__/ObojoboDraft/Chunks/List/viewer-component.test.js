import React from 'react'
import renderer from 'react-test-renderer'

import List from '../../../../ObojoboDraft/Chunks/List/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('List', () => {
	let moduleData = {
		focusState: {}
	}

	test('List component', () => {
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.List',
			content: {
				textGroup: [
					{
						text: {
							value: 'One(indent=1)',
							styleList: []
						},
						data: null
					},
					{
						text: {
							value: 'Two(indent=2)',
							styleList: []
						},
						data: {
							indent: '2'
						}
					},
					{
						text: {
							value: 'Three(indent=6)',
							styleList: []
						},
						data: {
							indent: '6'
						}
					},
					{
						text: {
							value: 'Four(indent=2)',
							styleList: []
						},
						data: {
							indent: '2'
						}
					},
					{
						text: {
							value: 'Five(indent=4)',
							styleList: []
						},
						data: {
							indent: '4'
						}
					},
					{
						text: {
							value: 'Six(indent=3)',
							styleList: []
						},
						data: {
							indent: '3'
						}
					}
				],
				listStyles: {
					type: 'ordered',
					indents: {
						'2': {
							type: 'unordered',
							bulletStyle: 'square'
						},
						'4': {
							type: 'ordered',
							start: '10',
							bulletStyle: 'upper-alpha'
						}
					}
				}
			}
		})

		const component = renderer.create(<List model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
