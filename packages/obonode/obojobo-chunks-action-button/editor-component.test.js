/* eslint-disable no-undefined */
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import ActionButton from './editor-component'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import Node from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'

jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component', () => {
	return props => <div>{props.children}</div>
})

const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

describe('ActionButton Editor Node', () => {
	let nodeData

	beforeEach(() => {
		nodeData = {
			data: {
				get: () => ({
					actions: [
						{
							type: 'mockType',
							value: 'mockValue'
						}
					],
					triggers:[{
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
					}]
				}),
				toJSON: () => ({})
			}
		}
	})

	test('builds the expected component', () => {
		const component = renderer.create(<ActionButton node={nodeData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('builds the expected component when selected', () => {
		const component = renderer.create(
			<ActionButton node={nodeData} isSelected={true} isFocused={true} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		// make sure node recieves props since we're mocking it
		expect(component.root.find(Node).props).toMatchSnapshot()
	})

	test('opens modal', () => {
		const component = mount(
			<ActionButton node={nodeData} isSelected={true} isFocused={true} />
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('closes modal', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}
		const component = mount(
			<ActionButton node={nodeData} isSelected={true} isFocused={true} editor={editor}/>
		)

		component.instance().closeModal()

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

})
