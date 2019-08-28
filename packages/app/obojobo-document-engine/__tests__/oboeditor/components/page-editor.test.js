import { mount, shallow } from 'enzyme'

import APIUtil from 'src/scripts/viewer/util/api-util'
import EditorStore from '../../../src/scripts/oboeditor/stores/editor-store'
import PageEditor from 'src/scripts/oboeditor/components/page-editor'
import React from 'react'
import { Value } from 'slate'
import mockConsole from 'jest-mock-console'

jest.mock('slate-react')

jest.mock('src/scripts/viewer/util/api-util')
jest.mock('src/scripts/oboeditor/components/toolbars/file-menu')
jest.mock('src/scripts/common/util/modal-util')

// Editor Store
jest.mock('src/scripts/oboeditor/stores/editor-store', () => {
	return {
		state: { startingId: null }
	}
})

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'
let restoreConsole

describe('PageEditor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		restoreConsole = mockConsole('error')
	})

	afterEach(() => {
		restoreConsole()
	})

	test('EditorNav component', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with no page', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = shallow(<PageEditor {...props} />)
		component.setProps({ page: null })
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with no page updating to a page', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = shallow(<PageEditor {...props} />)
		component.setProps({ page: null })
		component.setProps(props)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with page updating to another page', () => {
		const props = {
			page: {
				id: 1,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: BREAK_NODE,
							content: {},
							children: []
						}
					]
				},
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = shallow(<PageEditor {...props} />)
		component.setProps({
			page: {
				id: 2,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: BREAK_NODE,
							content: {},
							children: []
						}
					]
				},
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		})
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with content', () => {
		const props = {
			page: {
				id: 2,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: BREAK_NODE,
							content: {}
						}
					]
				},
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component alters value majorly', () => {
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

		const change = {
			value: Value.create({}),
			operations: {
				toJSON: () => [
					{
						type: 'set_mark'
					}
				]
			}
		}

		component.find('.obojobo-draft--pages--page').simulate('change', change)

		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component alters value minorly', () => {
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

		const change = {
			value: Value.create({}),
			operations: {
				toJSON: () => [
					{
						type: 'set_selection'
					}
				]
			}
		}

		component.find('.obojobo-draft--pages--page').simulate('change', change)

		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component stores reference', () => {
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			},
			model: { title: 'Mock Title' }
		}
		const component = mount(<PageEditor {...props} />)

		const instance = component.instance()

		instance.ref('mockEditor')

		expect(instance.getEditor()).toEqual('mockEditor')
	})
})
