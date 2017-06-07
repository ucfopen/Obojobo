import React from 'react'
import renderer from 'react-test-renderer'

import OboComponent from '../../../src/scripts/common/components/obo-component'
import OboModel from '../../../src/scripts/common/models/obo-model'
import FocusUtil from '../../../src/scripts/common/util/focus-util'

jest.mock('../../../src/scripts/common/models/obo-model', () => {
	return require('../../../__mocks__/obo-model-mock').default;
})

jest.mock('../../../src/scripts/common/util/focus-util', () => {
	return {
		getFocussedComponent: () => null
	}
})


test('OboComponent', () => {
	OboModel.__create({ id:'testId', type:'test', adapter:{} })

	const component = renderer.create(
		<OboComponent
			model={OboModel.models.testId}
			moduleData={{focusState:{}}}
		>
			Test
		</OboComponent>
	)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('OboComponent tag', () => {
	OboModel.__create({ id:'testId', type:'test', adapter:{} })

	const component = renderer.create(
		<OboComponent
			model={OboModel.models.testId}
			moduleData={{focusState:{}}}
			tag='pre'
		>
			Test
		</OboComponent>
	)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})