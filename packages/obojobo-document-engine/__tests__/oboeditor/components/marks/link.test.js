import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import Link from 'src/scripts/oboeditor/components/marks/link'

import ModalUtil from 'src/scripts/common/util/modal-util'
jest.mock('src/scripts/common/util/modal-util')

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
		const change = {
			removeMarkByKey: jest.fn()
		}

		const component = mount(
			<Link
				mark={{
					data: { get: () => 'mock href' }
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
				node={{
					key: 'mockKey'
				}}
				text={{ length: 5 }}
			/>
		)

		component.instance().changeLinkValue(' ')

		expect(change.removeMarkByKey).toHaveBeenCalled()
	})

	test('changeLinkValue edits the href', () => {
		const change = {
			setMarkByKey: jest.fn()
		}

		const component = mount(
			<Link
				mark={{
					data: { get: () => 'mock href' }
				}}
				editor={{
					value: { change: () => change },
					onChange: jest.fn()
				}}
				node={{
					key: 'mockKey'
				}}
				text={{ length: 5 }}
			/>
		)

		component.instance().changeLinkValue('mock href')

		expect(change.setMarkByKey).toHaveBeenCalled()
	})
})
