import React from 'react'
import renderer from 'react-test-renderer'

import HTML from '../../../../ObojoboDraft/Chunks/HTML/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('HTML', () => {
	test('HTML component', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.HTML',
			content: {
				html: '<marquee>Example text</marquee>'
			}
		})

		const component = renderer.create(<HTML model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('HTML component with equation', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.HTML',
			content: {
				html: '<div class="latex">(x^2 + y^2 = z^2)</div>'
			}
		})

		const component = renderer.create(<HTML model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
