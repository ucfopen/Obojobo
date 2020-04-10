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
			<Table/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Table component toggles header', () => {
		const component = mount(
			<Table 
				selected={true} 
				element={{ 
					content: { header: true },
					children: [{ content: {} }]
				}}/>
		)

		Node.children.mockReturnValue([
			[{ content: {} }, [0]]
		])

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
