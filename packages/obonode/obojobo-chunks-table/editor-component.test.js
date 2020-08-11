import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Table from './editor-component'

import { Transforms, Node } from 'slate'
jest.mock('slate')
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)

describe('Table Editor Node', () => {
	test('Table component', () => {
		const component = renderer.create(
			<Table element={{ content: { fixedWidth: true } }}/>)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Table component toggles header', () => {
		const component = mount(
			<Table
				selected={true}
				element={{
					content: { header: true, fixedWidth: true },
					children: [{ content: {} }]
				}}
			/>
		)

		Node.children.mockReturnValue([[{ content: {} }, [0]]])

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Table component handles tabbing', () => {
		const component = mount(
			<Table
				selected={true}
				element={{
					content: { header: true, fixedWidth: true },
					children: [{ content: {} }]
				}}
			/>
		)

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
})
