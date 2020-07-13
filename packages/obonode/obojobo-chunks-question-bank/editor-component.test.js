import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { Registry } from 'obojobo-document-engine/src/scripts/common/registry'
import QuestionBank from './editor-component'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model')
import { Transforms } from 'slate'
jest.mock('slate')
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')
jest.mock('./icon', () => global.mockReactComponent(this, 'Icon'))
jest.mock('./converter', () => ({ mock: 'converter' }))
jest.mock('obojobo-document-engine/src/scripts/common/registry', () => ({
	Registry: {
		registerModel: jest.fn(),
		getItemForType: jest.fn()
	}
}))
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)

describe('QuestionBank editor', () => {
	test('QuestionBank builds the expected component', () => {
		const props = {
			node: {
				data: {
					get: () => {
						return {}
					}
				}
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			element: { content: {} }
		}

		const component = renderer.create(<QuestionBank {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('QuestionBank component changes choose type', () => {
		const props = {
			element: {
				content: { choose: 8, select: 'sequential' }
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			}
		}

		const component = mount(<QuestionBank {...props} />)
		component
			.find('input')
			.at(0)
			.simulate('click')
		component
			.find('input')
			.at(0)
			.simulate('change', { target: { value: 'all' } })

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('QuestionBank component changes choose amount', () => {
		const props = {
			element: {
				content: { choose: 8, select: 'sequential' }
			},
			editor: {
				toggleEditable: jest.fn()
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			}
		}

		const component = mount(<QuestionBank {...props} />)
		component
			.find('input')
			.at(1)
			.simulate('click')
		component
			.find('input')
			.at(1)
			.simulate('change', { target: { value: 'pick' } })

		component
			.find('input')
			.at(2)
			.simulate('focus')
		component
			.find('input')
			.at(2)
			.simulate('click')
		component
			.find('input')
			.at(2)
			.simulate('change', { target: { value: '7' } })
		component
			.find('input')
			.at(2)
			.simulate('blur')

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('QuestionBank component changes select type', () => {
		const props = {
			element: {
				content: { choose: 8, select: 'sequential' }
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			}
		}

		const component = mount(<QuestionBank {...props} />)
		component
			.find('select')
			.at(0)
			.simulate('click')
		component
			.find('select')
			.at(0)
			.simulate('change', { target: { value: 'pick' } })

		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('QuestionBank component deletes self', () => {
		Registry.getItemForType.mockReturnValueOnce({
			insertJSON: {
				type: 'Mock'
			}
		})

		const props = {
			node: {
				data: {
					data: {
						get: () => {
							return { choose: 8, select: 'sequential' }
						}
					}
				}
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {
				removeNodeByKey: jest.fn()
			},
			element: {
				content: { choose: 8, select: 'sequential' }
			}
		}

		const component = mount(<QuestionBank {...props} />)

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('QuestionBank component adds question', () => {
		Registry.getItemForType.mockReturnValueOnce({
			insertJSON: {
				type: 'Mock'
			}
		})

		const props = {
			element: {
				content: {},
				children: []
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}

		ReactEditor.findPath.mockReturnValueOnce([])

		const component = mount(<QuestionBank {...props} />)
		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalledWith({}, { type: 'Mock' }, { at: [0] })
	})

	test('QuestionBank component adds question bank', () => {
		const props = {
			element: {
				content: {},
				children: []
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}

		ReactEditor.findPath.mockReturnValueOnce([])

		const component = mount(<QuestionBank {...props} />)
		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(Transforms.insertNodes).toHaveBeenCalledWith(
			{},
			expect.objectContaining({ type: 'ObojoboDraft.Chunks.QuestionBank' }),
			{ at: [0] }
		)
	})

	test('QuestionBank component adds questions', () => {
		const props = {
			element: {
				content: {},
				children: []
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}

		ReactEditor.findPath.mockReturnValueOnce([])

		// Use QuestionBank.type to bypass memo()
		const component = mount(<QuestionBank.type {...props} />)

		component.instance().importQuestionList([{}])
		expect(Transforms.insertNodes).toHaveBeenCalledWith({}, {}, { at: [0] })
	})

	test('QuestionBank component displays ImportQuestionModal', () => {
		const props = {
			element: {
				content: {},
				children: []
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}

		ReactEditor.findPath.mockReturnValueOnce([])

		// Use QuestionBank.type to bypass memo()
		const component = mount(<QuestionBank.type {...props} />)

		OboModel.getRoot.mockReturnValueOnce({ get: () => 'mock_type', children: [] })
		component.instance().diplayImportQuestionModal()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('QuestionBank component call getQuestionList', () => {
		const props = {
			element: {
				content: {},
				children: []
			},
			node: {
				key: 'mock_key'
			},
			parent: {
				getPath: () => ({
					get: () => 0
				}),
				nodes: {
					size: 2
				}
			},
			editor: {}
		}

		ReactEditor.findPath.mockReturnValueOnce([])

		// Use QuestionBank.type to bypass memo()
		const component = mount(<QuestionBank.type {...props} />)

		let root = {
			get: () => 'mock_type',
			children: []
		}
		expect(component.instance().getQuestionList(root)).toHaveLength(0)

		root = {
			get: () => 'mock_type',
			children: [
				{
					get: () => 'ObojoboDraft.Chunks.Question',
					children: []
				}
			]
		}
		expect(component.instance().getQuestionList(root)).toHaveLength(1)
	})
})
