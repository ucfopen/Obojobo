import React from 'react'
import renderer from 'react-test-renderer'

import PreTest from '../../../../../../ObojoboDraft/Sections/Assessment/components/pre-test/index'

describe('PreTest', () => {
	test('PreTest component', () => {
		const model = {
			getComponentClass: jest.fn().mockReturnValueOnce('MockComponent')
		}
		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<PreTest model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})
