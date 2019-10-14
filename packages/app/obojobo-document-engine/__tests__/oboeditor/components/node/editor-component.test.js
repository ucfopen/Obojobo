jest.mock('Common', () => ({
	components: {
		modal: {
			SimpleDialog: () => 'MockSimpleDialog'
		}
	},
	util: {
		ModalUtil: {
			hide: jest.fn(),
			show: jest.fn()
		}
	},
	Registry: {
		getItems: funct => {
			return funct({
				values: () => [
					{
						isInsertable: true,
						icon: null,
						name: 'mockItem',
						templateObject: 'mockNode',
						cloneBlankNode: () => ({ type: 'mockNode' })
					}
				]
			})
		}
	}
}))

import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Node from 'src/scripts/oboeditor/components/node/editor-component'

describe('Component Editor Node', () => {
	test('Node builds the expected component', () => {
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => ({})
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component inserts node above', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' })
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('Node component inserts node below', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' })
					},
					nodes: { size: 0 }
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})
})
