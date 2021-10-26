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
})
