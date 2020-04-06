import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import { Transforms } from 'slate'
jest.mock('slate')
jest.mock('slate-react')

import Link from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/link'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper', 
	() => item => item
)

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
			<Link element={{ href: 'mock href' }}/>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Link component edits', () => {
		const component = mount(
			<Link element={{ href: 'mock href' }}/>
		)

		component.find('button').simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('changeLinkValue edits the href with empty href', () => {
		const component = mount(
			<Link element={{ href: 'mock href' }}/>
		)

		component.instance().changeLinkValue(' ')

		expect(Transforms.unwrapNodes).toHaveBeenCalled()
	})

	test('changeLinkValue edits the href', () => {
		const component = mount(
			<Link element={{ href: 'mock href' }}/>
		)

		component.instance().changeLinkValue('mock href')

		expect(Transforms.setNodes).toHaveBeenCalled()
	})
})
