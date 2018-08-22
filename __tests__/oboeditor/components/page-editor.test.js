import { shallow, mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import { Value } from 'slate'

jest.mock('../../../src/scripts/viewer/util/api-util')

import PageEditor from '../../../src/scripts/oboeditor/components/page-editor'
import Break from '../../../ObojoboDraft/Chunks/Break/editor'
import newPage from '../../../src/scripts/oboeditor/documents/new-page.json'
import APIUtil from '../../../src/scripts/viewer/util/api-util'
import Common from '../../../src/scripts/common'

describe('PageEditor', () => {
	test('EditorNav component', () => {
		const props = {
			page: {attributes: {
				children: []
			}}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with no page', () => {
		const props = {
			page: {attributes: {
				children: []
			}}
		}
		const component = shallow(<PageEditor {...props} />)
		component.setProps({page: null})
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with no page updating to a page', () => {
		const props = {
			page: {attributes: {
				children: []
			}}
		}
		const component = shallow(<PageEditor {...props} />)
		component.setProps({page: null})
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
				}
			}
		}
		const component = shallow(<PageEditor {...props} />)
		component.setProps({
			page: {
				id: 2,
				set: jest.fn(),
				attributes: {
					children: []
				}
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
							type: 'ObojoboDraft.Chunks.Break',
							content: {}
						},
						{
							type: 'NonsenseNode'
						}
					]
				}
			}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component with content exports to database', () => {
		jest.spyOn(window, 'alert')
		window.alert.mockReturnValueOnce(null)
		APIUtil.postDraft.mockResolvedValueOnce({status: 'ok'})

		const props = {
			page: {
				id: 2,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: 'ObojoboDraft.Chunks.Break',
							content: {}
						},
						{
							type: 'NonsenseNode'
						}
					]
				}
			},
			model : {
				children: {
					at: index => {
						return {
							children: {
								models: [
									{
										get: () => 'mockValue'
									}
								]
							},
							get: () => [],
							flatJSON: () => { return { children: [] } }
						}
					}
				},
				flatJSON: () => { return { children: [] } }
			}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

		const click = component
			.find('button')
			.at(14)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(APIUtil.postDraft).toHaveBeenCalle
	})

	test('EditorNav component with content fails to export to database', () => {
		jest.spyOn(window, 'alert')
		window.alert.mockReturnValueOnce(null)
		APIUtil.postDraft.mockResolvedValueOnce({status: 'not ok'})

		const props = {
			page: {
				id: 2,
				set: jest.fn(),
				attributes: {
					children: [
						{
							type: 'ObojoboDraft.Chunks.Break',
							content: {}
						},
						{
							type: 'NonsenseNode'
						}
					]
				}
			},
			model : {
				children: {
					at: index => {
						return {
							children: {
								models: [
									{
										get: () => 'mockValue'
									}
								]
							},
							get: () => [],
							flatJSON: () => { return { children: [] } }
						}
					}
				},
				flatJSON: () => { return { children: [] } }
			}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

		const click = component
			.find('button')
			.at(14)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(APIUtil.postDraft).toHaveBeenCalle
	})

	test('EditorNav component inserts item', () => {
		jest.spyOn(Break.helpers, 'insertNode')
		Break.helpers.insertNode.mockReturnValueOnce(null)
		const props = {
			page: {attributes: {
				children: []
			}}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

		const click = component
			.find('button')
			.at(2)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component changes value', () => {
		jest.spyOn(Break.helpers, 'insertNode')
		Break.helpers.insertNode.mockReturnValueOnce(null)
		const props = {
			page: {attributes: {
				children: []
			}}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

		const click = component
			.find('.obojobo-draft--pages--page')
			.simulate('change', { value: Value.create({}) })

		expect(tree).toMatchSnapshot()
	})

	test('EditorNav component renders marks', () => {
		jest.spyOn(Break.helpers, 'insertNode')
		Break.helpers.insertNode.mockReturnValueOnce(null)
		const props = {
			page: {attributes: {
				children: []
			}}
		}
		const component = shallow(<PageEditor {...props} />)
		const tree = component.html()

		const click = component
			.find('.obojobo-draft--pages--page')
			.simulate('change', { value: Value.fromJSON({
				document: {
					nodes: [
						{
							"object": "block",
							"type": "ObojoboDraft.Chunks.Text",
							"data": { "content": { "indent": 0 }},
							"nodes": [
								{
									"object": "text",
									"leaves": [
										{
											"text": "Bold",
											marks: [
												{
													type: 'b'
												}
											]
										},
										{
											"text": "Italic",
											marks: [
												{
													type: 'i'
												}
											]
										},
										{
											"text": "Strike",
											marks: [
												{
													type: 'del'
												}
											]
										},
										{
											"text": "quote",
											marks: [
												{
													type: 'q'
												}
											]
										},
										{
											"text": "Link",
											marks: [
												{
													type: 'a'
												}
											]
										}
									]
								}
							]
						}
					]
				}
			})})
		expect(tree).toMatchSnapshot()
	})
})
