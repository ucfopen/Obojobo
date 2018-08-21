import { shallow } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import EditorNav from '../../../src/scripts/oboeditor/components/editor-nav'

describe('EditorNav', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('EditorNav component', () => {
		EditorUtil.getOrderedList.mockReturnValueOnce([])
		let props = {
			navState: {}
		}
		const component = renderer.create(<EditorNav {...props} />)
		let tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})
