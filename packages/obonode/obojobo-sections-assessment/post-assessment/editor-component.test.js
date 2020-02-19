import React from 'react'
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import PostAssessment from './editor-component'

jest.mock('obojobo-pages-page/editor')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import { Transforms } from 'slate'
jest.mock('slate')
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper', 
	() => item => item
)

describe('Actions editor', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('Node component', () => {
		const component = renderer.create(
			<PostAssessment element={{ content: {} }}/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component adds child', () => {
		const component = mount(
			<PostAssessment
				element={{
					content: {},
					children: []
				}}/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('addAction adds an action with the given range', () => {
		const component = shallow(
			<PostAssessment
				element={{
					content: {},
					children: []
				}}/>
		)
		ReactEditor.findPath.mockReturnValueOnce([])

		component.instance().addAction('mock range')

		expect(Transforms.insertNodes).toHaveBeenCalled()
	})
})
