import OboComponent from './obo-component'
import OboModel from '../../../../__mocks__/_obo-model-with-chunks'
import React from 'react'
import renderer from 'react-test-renderer'
import FocusUtil from '../util/focus-util'

jest.mock('../util/focus-util')

test('OboComponent', () => {
	FocusUtil.getVisuallyFocussedModel.mockReturnValue(null)
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
	FocusUtil.getVisuallyFocussedModel.mockReturnValue({
		get: () => 'mockId'
	})

	OboModel.create({ id: 'testId', type: 'ObojoboDraft.Chunks.Text' })

	const component = renderer.create(
		<OboComponent
			tabIndex={1}
			model={OboModel.models.testId}
			moduleData={{ focusState: {} }}
			tag="pre"
		>
			Test
		</OboComponent>
	)
	const tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})
