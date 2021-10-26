import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import MCFeedback from './editor-component'

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

describe('MCFeedback Editor Node', () => {
	test('MCFeedback builds the expected component', () => {
		const component = renderer.create(<MCFeedback element={{ content: {} }} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('MCFeedback component deletes itself', () => {
		const component = shallow(<MCFeedback element={{ content: {} }} />)

		component.find('Button').simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})
})
