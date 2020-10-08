import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Rubric from './editor-component'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
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

	test('Rubric renders', () => {
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
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Rubric changes type', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const component = mount(
			<Rubric
				element={{
					content: { mods: [] }
				}}
			/>
		)
		component
			.find('input')
			.at(0)
			.simulate('click', { stopPropagation: jest.fn() })

		component
			.find('input')
			.at(1)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('input')
			.at(1)
			.simulate('change', { target: { value: 'pass-fail' } })

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Rubric changes pass score', () => {
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

		component
			.find('input')
			.at(2)
			.simulate('focus')
		component
			.find('input')
			.at(2)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('input')
			.at(2)
			.simulate('change', { target: { value: 100 } })
		component
			.find('input')
			.at(2)
			.simulate('blur')

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Rubric changes pass result', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const component = mount(
			<Rubric
				element={{
					content: { passedType: 'set-value', mods: [] }
				}}
			/>
		)

		component
			.find('select')
			.at(0)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: '$attempt_score' } })

		component
			.find('input')
			.at(3)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('input')
			.at(3)
			.simulate('change', { target: { value: 100 } })

		expect(Transforms.setNodes).toHaveBeenCalledTimes(2)
	})

	test('Rubric changes failed result', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const component = mount(
			<Rubric
				element={{
					content: { failedType: 'set-value', mods: [] }
				}}
			/>
		)

		component
			.find('select')
			.at(1)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('select')
			.at(1)
			.simulate('change', { target: { value: '$attempt_score' } })

		component
			.find('input')
			.at(4)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('input')
			.at(4)
			.simulate('change', { target: { value: 100 } })

		expect(Transforms.setNodes).toHaveBeenCalledTimes(2)
	})

	test('Rubric changes unable to pass result', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const component = mount(
			<Rubric
				element={{
					content: { unableToPassType: 'set-value', mods: [] }
				}}
			/>
		)

		component
			.find('select')
			.at(2)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('select')
			.at(2)
			.simulate('change', { target: { value: '$highest_attempt_score' } })

		component
			.find('input')
			.at(5)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('input')
			.at(5)
			.simulate('change', { target: { value: 100 } })

		expect(Transforms.setNodes).toHaveBeenCalledTimes(2)
	})

	test('Rubric opens mod dialog', () => {
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
					]
				}}
			/>
		)

		ReactEditor.findPath.mockReturnValueOnce([0, 0])

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('Rubric changes mods', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const component = mount(
			<Rubric
				element={{
					content: { unableToPassType: 'set-value', mods: [] }
				}}
			/>
		)

		component.instance().changeMods({ mods: [] })

		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
