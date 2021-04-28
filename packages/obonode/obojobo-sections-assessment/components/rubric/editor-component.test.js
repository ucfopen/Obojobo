import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Rubric from './editor-component'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import { Transforms } from 'slate'
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

describe('Rubric editor', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('Rubric section renders', () => {
		const component = renderer.create(
			<Rubric
				element={{
					content: {
						mods: [
							{ reward: 3, attemptCondition: '$last_attempt' },
							{ reward: 3, attemptCondition: '1' },
							{ reward: -3, attemptCondition: '[1,$last_attempt' },
							{ reward: -3, attemptCondition: '[$last_attempt,5]' }
						]
					}
				}}
				editor={{ selection: [0, 0] }}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Rubric section opens rubric modal dialog', () => {
		const component = mount(
			<Rubric
				element={{
					content: { unableToPassType: 'set-value', mods: [] }
				}}
				editor={{
					children: [
						{
							type: ASSESSMENT_NODE,
							content: { attempts: 3 },
							children: [
								{
									type: RUBRIC_NODE,
									content: { unableToPassType: 'set-value', mods: [] },
									children: []
								}
							]
						}
					],
					toggleEditable: jest.fn()
				}}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('Rubric section correctly sets new rubric slate state', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)

		const component = mount(
			<Rubric
				element={{
					content: { mods: [] }
				}}
				editor={{
					toggleEditable: jest.fn()
				}}
			/>
		)

		component.instance().changeRubricProperties({ mods: [{}, {}, {}] })

		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
