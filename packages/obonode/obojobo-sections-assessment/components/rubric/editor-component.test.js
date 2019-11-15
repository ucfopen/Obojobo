import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Rubric from './editor-component'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

describe('Rubric editor', () => {
	test('Rubric renders', () => {
		const component = renderer.create(
			<Rubric
				node={{
					data: {
						get: () => {
							return {
								mods: [
									{ reward: 3, attemptCondition: '$last_attempt' },
									{ reward: 3, attemptCondition: '1' },
									{ reward: -3, attemptCondition: '[1,$last_attempt' },
									{ reward: -3, attemptCondition: '[$last_attempt,5]' }
								]
							}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Rubric changes type', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Rubric
				node={{
					data: {
						get: () => {
							return { mods: [] }
						}
					}
				}}
				editor={editor}
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

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('Rubric changes pass score', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Rubric
				node={{
					data: {
						get: () => {
							return { mods: [] }
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('input')
			.at(2)
			.simulate('click', { stopPropagation: jest.fn() })
		component
			.find('input')
			.at(2)
			.simulate('change', { target: { value: 100 } })

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('Rubric changes pass result', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Rubric
				node={{
					data: {
						get: () => {
							return { passedType: 'set-value', mods: [] }
						}
					}
				}}
				editor={editor}
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

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(2)
	})

	test('Rubric changes failed result', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Rubric
				node={{
					data: {
						get: () => {
							return { failedType: 'set-value', mods: [] }
						}
					}
				}}
				editor={editor}
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

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(2)
	})

	test('Rubric changes unable to pass result', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Rubric
				node={{
					data: {
						get: () => {
							return { unableToPassType: 'set-value', mods: [] }
						}
					}
				}}
				editor={editor}
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

		expect(editor.setNodeByKey).toHaveBeenCalledTimes(2)
	})

	test('Rubric opens mod dialog', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Rubric
				node={{
					data: {
						get: () => {
							return { unableToPassType: 'set-value', mods: [] }
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('Rubric changes mods', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Rubric
				node={{
					data: {
						get: () => {
							return { unableToPassType: 'set-value', mods: [] }
						}
					}
				}}
				editor={editor}
			/>
		)

		component.instance().changeMods({ mods: [] })

		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
