import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

import Solution from './editor-component'

import { Transforms } from 'slate'
jest.mock('slate')
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper', 
	() => item => item
)

describe('Solution Editor Node', () => {
	test('Solution component', () => {
		const component = renderer.create(<Solution />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Solution component deletes self', () => {
		const component = mount(
			<Solution element={{ content: {}}}/>
		)

		component.find('button').simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})
})
