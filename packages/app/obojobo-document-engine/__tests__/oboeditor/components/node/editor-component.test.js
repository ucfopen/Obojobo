import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Common from '../../../../src/scripts/common'

import Node from 'src/scripts/oboeditor/components/node/editor-component'

jest.mock('Common', () => ({
	models: {
		OboModel: {}
	},
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
						insertJSON: { type: 'mockType' },
						cloneBlankNode: () => ({ type: 'mockNode' })
					}
				]
			})
		},
		insertableItems: [
			{
				isInsertable: true,
				icon: null,
				name: 'mockItem',
				templateObject: 'mockNode',
				insertJSON: { type: 'mockType' },
				cloneBlankNode: () => ({ type: 'mockNode' })
			}
		]
	}
}))

describe('Component Editor Node', () => {
	beforeEach(() => {
		jest.clearAllMocks()

		Common.models.OboModel.models = {
			'mock-id': {
				setId: () => true
			},
			'mock-duplicate-id': {
				setId: () => false
			}
		}

		Common.models.OboModel.create = jest.fn().mockReturnValue({ setId: () => true })
	})
	test('Node builds the expected component', () => {
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => ({})
					}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					})
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
						get: () => ({ width: 'normal' }),
						toJSON: () => ({})
					}
				}}
				parent={{
					key: 'mock-key',
					getPath: () => ({ get: jest.fn() })
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
						get: () => ({ width: 'normal' }),
						toJSON: () => ({})
					},
					nodes: { size: 0 }
				}}
				parent={{
					key: 'mock-key',
					getPath: () => ({ get: jest.fn() })
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

	test('saveId does nothing if the old and new ids are the same', () => {
		const editor = {
			insertNodeByKey: jest.fn(),
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' }),
						toJSON: () => ({})
					},
					nodes: { size: 0 }
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					})
				}}
				editor={editor}
			/>
		)
		component.instance().saveId('mock-id', 'mock-id')

		expect(editor.insertNodeByKey).not.toHaveBeenCalled()
		expect(editor.removeNodeByKey).not.toHaveBeenCalled()
	})

	test('saveId does not allow duplicate nodes', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}
		editor.insertNodeByKey = jest.fn().mockReturnValue(editor)

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' }),
						toJSON: () => ({})
					},
					nodes: { size: 0 },
					toJSON: () => ({ object: 'block', type: 'mock-node' })
				}}
				parent={{
					key: 'mock-key',
					getPath: () => ({ get: jest.fn() })
				}}
				editor={editor}
			/>
		)
		component.instance().saveId('mock-duplicate-id', 'mock-id2')

		expect(editor.insertNodeByKey).not.toHaveBeenCalled()
		expect(editor.removeNodeByKey).not.toHaveBeenCalled()
	})

	test('saveId adds and removes the node if ids are not the same', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}
		editor.insertNodeByKey = jest.fn().mockReturnValue(editor)

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' }),
						toJSON: () => ({})
					},
					nodes: { size: 0 },
					toJSON: () => ({ object: 'block', type: 'mock-node' })
				}}
				parent={{
					key: 'mock-key',
					getPath: () => ({ get: jest.fn() })
				}}
				editor={editor}
			/>
		)
		component.instance().saveId('mock-id', 'mock-id2')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('saveContent calls setNodeByKey', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' }),
						toJSON: () => ({})
					},
					nodes: { size: 0 },
					toJSON: () => ({})
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					})
				}}
				editor={editor}
			/>
		)
		component.instance().saveContent({}, {})

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('deleteNode calls removeNodeByKey', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' }),
						toJSON: () => ({})
					},
					nodes: { size: 0 },
					toJSON: () => ({})
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					})
				}}
				editor={editor}
			/>
		)
		component.instance().deleteNode()

		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('duplicateNode calls insertNodeByKey', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' }),
						toJSON: () => ({})
					},
					nodes: { size: 0 },
					toJSON: () => ({ object: 'block', type: 'mock-node' })
				}}
				parent={{
					key: 'mock-key',
					getPath: () => ({ get: jest.fn() })
				}}
				editor={editor}
			/>
		)
		component.instance().duplicateNode()

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('Node component move node up/down', () => {
		const editor = {
			moveNodeByKey: jest.fn()
		}

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' }),
						toJSON: () => ({})
					}
				}}
				parent={{
					key: 'mock-key',
					getPath: () => ({ get: jest.fn() })
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component.instance().moveNode(0)

		expect(editor.moveNodeByKey).toHaveBeenCalled()

		expect(tree).toMatchSnapshot()
	})

	test('onOpen and onClose call toggleEditable', () => {
		const editor = {
			toggleEditable: jest.fn()
		}

		const component = mount(
			<Node
				isSelected={true}
				node={{
					data: {
						get: () => ({ width: 'normal' }),
						toJSON: () => ({})
					},
					nodes: { size: 0 }
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					})
				}}
				editor={editor}
			/>
		)
		component.instance().onOpen()
		component.instance().onClose()

		expect(editor.toggleEditable).toHaveBeenCalledTimes(2)
	})
})
