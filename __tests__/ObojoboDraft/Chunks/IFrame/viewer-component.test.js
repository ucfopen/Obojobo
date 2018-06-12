jest.mock('react-dom')

import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'

import IFrame from '../../../../ObojoboDraft/Chunks/IFrame/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'

// const possibleModelStateValues = {
// 	type: [undefined, 'webpage', 'media'],
// 	newWindow: [undefined, true, false],
// 	border: [undefined, true, false],
// 	fit: [undefined, 'scroll', 'scale'],
// 	src: [undefined, 'mocked-src'],
// 	width: [undefined, 500],
// 	height: [undefined, 400],
// 	zoom: [undefined, 0.5, 1, 2],
// 	newWindowSrc: [undefined, 'mocked-new-window-src'],
// 	autoload: [undefined, true, false],
// 	title: [undefined, 'mocked-title'],
// 	controls: [
// 		undefined,
// 		['reload'],
// 		['expand'],
// 		['zoom'],
// 		['reload', 'expand'],
// 		['reload', 'zoom'],
// 		['zoom', 'expand'],
// 		['reload', 'zoom', 'expand']
// 	],
// 	expandedSize: [undefined, 'full', 'restricted']
// }

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
