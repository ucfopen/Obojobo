import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import Feedback from './editor-component'

import { Transforms } from 'slate'
jest.mock('slate')
jest.mock('slate-react')
jest.mock('obojobo-document-engine/src/scripts/common', () => ({
	components: {
		// eslint-disable-next-line react/display-name
		Button: props => <button {...props}>{props.children}</button>
	}
}))
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper', 
	() => item => item
)

describe('Feedback Editor Node', () => {
	test('Feedback builds the expected component', () => {
		const component = renderer.create(
			<Feedback element={{ content: {} }}/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Feedback component deletes itself', () => {
		const component = shallow(
			<Feedback element={{ content: {} }}/>
		)

		component.find('Button').simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})
})
