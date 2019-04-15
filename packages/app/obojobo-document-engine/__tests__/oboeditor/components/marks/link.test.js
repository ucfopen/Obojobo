import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import Link from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/link'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')

describe('EditorNav', () => {
	beforeAll(() => {
		document.getSelection = jest.fn()
		document.execCommand = jest.fn()
	})
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('Link component', () => {
		const component = renderer.create(
			<Link
				mark={{
					data: { get: () => 'mock href' }
				}}
			/>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Link component edits', () => {
		const component = mount(
			<Link
				mark={{
					data: { get: () => 'mock href' }
				}}
			/>
		)

		component.find('button').simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('changeLinkValue edits the href with empty href', () => {
		const editor = {
			removeMarkByKey: jest.fn(),
			setMarkByKey: jest.fn()
		}

		const component = mount(
			<Link
				mark={{
					data: { get: () => 'mock href' }
				}}
				editor={editor}
				node={{
					key: 'mockKey'
				}}
				text={{ length: 5 }}
			/>
		)

		component.instance().changeLinkValue(' ')

		expect(editor.removeMarkByKey).toHaveBeenCalled()
	})

	test('changeLinkValue edits the href', () => {
		const editor = {
			setMarkByKey: jest.fn()
		}

		const component = mount(
			<Link
				mark={{
					data: { get: () => 'mock href' }
				}}
				editor={editor}
				node={{
					key: 'mockKey'
				}}
				text={{ length: 5 }}
			/>
		)

		component.instance().changeLinkValue('mock href')

		expect(editor.setMarkByKey).toHaveBeenCalled()
	})
})
