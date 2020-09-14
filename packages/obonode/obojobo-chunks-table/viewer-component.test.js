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
				fixedWidth: true,
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
				fixedWidth: true,
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
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<Table model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Table component with flexible cell sizes', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Table',
			content: {
				header: true,
				fixedWidth: false,
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
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<Table model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('When the scrollbar is showing the state changes', () => {
		const thisValue = {
			containerRef: {
				current: {
					scrollWidth: 0,
					clientWidth: 0
				}
			},
			setState: jest.fn()
		}

		// scrollWidth < clientWidth
		thisValue.containerRef.current.scrollWidth = 10
		thisValue.containerRef.current.clientWidth = 20

		Table.prototype.componentDidMount.bind(thisValue)()
		expect(thisValue.setState).not.toHaveBeenCalled()

		// scrollWidth === clientWidth
		thisValue.containerRef.current.scrollWidth = 15
		thisValue.containerRef.current.clientWidth = 15

		Table.prototype.componentDidMount.bind(thisValue)()
		expect(thisValue.setState).not.toHaveBeenCalled()

		// scrollWidth > clientWidth
		thisValue.containerRef.current.scrollWidth = 20
		thisValue.containerRef.current.clientWidth = 10

		Table.prototype.componentDidMount.bind(thisValue)()
		expect(thisValue.setState).toHaveBeenCalledWith({
			isShowingScrollbar: true
		})
	})
})
