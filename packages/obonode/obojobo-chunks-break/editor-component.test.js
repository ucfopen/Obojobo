import React from 'react'
import { mount } from 'enzyme'
import { Transforms } from 'slate'
import renderer from 'react-test-renderer'

import Break from './editor-component'

jest.mock('slate')
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('Break Editor Node', () => {
	test('Node builds the expected component', () => {
		const component = renderer.create(<Break element={{ content: {} }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component toggles size to large', () => {
		const editor = {
			children: [{ content: { width: 'normal' } }]
		}

		const component = mount(
			<Break selected={true} element={{ content: { width: 'normal' } }} editor={editor} />
		)

		component.find('button').simulate('click') // toggle to large

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Node component handles tabbing', () => {
		const editor = {
			children: [{ content: { width: 'normal' } }]
		}

		const component = mount(
			<Break selected={true} element={{ content: { width: 'normal' } }} editor={editor} />
		)

		component.find('button').simulate('keyDown', { key: 'k' })

		component.find('button').simulate('keyDown', { key: 'Tab' })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Node component toggles size to normal', () => {
		const editor = {
			children: [{ content: { width: 'large' } }]
		}

		const component = mount(
			<Break selected={true} element={{ content: { width: 'large' } }} editor={editor} />
		)

		component.find('button').simulate('click') // toggle to normal

		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
