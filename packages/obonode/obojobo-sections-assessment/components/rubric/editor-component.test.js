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
				editor={{ selection: [0, 0] }}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Rubric renders with given values', () => {
		const component = renderer.create(
			<Rubric
				element={{
					content: {
						passingAttemptScore: 100,
						passedResult: '$attempt_score',
						failedResult: 0,
						unableToPassResult: null,
						mods: []
					}
				}}
				editor={{ selection: [0, 0] }}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Rubric calls updateNodeFromState when clicking outside the component', () => {
		const thisValue = {
			selfRef: {
				current: {
					contains: jest.fn().mockReturnValueOnce(true)
				}
			},
			updateNodeFromState: jest.fn()
		}

		Rubric.prototype.onDocumentMouseDown.bind(thisValue)({ target: 'mock-target' })
		expect(thisValue.selfRef.current.contains).toHaveBeenCalledWith('mock-target')
		expect(thisValue.updateNodeFromState).not.toHaveBeenCalled()

		thisValue.selfRef.current.contains.mockReturnValueOnce(false)
		Rubric.prototype.onDocumentMouseDown.bind(thisValue)({ target: 'mock-target' })
		expect(thisValue.selfRef.current.contains).toHaveBeenCalledWith('mock-target')
		expect(thisValue.updateNodeFromState).toHaveBeenCalled()
	})

	test('Component adds and removes event listener when mounted, unmount', () => {
		const addSpy = jest.spyOn(document, 'addEventListener')
		const rmSpy = jest.spyOn(document, 'removeEventListener')
		const component = renderer.create(
			<Rubric
				element={{
					content: { unableToPassType: 'set-value', mods: [] }
				}}
			/>
		)
		expect(addSpy).toHaveBeenCalled()
		expect(rmSpy).not.toHaveBeenCalled()

		component.getInstance().componentWillUnmount()
		expect(rmSpy).toHaveBeenCalled()

		addSpy.mockRestore()
		rmSpy.mockRestore()
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
			.simulate('change', { target: { name: 'passingAttemptScore', value: 100 } })
		component
			.find('input')
			.at(2)
			.simulate('blur')

		expect(component.instance().state.passingAttemptScore).toBe(100)
	})

	test('Rubric updates slate state', () => {
		jest.spyOn(Transforms, 'setNodes').mockReturnValue(true)
		const component = mount(
			<Rubric
				element={{
					content: { unableToPassType: 'set-value', mods: [] }
				}}
			/>
		)

		component.instance().updateNodeFromState()

		expect(Transforms.setNodes).toHaveBeenCalledTimes(1)
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
			.simulate('change', { target: { name: 'unableToPassResult', value: '100' } })

		expect(component.instance().state.unableToPassResult).toBe('100')
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
