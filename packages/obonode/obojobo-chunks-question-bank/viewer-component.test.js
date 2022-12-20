import React from 'react'
import renderer from 'react-test-renderer'

import QuestionBank from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

import Common from 'obojobo-document-engine/src/scripts/common'

require('./viewer') // used to register this oboModel

const TEST_COMPONENT_CLASS = 'question-bank-test-chunk'

describe('QuestionBank', () => {
	beforeAll(() => {
		// set up a fake test chunk that we can render into the question bank as its children
		Common.Registry.registerModel('Test.Chunks.QuestionBankTestChunk', {
			adapter: {
				construct() {},
				clone() {},
				toJSON() {}
			},
			componentClass: model => {
				return <div id={model.model.attributes.id} className={TEST_COMPONENT_CLASS}></div>
			},
			type: 'chunk'
		})
	})

	test('QuestionBank component renders, no question index, one child', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.QuestionBank',
			children: [
				{
					id: 'child-id',
					type: 'Test.Chunks.QuestionBankTestChunk'
				}
			]
		})

		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<QuestionBank model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		const childComponents = component.root.findAllByProps({ className: TEST_COMPONENT_CLASS })
		expect(childComponents.length).toBe(1)
	})

	test('QuestionBank component renders, no question index, multiple children', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.QuestionBank',
			children: [
				{
					id: 'child-id1',
					type: 'Test.Chunks.QuestionBankTestChunk'
				},
				{
					id: 'child-id2',
					type: 'Test.Chunks.QuestionBankTestChunk'
				}
			]
		})

		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(<QuestionBank model={model} moduleData={moduleData} />)

		const childComponents = component.root.findAllByProps({ className: TEST_COMPONENT_CLASS })
		expect(childComponents.length).toBe(2)
	})

	test('QuestionBank component renders, question index provided, multiple children', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.QuestionBank',
			children: [
				{
					id: 'child-id1',
					type: 'Test.Chunks.QuestionBankTestChunk'
				},
				{
					id: 'child-id2',
					type: 'Test.Chunks.QuestionBankTestChunk'
				}
			]
		})

		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(
			<QuestionBank model={model} moduleData={moduleData} questionIndex={1} />
		)

		const childComponents = component.root.findAllByProps({ className: TEST_COMPONENT_CLASS })
		expect(childComponents.length).toBe(1)

		const expectedChild = childComponents[0]
		expect(expectedChild.props.id).toBe('child-id2')
	})

	test('QuestionBank component renders, question index past cap, multiple children', () => {
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.QuestionBank',
			children: [
				{
					id: 'child-id1',
					type: 'Test.Chunks.QuestionBankTestChunk'
				},
				{
					id: 'child-id2',
					type: 'Test.Chunks.QuestionBankTestChunk'
				}
			]
		})

		const moduleData = {
			focusState: {}
		}

		const component = renderer.create(
			<QuestionBank model={model} moduleData={moduleData} questionIndex={2} />
		)

		const childComponents = component.root.findAllByProps({ className: TEST_COMPONENT_CLASS })
		expect(childComponents.length).toBe(1)

		// providing a question index higher than the highest possible value should constrain it to the highest possible value
		const expectedChild = childComponents[0]
		expect(expectedChild.props.id).toBe('child-id2')
	})
})
