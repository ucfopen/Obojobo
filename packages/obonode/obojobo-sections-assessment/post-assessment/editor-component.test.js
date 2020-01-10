import React from 'react'
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import PostAssessment from './editor-component'

jest.mock('obojobo-pages-page/editor')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

describe('Actions editor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('Node component', () => {
		const component = renderer.create(
			<PostAssessment
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component adds child', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = mount(
			<PostAssessment
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: { size: 0 }
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('addAction adds an action with the given range', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const component = shallow(
			<PostAssessment
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: { size: 0 }
				}}
				editor={editor}
			/>
		)

		component.instance().addAction('mock range')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
