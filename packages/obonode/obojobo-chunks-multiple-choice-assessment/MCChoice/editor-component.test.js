import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import MCChoice from './editor-component'

import { Transforms } from 'slate'
jest.mock('slate')
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model.js', () => ({
	models: {
		'mock-id': {
			setId: id => id === 'new-id'
		}
	}
}))

describe('MCChoice Editor Node', () => {
	test('MCChoice component', () => {
		const component = renderer.create(<MCChoice element={{ content: {}, children: [] }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCChoice component correct choice', () => {
		const component = renderer.create(
			<MCChoice element={{ content: { score: 100 }, children: [{}, {}] }} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCChoice component deletes itself', () => {
		const component = mount(<MCChoice element={{ content: { score: 100 }, children: [{}, {}] }} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('MCChoice component edits score', () => {
		const component = mount(
			<MCChoice element={{ content: { score: 0 }, children: [{}, {}] }} editor={null} />
		)
		ReactEditor.findPath.mockReturnValue([0])

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			null,
			{
				content: { score: 100 }
			},
			{ at: [0] }
		)

		const component2 = mount(
			<MCChoice element={{ content: { score: 100 }, children: [{}, {}] }} editor={null} />
		)

		component2
			.find('button')
			.at(1)
			.simulate('click')

		expect(Transforms.setNodes).toHaveBeenCalledWith(
			null,
			{
				content: { score: 0 }
			},
			{ at: [0] }
		)
	})

	test('MCChoice component adds feedback', () => {
		const component = mount(
			<MCChoice element={{ content: { score: 100 }, children: [] }} editor={null} />
		)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('MCChoice component is selected', () => {
		const component = renderer.create(
			<MCChoice
				element={{ content: { score: 100 }, children: [] }}
				editor={{ markUnsaved: jest.fn() }}
				selected
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCChoice component with MoreInfoBox', () => {
		const component = mount(
			<MCChoice
				element={{ content: { score: 100 }, children: [] }}
				editor={{ markUnsaved: jest.fn(), toggleEditable: jest.fn() }}
				selected
			/>
		)

		// Click MoreInfo button
		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
	})

	test('MCChoice component with MoreInfoBox calls duplicates', () => {
		const component = mount(
			<MCChoice
				element={{ content: { score: 100 }, children: [] }}
				editor={{ markUnsaved: jest.fn(), toggleEditable: jest.fn() }}
			/>
		)

		component.instance().duplicateNode()

		expect(ReactEditor.findPath).toHaveBeenCalled()
		expect(Transforms.insertNodes).toHaveBeenCalled()
	})

	test('MCChoice component with MoreInfoBox calls saveId', () => {
		const component = mount(
			<MCChoice
				element={{ content: { score: 100 }, children: [] }}
				editor={{ markUnsaved: jest.fn(), toggleEditable: jest.fn() }}
			/>
		)

		component.instance().saveId('mock-id', 'new-id')
		expect(ReactEditor.findPath).toHaveBeenCalled()
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('MCChoice component calls saveId - same id', () => {
		const component = mount(
			<MCChoice
				element={{ content: { score: 100 }, children: [] }}
				editor={{ markUnsaved: jest.fn(), toggleEditable: jest.fn() }}
			/>
		)

		Transforms.setNodes = jest.fn()
		component.instance().saveId('mock-id', 'mock-id')
		expect(Transforms.setNodes).not.toHaveBeenCalled()
	})

	test('MCChoice component calls saveId - empty id', () => {
		const component = mount(
			<MCChoice
				element={{ content: { score: 100 }, children: [] }}
				editor={{ markUnsaved: jest.fn(), toggleEditable: jest.fn() }}
			/>
		)

		Transforms.setNodes = jest.fn()
		component.instance().saveId('mock-id', '')
		expect(Transforms.setNodes).not.toHaveBeenCalled()
	})

	test('MCChoice component calls saveId - duplicate id', () => {
		const component = mount(
			<MCChoice
				element={{ content: { score: 100 }, children: [] }}
				editor={{ markUnsaved: jest.fn(), toggleEditable: jest.fn() }}
				selected
			/>
		)
		Transforms.setNodes = jest.fn()
		component.instance().saveId('mock-id', 'duplicate-id')
		expect(Transforms.setNodes).not.toHaveBeenCalled()
	})

	test('MCChoice component calls saveContent', () => {
		const component = mount(
			<MCChoice
				element={{ content: { score: 100 }, children: [] }}
				editor={{ markUnsaved: jest.fn(), toggleEditable: jest.fn() }}
				selected
			/>
		)

		component.instance().saveContent('mock-id', 'duplicate-id')
		expect(ReactEditor.findPath).toHaveBeenCalled()
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('MCChoice component calls onClose', () => {
		const toggleEditable = jest.fn()
		const component = mount(
			<MCChoice
				element={{ content: { score: 100 }, children: [] }}
				editor={{ markUnsaved: jest.fn(), toggleEditable: toggleEditable }}
				selected
			/>
		)

		component.instance().onClose()
		expect(toggleEditable).toHaveBeenCalled()
	})
})
