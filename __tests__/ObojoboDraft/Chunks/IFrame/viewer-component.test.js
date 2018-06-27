jest.mock('react-dom')

import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { shallow, mount, unmount } from 'enzyme'

import IFrame from '../../../../ObojoboDraft/Chunks/IFrame/viewer-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import Dispatcher from '../../../../src/scripts/common/flux/dispatcher'

describe('IFrame', () => {
	let model
	let moduleData

	beforeEach(() => {
		model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.IFrame',
			content: {
				src: 'http://www.example.com'
			}
		})

		moduleData = {
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
	})

	test('IFrame component', () => {
		const component = renderer.create(<IFrame model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('IFrame sets state when "viewer:contentAreaResized" is fired', () => {
		const component = shallow(<IFrame model={model} moduleData={moduleData} />)

		component.instance().getMeasuredDimensions = jest.fn()
		component.instance().getMeasuredDimensions.mockReturnValueOnce({
			width: 'mock-width',
			padding: 'mock-padding'
		})

		Dispatcher.trigger('viewer:contentAreaResized')

		expect(component.instance().state).toEqual({
			actualWidth: 'mock-width',
			padding: 'mock-padding'
		})
	})

	test('onClick terminates if clicked item was not an MCChoice', () => {
		const moduleData = {}
		const parent = OboModel.create(questionJSON)
		const model = parent.children.models[0]
		const event = {
			target: 'mockTarget'
		}

		// mock for sortedIds() (called during componentOnMount())
		QuestionUtil.getData.mockReturnValueOnce(true)

		// DOMUtil tries to find the clicked target
		DOMUtil.findParentWithAttr.mockReturnValueOnce(null)

		const component = shallow(
			<MCAssessment model={model} moduleData={moduleData} mode="assessment" />
		)
		component.instance().onClick(event)

		expect(DOMUtil.findParentWithAttr).toHaveBeenCalledWith(
			'mockTarget',
			'data-type',
			MCCHOICE_NODE_TYPE
		)
	})
})
