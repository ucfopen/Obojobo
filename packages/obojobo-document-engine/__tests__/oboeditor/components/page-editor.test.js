import { shallow, mount } from 'enzyme'
import React from 'react'
import { Value } from 'slate'

jest.mock('slate-react')
jest.mock('src/scripts/viewer/util/api-util')

import PageEditor from 'src/scripts/oboeditor/components/page-editor'
import APIUtil from 'src/scripts/viewer/util/api-util'

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const BREAK_NODE = 'ObojoboDraft.Chunks.Break'

describe('PageEditor', () => {
	test('EditorNav component', () => {
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			}
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
			}
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
			}
		}
		const component = shallow(<PageEditor {...props} />)
		component.setProps({ page: null })
		component.setProps(props)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with no page updating to a page', () => {
		const props = {
			page: {
				id: 1,
				set: jest.fn(),
				attributes: {
					children: []
				},
				get: jest.fn()
			}
		}
		const component = shallow(<PageEditor {...props} />)
		component.setProps({
			page: {
				id: 2,
				set: jest.fn(),
				attributes: {
					children: []
				},
				get: jest.fn()
			}
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
			}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with content exports to database', () => {
		jest.spyOn(window, 'alert')
		window.alert.mockReturnValueOnce(null)
		APIUtil.postDraft.mockResolvedValueOnce({ status: 'ok' })

		const props = {
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
				get: jest
					.fn()
					.mockReturnValueOnce(ASSESSMENT_NODE) // get('type') in import
					.mockReturnValueOnce({
						scoreActions: [
							{
								for: '100',
								page: {
									type: PAGE_NODE,
									children: [
										{
											type: BREAK_NODE,
											content: {}
										}
									]
								}
							}
						]
					})
					.mockReturnValueOnce(ASSESSMENT_NODE) // get('type') in export
			},
			model: {
				children: [
					{
						get: () => ASSESSMENT_NODE,
						children: []
					},
					{
						get: () => CONTENT_NODE,
						flatJSON: () => {
							return { children: [] }
						},
						children: {
							models: [
								{
									get: () => null
								}
							]
						}
					},
					{
						get: () => 'mockNode'
					}
				],
				flatJSON: () => {
					return { children: [] }
				}
			}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(APIUtil.postDraft).toHaveBeenCalled()
	})

	test('EditorNav component with content fails to export to database', () => {
		jest.spyOn(window, 'alert')
		window.alert.mockReturnValueOnce(null)
		APIUtil.postDraft.mockResolvedValueOnce({ status: 'not ok' })

		const props = {
			page: {
				id: 2,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: 'ObojoboDraft.Chunks.Break',
							content: {}
						}
					]
				},
				get: jest.fn()
			},
			model: {
				children: [],
				flatJSON: () => {
					return { children: [] }
				}
			}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(APIUtil.postDraft).toHaveBeenCalle
	})

	test.skip('EditorNav component toggles mark', () => {
		window.getSelection = jest.fn().mockReturnValueOnce({
			rangeCount: {
				nodeType: 'mockType'
			}
		})
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			}
		}
		const component = mount(<PageEditor {...props} />)
		const tree = component.html()

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component alters value', () => {
		window.getSelection = jest.fn().mockReturnValueOnce({ rangeCount: 0 })
		const props = {
			page: {
				attributes: { children: [] },
				get: jest.fn()
			}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

		component.find('.obojobo-draft--pages--page').simulate('change', { value: Value.create({}) })

		expect(tree).toMatchSnapshot()
	})
})
