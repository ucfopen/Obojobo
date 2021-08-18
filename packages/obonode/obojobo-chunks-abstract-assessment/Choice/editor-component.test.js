import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Choice from './editor-component'

import { Transforms } from 'slate'
jest.mock('slate')
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)

describe('Choice Editor Node', () => {
	test('Choice component', () => {
		const component = renderer.create(<Choice element={{ content: {}, children: [] }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Choice component correct choice', () => {
		const component = renderer.create(
			<Choice element={{ content: { score: 100 }, children: [{}, {}] }} />
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Choice component deletes itself', () => {
		const component = mount(<Choice element={{ content: { score: 100 }, children: [{}, {}] }} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('Choice component edits score', () => {
		const component = mount(
			<Choice element={{ content: { score: 0 }, children: [{}, {}] }} editor={null} />
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
			<Choice element={{ content: { score: 100 }, children: [{}, {}] }} editor={null} />
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

	test('Choice component adds feedback', () => {
		const component = mount(
			<Choice element={{ content: { score: 100 }, children: [] }} editor={null} />
		)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})
})
