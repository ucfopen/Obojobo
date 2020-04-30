/* eslint-disable no-undefined */
import React from 'react'
import { mount } from 'enzyme'
import { Transforms } from 'slate'
import renderer from 'react-test-renderer'

import ActionButton from './editor-component'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

jest.mock('slate')
jest.mock('slate-react')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('ActionButton Editor Node', () => {
	let nodeData

	beforeEach(() => {
		nodeData = {
			content: {
				actions: [
					{
						type: 'mockType',
						value: 'mockValue'
					}
				],
				triggers: [
					{
						type: 'onClick',
						actions: [
							{ type: 'nav:goto', value: {} },
							{ type: 'nav:prev', value: {} },
							{ type: 'nav:next', value: {} },
							{ type: 'nav:openExternalLink', value: {} },
							{ type: 'nav:lock', value: {} },
							{ type: 'nav:unlock', value: {} },
							{ type: 'nav:toggle', value: {} },
							{ type: 'nav:close', value: {} },
							{ type: 'nav:open', value: {} },
							{ type: 'assessment:startAttempt', value: {} },
							{ type: 'assessment:endAttempt', value: {} },
							{ type: 'viewer:alert', value: {} },
							{ type: 'viewer:scrollToTop', value: {} },
							{ type: 'focus:component', value: {} }
						]
					}
				]
			}
		}
	})

	test('builds the expected component', () => {
		const component = renderer.create(<ActionButton element={nodeData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('builds the expected component when selected', () => {
		const component = renderer.create(<ActionButton element={nodeData} selected={true} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		// make sure node recieves props since we're mocking it
		expect(component.root.find(Node).props).toMatchSnapshot()
	})

	test('builds the expected component (with no onClickAction)', () => {
		nodeData.content.triggers = []
		const component = renderer.create(<ActionButton element={nodeData} selected={true} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		// make sure node recieves props since we're mocking it
		expect(component.root.find(Node).props).toMatchSnapshot()
	})

	test('opens modal', () => {
		const component = mount(<ActionButton element={nodeData} selected={true} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('closes modal', () => {
		const editor = {
			children: [nodeData]
		}
		const component = mount(<ActionButton element={nodeData} selected={true} editor={editor} />)

		component.instance().closeModal({
			triggers: {
				mockNewTrigger: {
					type: 'mockNewTrigger',
					actions: [
						{
							type: 'mockNewAction'
						}
					]
				}
			}
		})

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			editor,
			{
				content: {
					actions: [
						{
							type: 'mockType',
							value: 'mockValue'
						}
					],
					triggers: [
						{
							type: 'mockNewTrigger',
							actions: [
								{
									type: 'mockNewAction'
								}
							]
						}
					]
				}
			},
			{ at: undefined }
		)
	})
})
