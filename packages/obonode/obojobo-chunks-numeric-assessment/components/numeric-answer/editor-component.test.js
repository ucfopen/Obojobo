import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import NumericAnswer from './editor-component'

describe('NumericAnswer Editor Node', () => {
	test('NumericAnswer builds the expected component with score of 100', () => {
		const component = renderer.create(
			<NumericAnswer
				node={{
					data: {
						get: () => {
							return {
								score: 100
							}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAnswer builds the expected component with score of 0', () => {
		const component = renderer.create(
			<NumericAnswer
				node={{
					data: {
						get: () => {
							return {
								score: 0
							}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('NumericAnswer onHandleScoreChange() with score of `100`', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<NumericAnswer
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {
								score: 100
							}
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

		const tree = component.html()

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('NumericAnswer onHandleScoreChange() with score `0`', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<NumericAnswer
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {
								score: 0
							}
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

		const tree = component.html()

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('NumericAnswer onClickDropdown() change requirement from `Exact answer` to `Margin of error`', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<NumericAnswer
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {
								requirement: 'exact',
								score: 0
							}
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('.select-item')
			.at(0)
			.simulate('change', { target: { name: 'requirement', value: 'Margin of error' } })

		const tree = component.html()

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('NumericAnswer onClickDropdown() change requirement from `Exact answer` to `Precise response`', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<NumericAnswer
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {
								requirement: 'exact',
								score: 0
							}
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('.select-item')
			.at(0)
			.simulate('change', { target: { name: 'requirement', value: 'Precise response' } })

		const tree = component.html()

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('NumericAnswer onClickDropdown() change `type` for `Margin of error`', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<NumericAnswer
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {
								requirement: 'margin',
								score: 0
							}
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('.select-item')
			.at(0)
			.simulate('change', { target: { name: 'type', value: 'percent' } })

		const tree = component.html()

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('NumericAnswer onHandleInputChange() works as expected', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<NumericAnswer
				node={{
					key: 'mockKey',
					nodes: [],
					data: {
						get: () => {
							return {
								requirement: 'exact',
								score: 0
							}
						}
					}
				}}
				editor={editor}
			/>
		)

		component
			.find('.input-item')
			.at(0)
			.simulate('change', { target: { name: 'value', value: '100' } })

		const tree = component.html()

		expect(editor.setNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
