import React from 'react'
import renderer from 'react-test-renderer'

import List from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

require('./viewer') // used to register this oboModel

describe('List', () => {
	test('List component', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.List',
			content: {
				textGroup: [],
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
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('List component with ascending indents', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.List',
			content: {
				textGroup: [
					{
						text: {
							updated: 'One(indent=1)',
							styleList: []
						},
						data: {
							indent: '1'
						}
					},
					{
						text: {
							updated: 'Two(indent=2)',
							styleList: []
						},
						data: {
							indent: '2'
						}
					},
					{
						text: {
							updated: 'Three(indent=3)',
							styleList: []
						},
						data: {
							indent: '3'
						}
					},
					{
						text: {
							updated: 'Four(indent=4)',
							styleList: []
						},
						data: {
							indent: '4'
						}
					},
					{
						text: {
							updated: 'Five(indent=5)',
							styleList: []
						},
						data: {
							indent: '5'
						}
					},
					{
						text: {
							updated: 'Six(indent=6)',
							styleList: []
						},
						data: {
							indent: '6'
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
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('List component with inverse indentation', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.List',
			content: {
				textGroup: [
					{
						text: {
							updated: 'One(indent=1)',
							styleList: []
						},
						data: '3'
					},
					{
						text: {
							updated: 'Two(indent=2)',
							styleList: []
						},
						data: {
							indent: '2'
						}
					},
					{
						text: {
							updated: 'Three(indent=6)',
							styleList: []
						},
						data: {
							indent: '1'
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
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('List component with irregular indentation', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.List',
			content: {
				textGroup: [
					{
						text: {
							updated: 'One(indent=1)',
							styleList: []
						},
						data: null
					},
					{
						text: {
							updated: 'Two(indent=2)',
							styleList: []
						},
						data: {
							indent: '2'
						}
					},
					{
						text: {
							updated: 'Three(indent=6)',
							styleList: []
						},
						data: {
							indent: '6'
						}
					},
					{
						text: {
							updated: 'Four(indent=2)',
							styleList: []
						},
						data: {
							indent: '2'
						}
					},
					{
						text: {
							updated: 'Five(indent=4)',
							styleList: []
						},
						data: {
							indent: '4'
						}
					},
					{
						text: {
							updated: 'Six(indent=3)',
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
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
