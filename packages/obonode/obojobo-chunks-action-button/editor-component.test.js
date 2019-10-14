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
						actions: []
					}]
				}),
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

	test.skip('displays actions when selected', () => {
	})

	test.skip('opens modal', () => {
	})

	test.skip('closes modal', () => {
	})

})
