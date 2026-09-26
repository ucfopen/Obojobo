/* eslint-disable no-undefined */
import React from 'react'
import { mount } from 'enzyme'
import { Transforms } from 'slate'
import renderer from 'react-test-renderer'

import ActionButton from './editor-component'
import ActionButtonEditorAction from './action-button-editor-action'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/freeze-unfreeze-editor')
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
		jest.clearAllMocks()
		nodeData = {
			content: {
				actions: [
					{
						type: 'mockType',
						updated: 'mockValue'
					}
				],
				triggers: [
					{
						type: 'onClick',
						actions: [
							{ type: 'nav:goto', updated: {} },
							{ type: 'nav:prev', updated: {} },
							{ type: 'nav:next', updated: {} },
							{ type: 'nav:openExternalLink', updated: {} },
							{ type: 'nav:lock', updated: {} },
							{ type: 'nav:unlock', updated: {} },
							{ type: 'nav:toggle', updated: {} },
							{ type: 'nav:close', updated: {} },
							{ type: 'nav:open', updated: {} },
							{ type: 'assessment:startAttempt', updated: {} },
							{ type: 'assessment:endAttempt', updated: {} },
							{ type: 'viewer:alert', updated: {} },
							{ type: 'viewer:scrollToTop', updated: {} },
							{ type: 'focus:component', updated: {} }
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

		// make sure node receives props since we're mocking it
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

	test('handles tabbing', () => {
		const component = mount(<ActionButton element={nodeData} selected={true} />)

		component
			.find('button')
			.at(0)
			.simulate('keyDown', { key: 'k' })

		component
			.find('button')
			.at(0)
			.simulate('keyDown', { key: 'Tab' })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('closes modal and saves', () => {
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
							updated: 'mockValue'
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

	test('closes modal without saving', () => {
		const editor = {
			children: [nodeData]
		}
		const component = mount(<ActionButton element={nodeData} selected={true} editor={editor} />)

		component.instance().closeModal()

		expect(Transforms.setNodes).not.toHaveBeenCalled()
	})
})

test('Action Button Editor displays id for nav:goto trigger', () => {
	const type = 'nav:goto'
	const updated = { id: 'mockId' }

	const component = mount(<ActionButtonEditorAction type={type} updated={updated} />)
	expect(component.find('span').html()).toEqual(
		'<span>Go to mockId (Ignore Navigation Lock)</span>'
	)
})

test('Action Button Editor displays empty id for nav:goto trigger', () => {
	const type = 'nav:goto'
	const updated = { id: '' }

	const component = mount(<ActionButtonEditorAction type={type} updated={updated} />)
	expect(component.find('span').html()).toEqual('<span>Go to ""</span>')
})

test('Action Button Editor displays id for nav:openExternalLink trigger', () => {
	const type = 'nav:openExternalLink'
	const updated = { url: 'mockURL' }

	const component = mount(<ActionButtonEditorAction type={type} updated={updated} />)
	expect(component.find('span').html()).toEqual('<span>Open mockURL</span>')
})

test('Action Button Editor displays empty id for nav:openExternalLink trigger', () => {
	const type = 'nav:openExternalLink'
	const updated = { url: '' }

	const component = mount(<ActionButtonEditorAction type={type} updated={updated} />)
	expect(component.find('span').html()).toEqual('<span>Open ""</span>')
})
