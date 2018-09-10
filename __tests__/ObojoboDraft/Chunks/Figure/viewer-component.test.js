import React from 'react'
import renderer from 'react-test-renderer'

import Figure from '../../../../ObojoboDraft/Chunks/Figure/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Figure', () => {
	test('Figure component', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Figure',
			content: {
				alt: 'Alt Text',
				url: 'www.example.com/img.jpg',
				size: 'custom',
				width: '500',
				height: '400',
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				]
			}
		})

		const component = renderer.create(<Figure model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Figure component with no textGroup', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Figure',
			content: {
				alt: 'Alt Text',
				url: 'www.example.com/img.jpg',
				size: 'custom',
				width: '500',
				height: '400'
			}
		})
		const component = renderer.create(<Figure model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
