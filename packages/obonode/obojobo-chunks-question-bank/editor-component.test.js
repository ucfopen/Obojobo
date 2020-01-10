import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { Registry } from 'obojobo-document-engine/src/scripts/common/registry'
import QuestionBank from './editor-component'

jest.mock('./icon', () => global.mockReactComponent(this, 'Icon'))
jest.mock('./components/settings/editor-component', () =>
	global.mockReactComponent(this, 'Settings')
)
jest.mock('./schema', () => ({ mock: 'schema' }))
jest.mock('./converter', () => ({ mock: 'converter' }))
jest.mock('obojobo-document-engine/src/scripts/common/registry', () => ({
	Registry: {
		registerModel: jest.fn(),
		getItemForType: jest.fn()
	}
}))

describe('QuestionBank editor', () => {
	test('QuestionBank builds the expected component', () => {
		const props = {
			node: {
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const component = renderer.create(<QuestionBank {...props} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
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
			editor: {
				removeNodeByKey: jest.fn()
			}
		}

		const component = mount(<QuestionBank {...props} />)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(props.editor.removeNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('QuestionBank component adds question', () => {
		Registry.getItemForType.mockReturnValueOnce({
			insertJSON: {
				type: 'Mock'
			}
		})

		const props = {
			node: {
				data: {
					data: {
						get: () => ({ content: {} })
					}
				},
				nodes: []
			},
			editor: {
				insertNodeByKey: jest.fn()
			}
		}

		const component = mount(<QuestionBank {...props} />)
		const tree = component.html()
		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(props.editor.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})

	test('QuestionBank component adds question bank', () => {
		const props = {
			node: {
				data: {
					data: {
						get: () => ({ choose: 8, select: 'sequential' })
					}
				},
				nodes: []
			},
			editor: {
				insertNodeByKey: jest.fn()
			}
		}

		const component = mount(<QuestionBank {...props} />)
		const tree = component.html()
		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(props.editor.insertNodeByKey).toHaveBeenCalled()
		expect(tree).toMatchSnapshot()
	})
})
