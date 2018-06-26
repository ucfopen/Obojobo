import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import PreTest from '../../../../../../ObojoboDraft/Sections/Assessment/components/pre-test/index'

describe('PreTest', () => {
	test('PreTest component', () => {
		let model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		let moduleData = {
			focusState: {}
		}

		let component = renderer.create(<PreTest model={model} moduleData={moduleData} />)
		let tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
