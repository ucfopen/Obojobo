import React from 'react'
import renderer from 'react-test-renderer'

import Text from '../../../../ObojoboDraft/Chunks/Text/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Text', () => {
	test('Text component', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Text',
			content: {
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				]
			}
		})
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<Text model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
