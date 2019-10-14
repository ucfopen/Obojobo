import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Question from './editor-component'

jest.mock('obojobo-document-engine/src/scripts/common', () => ({
	Registry: {
		getItemForType: type => ({
			slateToObo: () => ({
				slateToOboReturnFor: type
			}),
			oboToSlate: type => ({
				oboToSlateReturnFor: type
			})
		})
	},
	components: {
		Button: props => <button {...props}>{props.children}</button>
	},
	util: {
		ModalUtil: {
			hide: jest.fn(),
			show: jest.fn()
		}
	},
}))

jest.mock('obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component', () => {
	return props => <div>{props.children}</div>
})

const SOLUTION_NODE = 'ObojoboDraft.Chunks.Question.Solution'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'
const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'

describe('Question Editor Node', () => {
	test('Question builds the expected component', () => {
		const component = renderer.create(
			<Question
				node={{
					data: {
						get: () => ({
							type: 'default'
						})
					},
					nodes: {
						last: () => ({ type: BREAK_NODE })
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Survey Question builds the expected component', () => {
		const component = renderer.create(
			<Question
				node={{
					data: {
						get: () => ({
							type: 'survey'
						})
					},
					nodes: {
						last: () => ({ type: BREAK_NODE })
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Question component deletes self', () => {
		const editor = {
			removeNodeByKey: jest.fn()
		}

		const component = mount(
			<Question
				node={{
					data: {
						get: () => ({ type: 'default' })
					},
					nodes: {
						last: () => ({ type: SOLUTION_NODE }),
						get: () => ({ type: SOLUTION_NODE })
					}
				}}
				editor={editor}
			/>
		)

		const tree = component.html()

		component.find('Button').simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		// expect(tree).toMatchSnapshot()
	})

	test('Question component adds Solution', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<Question
				node={{
					data: {
						get: () => ({
							type: 'default'
						})
					},
					nodes: {
						last: () => ({ type: BREAK_NODE })
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test.skip('Question component allows you to change question type', () => {
		const editor = {
			setNodeByKey: jest.fn()
		}

		const component = mount(
			<Question
				node={{
					key: 'mock-id',
					data: {
						get: () => ({
							type: 'default'
						})
					},
					nodes: {
						last: () => ({ type: BREAK_NODE }),
						get: () => ({ key: 'mock-mca-id', type: MCASSESSMENT_NODE })
					}
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'survey' } })

		component.update()

		expect(editor.setNodeByKey).toHaveBeenNthCalledWith(1, 'mock-id', {
			data: {
				content: {
					type: 'survey'
				}
			}
		})
		expect(editor.setNodeByKey).toHaveBeenNthCalledWith(2, 'mock-mca-id', {
			data: {
				questionType: 'survey'
			}
		})

		expect(tree).toMatchSnapshot()
	})
})
