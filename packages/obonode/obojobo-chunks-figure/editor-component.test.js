import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { Transforms } from 'slate'
import EditorStore from 'obojobo-document-engine/src/scripts/oboeditor/stores/editor-store'

import Figure from './editor-component'

jest.mock('obojobo-document-engine/src/scripts/oboeditor/stores/editor-store')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('slate')
jest.mock('slate-react')
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)

describe('Figure Editor Node', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		jest.resetAllMocks()
		EditorStore.state = { settings: { allowedUploadTypes: '.mockTypes' } }
	})

	test('Figure component', () => {
		const component = renderer.create(
			<Figure
				element={{
					content: {
						size: 'small',
						url: 'mockUrl',
						alt: 'mockAlt'
					}
				}}
			/>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Figure renders with custom size correctly', () => {
		expect.assertions(3)

		const component = renderer.create(
			<Figure
				element={{
					content: {
						size: 'custom',
						url: 'mockUrl',
						alt: 'mockAlt',
						width: 'customWidth',
						height: 'customHeight'
					}
				}}
			/>
		)
		expect(component.toJSON()).toMatchSnapshot()

		const componentNoWidth = renderer.create(
			<Figure
				element={{
					content: {
						size: 'custom',
						url: 'mockUrl',
						alt: 'mockAlt',
						height: 'customHeight'
					}
				}}
			/>
		)
		expect(componentNoWidth.toJSON()).toMatchSnapshot()

		const componentNoHeight = renderer.create(
			<Figure
				element={{
					content: {
						size: 'custom',
						url: 'mockUrl',
						alt: 'mockAlt',
						width: 'customWidth'
					}
				}}
			/>
		)
		expect(componentNoHeight.toJSON()).toMatchSnapshot()
	})

	test('Figure component edits properties', () => {
		const component = mount(
			<Figure
				element={{
					id: 'mockKey',
					content: {}
				}}
			/>
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(ModalUtil.show).toHaveBeenCalled()

		component.unmount()
	})

	test('Figure component handles tabbing', () => {
		const component = mount(
			<Figure
				element={{
					id: 'mockKey',
					content: {}
				}}
			/>
		)

		component
			.find('button')
			.at(0)
			.simulate('keyDown', { key: 'k' })
		component
			.find('button')
			.at(0)
			.simulate('keyDown', { key: 'Tab', shiftKey: 'true' })

		component
			.find('button')
			.at(1)
			.simulate('keyDown', { key: 'k' })
		component
			.find('button')
			.at(1)
			.simulate('keyDown', { key: 'Tab' })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Figure component does not focus if already selected', () => {
		const component = mount(
			<Figure
				element={{
					id: 'mockKey',
					content: {}
				}}
				selected={true}
			/>
		)

		component
			.find('.figure-box')
			.at(0)
			.simulate('click')

		expect(Transforms.setSelection).not.toHaveBeenCalled()

		component.unmount()
	})

	test('Figure component focuses when clicked', () => {
		const component = mount(
			<Figure
				element={{
					id: 'mockKey',
					content: {}
				}}
				selected={false}
			/>
		)

		component
			.find('.figure-box')
			.at(0)
			.simulate('click')

		expect(Transforms.setSelection).toHaveBeenCalled()

		component.unmount()
	})

	test('changeProperties sets the nodes content', () => {
		const mockContent = { mockContent: true }
		const newMockContent = { newMockContent: 999 }
		const component = mount(
			<Figure
				element={{
					key: 'mockKey',
					content: mockContent
				}}
				selected={true}
			/>
		)

		component.instance().changeProperties(newMockContent)
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Figure component delete button calls Transforms', () => {
		const component = mount(<Figure element={{ content: {} }} selected={true} />)

		const deleteButton = component.find('button').at(0)
		expect(deleteButton.props().children).toBe('×')

		deleteButton.simulate('click')
		expect(Transforms.removeNodes).toHaveBeenCalled()
	})
})
