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
							value: 'One(indent=1)',
							styleList: []
						},
						data: {
							indent: '1'
						}
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
							value: 'Three(indent=3)',
							styleList: []
						},
						data: {
							indent: '3'
						}
					},
					{
						text: {
							value: 'Four(indent=4)',
							styleList: []
						},
						data: {
							indent: '4'
						}
					},
					{
						text: {
							value: 'Five(indent=5)',
							styleList: []
						},
						data: {
							indent: '5'
						}
					},
					{
						text: {
							value: 'Six(indent=6)',
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
							value: 'One(indent=1)',
							styleList: []
						},
						data: '3'
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
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test.only('List component with different colored texts', () => {
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
							value: 'One(indent=1)',
							styleList: {
								styles: [
									{ type: 'color', start: 0, end: 2, data: { text: '#ddd' } },
									{ type: 'mock-style', start: 4, end: 7, data: { text: '#fff' } }
								]
							}
						},
						data: '3'
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
							styleList: {
								styles: [
									{ type: 'mock-style', start: 6, end: 7, data: { text: '#000' }},
									{ type: 'color', start: 0, end: 4, data: { text: '#c3c3c3' }}
								]
							}
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
})
