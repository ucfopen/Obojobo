import React from 'react'
import renderer from 'react-test-renderer'

import OboComponent from '../../../src/scripts/viewer/components/obo-component'
import OboModel from '../../../__mocks__/_obo-model-with-chunks'

jest.mock('../../../src/scripts/viewer/util/focus-util', () => {
	return { getVisuallyFocussedModel: () => null }
})

test('OboComponent', () => {
	OboModel.create({ id: 'testId', type: 'ObojoboDraft.Chunks.Text' })

	const component = renderer.create(
		<OboComponent
			model={OboModel.models.testId}
			moduleData={{ focusState: {} }}
			someOtherProp="otherProp"
		>
			Test
		</OboComponent>
	)
	const tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('OboComponent tag', () => {
	OboModel.create({ id: 'testId', type: 'ObojoboDraft.Chunks.Text' })

	const component = renderer.create(
		<OboComponent model={OboModel.models.testId} moduleData={{ focusState: {} }} tag="pre">
			Test
		</OboComponent>
	)
	const tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})
