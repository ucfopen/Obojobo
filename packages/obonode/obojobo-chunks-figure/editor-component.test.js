import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { Transforms } from 'slate'
import EditorStore from 'obojobo-document-engine/src/scripts/oboeditor/stores/editor-store'

import Figure from './editor-component'
import ImageCaptionWidthTypes from './image-caption-width-types'

jest.mock('obojobo-document-engine/src/scripts/oboeditor/stores/editor-store')
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/freeze-unfreeze-editor')
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
	const standardComponentParent = {
		getPath: () => ({
			get: () => 0
		}),
		nodes: {
			size: 2
		}
	}

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
				parent={standardComponentParent}
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
						height: 'customHeight',
						captionWidth: ImageCaptionWidthTypes.TEXT_WIDTH
					}
				}}
				parent={standardComponentParent}
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
						height: 'customHeight',
						captionWidth: ImageCaptionWidthTypes.IMAGE_WIDTH
					}
				}}
				parent={standardComponentParent}
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
						width: 'customWidth',
						captionWidth: ImageCaptionWidthTypes.IMAGE_WIDTH
					}
				}}
				parent={standardComponentParent}
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
				parent={standardComponentParent}
				editor={{}}
			>
				<div node={{ children: [{ text: 'mockText' }] }} />
			</Figure>
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
				parent={standardComponentParent}
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
				parent={standardComponentParent}
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
				parent={standardComponentParent}
				editor={{}}
				selected={true}
			/>
		)

		component.instance().changeProperties(newMockContent)
		expect(Transforms.setNodes).toHaveBeenCalled()
	})

	test('Figure component delete button calls Transforms', () => {
		const component = mount(
			<Figure
				node={{
					data: {
						get: () => ({})
					}
				}}
				parent={standardComponentParent}
				editor={{}}
				element={{ content: {} }}
				selected={true}
			/>
		)

		const deleteButton = component.find('button').at(0)
		expect(deleteButton.props().children).toBe('×')

		deleteButton.simulate('click')
		expect(Transforms.removeNodes).toHaveBeenCalled()
	})

	test('Caption is equal to captionText when the Figure is text-wrapped', () => {
		const mockCaptionText = 'mockCaptionText'

		const component = renderer.create(
			<Figure
				element={{
					content: {
						size: 'small',
						url: 'mockUrl',
						alt: 'mockAlt',
						captionText: mockCaptionText,
						wrapText: true
					}
				}}
				parent={standardComponentParent}
			/>
		)
		const captionElement = component.root.findByType('figcaption')
		expect(captionElement.children).toEqual([mockCaptionText])
	})

	test('Classes are applied correctly when the Figure is text-wrapped', () => {
		const component = renderer.create(
			<Figure
				element={{
					content: {
						size: 'small',
						url: 'mockUrl',
						alt: 'mockAlt',
						captionText: 'mockCaptionText',
						wrapText: true
					}
				}}
				parent={standardComponentParent}
			/>
		)

		const mainContainerElement = component.root.findByProps({
			className: 'obojobo-draft--chunks--figure'
		})
		const figureParentElement = mainContainerElement.children[0]

		// Filter out empty strings because sometimes classes have two spaces between them
		const figureParentClasses = figureParentElement.props.className.split(' ').filter(c => c !== '')
		expect(figureParentClasses).toContain('is-wrapped-text')

		// Bonus - make sure 'left-float' is applied by default
		expect(figureParentClasses).toContain('left-float')
	})

	test('Classes are applied correctly when the Figure is not text-wrapped', () => {
		const component = renderer.create(
			<Figure
				element={{
					content: {
						size: 'small',
						url: 'mockUrl',
						alt: 'mockAlt'
					}
				}}
				parent={standardComponentParent}
			/>
		)

		const mainContainerElement = component.root.findByProps({
			className: 'obojobo-draft--chunks--figure'
		})
		const figureParentElement = mainContainerElement.children[0]

		// Filter out empty strings because sometimes classes have two spaces between them
		const figureParentClasses = figureParentElement.props.className.split(' ').filter(c => c !== '')
		expect(figureParentClasses).toContain('is-not-wrapped-text')

		// Bonus - make sure 'left-float' is applied by default
		expect(figureParentClasses).toContain('left-float')
	})

	test('Wrapped text appears when the Figure is text-wrapped', () => {
		const mockWrappedText = 'mockWrappedText'
		const component = renderer.create(
			<Figure
				element={{
					content: {
						size: 'small',
						url: 'mockUrl',
						alt: 'mockAlt',
						captionText: 'mockCaptionText',
						wrapText: true
					}
				}}
				parent={standardComponentParent}
			>
				<div>{mockWrappedText}</div>
			</Figure>
		)

		// Explicitly making sure this exists, since if it doesn't we'd get an error with 'findByProps'
		const mainContainerElement = component.root.findAllByProps({ className: 'text-chunk pad' })
		expect(mainContainerElement.length).toBe(1)

		expect(mainContainerElement[0].children[0].children[0]).toBe(mockWrappedText)
	})

	test('Wrapped text does not appear when the Figure is not text-wrapped', () => {
		const component = renderer.create(
			<Figure
				element={{
					content: {
						size: 'small',
						url: 'mockUrl',
						alt: 'mockAlt'
					}
				}}
				parent={standardComponentParent}
			/>
		)

		// Explicitly making sure this does not exist, since if it doesn't we'd get an error with 'findByProps'
		const mainContainerElement = component.root.findAllByProps({ className: 'text-chunk pad' })
		expect(mainContainerElement.length).toBe(0)
	})
})
