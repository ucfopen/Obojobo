import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from '../../../../src/scripts/common'

import Node from 'src/scripts/oboeditor/components/node/editor-component'

jest.mock('slate')
jest.mock('slate-react')
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
				element={{}}
				editor={{}}/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component inserts node above', () => {
		const component = mount(
			<Node
				selected={true}
				element={{}}
				editor={{}}/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('Node component inserts node below', () => {
		const component = mount(
			<Node
				selected={true}
				element={{
					content: { width: 'normal' },
				}}
				editor={{}}/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('saveId does nothing if the old and new ids are the same', () => {
		const component = mount(
			<Node
				selected={true}
				element={{
					content: { width: 'normal' },
				}}
				editor={{}}/>
		)
		component.instance().saveId('mock-id', 'mock-id')

		expect(Transforms.setNodes).not.toHaveBeenCalled()
	})

	test('saveId does not allow duplicate nodes', () => {
		const component = mount(
			<Node
				selected={true}
				element={{
					content: { width: 'normal' },
				}}
				editor={{}}/>
		)
		component.instance().saveId('mock-duplicate-id', 'mock-id2')

		expect(Transforms.setNodes).not.toHaveBeenCalled()
	})

	test('saveId updates the node if ids are not the same', () => {
		const component = mount(
			<Node
				selected={true}
				element={{
					content: { width: 'normal' },
				}}
				editor={{}}/>
		)
		component.instance().saveId('mock-id', 'mock-id2')

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('saveId does not allow an empty id', () => {
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
				editor={editor}
			/>
		)
		component.instance().saveId('mock-id', '')

		expect(editor.insertNodeByKey).not.toHaveBeenCalled()
		expect(editor.removeNodeByKey).not.toHaveBeenCalled()
	})

	test('saveContent calls setNodeByKey', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}
   
	test('saveContent calls Transforms.setNodes', () => {
		const component = mount(
			<Node
				selected={true}
				element={{
					content: { width: 'normal' },
				}}
				editor={{}}/>
		)
		component.instance().saveContent({}, {})

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('deleteNode calls Transforms.removeNodes', () => {
		const component = mount(
			<Node
				selected={true}
				element={{
					content: { width: 'normal' },
				}}
				editor={{}}/>
		)
		component.instance().deleteNode()

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('duplicateNode calls Transforms.insertNodes', () => {
		const component = mount(
			<Node
				selected={true}
				element={{
					content: { width: 'normal' },
				}}
				editor={{}}/>
		)
		ReactEditor.findPath.mockReturnValue([0])

		component.instance().duplicateNode()

		expect(Transforms.insertNodes).toHaveBeenCalled()
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
				editor={editor}
			/>
		)
		component.instance().onOpen()
		component.instance().onClose()

		expect(editor.toggleEditable).toHaveBeenCalledTimes(2)
	})
})
