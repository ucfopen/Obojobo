import React from 'react'
import renderer from 'react-test-renderer'

import Table from '../../../../ObojoboDraft/Chunks/Table/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Table', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Chunks.Table',
		content: {
			header: true,
			textGroup: {
				numRows: 2,
				numCols: 2,
				textGroup: [
					{
						text: {
							value: '1'
						}
					},
					{
						text: {
							value: '2'
						}
					},
					{
						text: {
							value: '3'
						}
					},
					{
						text: {
							value: '4'
						}
					}
				]
			}
		}
	})

	let moduleData = {
		focusState: {}
	}

	test('Table component', () => {
		const component = renderer.create(<Table model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
