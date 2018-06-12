jest.mock('react-dom')

import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'

import IFrame from '../../../../ObojoboDraft/Chunks/IFrame/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

describe('IFrame', () => {
	let model = OboModel.create({
		id: 'id',
		type: 'ObojoboDraft.Chunks.IFrame',
		content: {
			src: 'http://www.example.com'
		}
	})

	let moduleData = {
		focusState: {},
		mediaState: {
			shown: {},
			zoomById: {},
			sizeById: {}
		}
	}

	ReactDOM.findDOMNode = jest.fn(() => {
		return {
			getBoundingClientRect: () => {
				return {
					width: 500
				}
			}
		}
	})
	window.getComputedStyle = jest.fn(() => {
		return {
			getPropertyValue: () => 20
		}
	})

	test('IFrame component', () => {
		const component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
