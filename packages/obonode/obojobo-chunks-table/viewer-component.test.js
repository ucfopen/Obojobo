import React from 'react'
import renderer from 'react-test-renderer'

import Table from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

require('./viewer') // used to register this oboModel

describe('Table', () => {
	test('Table component', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Table',
			content: {
				header: true,
				textGroup: {
					numRows: 2,
					numCols: 2,
					caption: {
						text: {
							value: 'caption',
							styleList: []
						}
					},
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
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<Table model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Table component without header', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Table',
			content: {
				header: false,
				textGroup: {
					numRows: 2,
					numCols: 2,
					caption: {
						text: {
							value: 'caption',
							styleList: []
						}
					},
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
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<Table model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
