import React from 'react'
import { mount } from 'enzyme'
import { useEditor, useSelected } from 'slate-react'

import withSlate from './with-slate-wrapper'

jest.mock('slate')
jest.mock('slate-react')

describe('Slate Wrapper Node', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})
	test('Node builds the expected component', () => {
		useEditor.mockReturnValue({})
		useSelected.mockReturnValue(true)

		const Component = withSlate(() => <p>Mock Content</p>)
		const component = mount(<Component />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('Node builds the expected component with no selection', () => {
		useEditor.mockReturnValue({ prevSelection: {} })
		useSelected.mockReturnValue(false)

		const Component = withSlate(() => <p>Mock Content</p>)
		const component = mount(<Component />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})
})
