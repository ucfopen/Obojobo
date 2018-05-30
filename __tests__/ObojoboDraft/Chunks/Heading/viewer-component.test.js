import React from 'react'
import renderer from 'react-test-renderer'

import Heading from '../../../../ObojoboDraft/Chunks/Heading/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('Heading', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Chunks.Heading',
		content: {
			headingLevel: 2,
			textGroup: [
				{
					text: {
						value: 'Example Text'
					}
				}
			]
		}
	})

	let moduleData = {
		focusState: {}
	}

	test('Heading component', () => {
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Heading',
			content: {
				headingLevel: 1,
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				]
			}
		})

		const component = renderer.create(<Heading model={model} moduleData={moduleData} />)

		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Heading component level 2', () => {
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Heading',
			content: {
				headingLevel: 2,
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				]
			}
		})

		const component = renderer.create(<Heading model={model} moduleData={moduleData} />)

		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Heading component level 3', () => {
		let model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Heading',
			content: {
				headingLevel: 3,
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				]
			}
		})

		const component = renderer.create(<Heading model={model} moduleData={moduleData} />)

		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
