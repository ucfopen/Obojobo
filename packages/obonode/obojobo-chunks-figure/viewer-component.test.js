import React from 'react'
import renderer from 'react-test-renderer'

import Figure from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import ImageCaptionWidthTypes from './image-caption-width-types'

import Common from 'obojobo-document-engine/src/scripts/common'
const { TextGroupEl } = Common.chunk.textChunk

require('./viewer') // used to register this oboModel

describe('Figure', () => {
	test('Figure component', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Figure',
			content: {
				alt: 'Alt Text',
				url: 'www.example.com/img.jpg',
				size: 'custom',
				width: '500',
				height: '400',
				captionWidth: ImageCaptionWidthTypes.IMAGE_WIDTH,
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				]
			}
		})

		// This is a bit hacky, but explicitly remove these content properties to let defaults kick in
		delete model.modelState.wrapText
		delete model.modelState.float

		const component = renderer.create(<Figure model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()

		// Grab a few elements to make some comparisons
		const textGroupEl = component.root.findByType(TextGroupEl)
		const figCaptionElement = component.root.findByType('figcaption')

		// When not text-wrapped, the text group should be a child of the figcaption element
		expect(textGroupEl.parent).toBe(figCaptionElement)

		// Also check the default classes
		expect(component.root.findByType('figure').props.className).toEqual(
			' is-not-wrapped-text left-float'
		)
	})

	test('Figure component with no textGroup', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Figure',
			content: {
				alt: 'Alt Text',
				url: 'www.example.com/img.jpg',
				size: 'custom',
				width: '500',
				height: '400',
				captionWidth: ImageCaptionWidthTypes.IMAGE_WIDTH
			}
		})
		const component = renderer.create(<Figure model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Figure component size small', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Figure',
			content: {
				alt: 'Alt Text',
				url: 'www.example.com/img.jpg',
				size: 'small',
				captionWidth: ImageCaptionWidthTypes.IMAGE_WIDTH,
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				]
			}
		})

		const component = renderer.create(<Figure model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('Figure component custom size with no width', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Figure',
			content: {
				alt: 'Alt Text',
				url: 'www.example.com/img.jpg',
				size: 'custom',
				height: '400',
				captionWidth: ImageCaptionWidthTypes.IMAGE_WIDTH,
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				]
			}
		})

		const component = renderer.create(<Figure model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Figure component custom size with no height', () => {
		const moduleData = {
			focusState: {}
		}
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Figure',
			content: {
				alt: 'Alt Text',
				url: 'www.example.com/img.jpg',
				size: 'custom',
				width: '500',
				captionWidth: ImageCaptionWidthTypes.TEXT_WIDTH,
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				]
			}
		})

		const component = renderer.create(<Figure model={model} moduleData={moduleData} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('Figure component wrapped text', () => {
		const moduleData = {
			focusState: {}
		}
		const mockCaptionText = 'mockCaptionText'
		const model = OboModel.create({
			id: 'id',
			type: 'ObojoboDraft.Chunks.Figure',
			content: {
				alt: 'Alt Text',
				url: 'www.example.com/img.jpg',
				size: 'custom',
				width: '500',
				captionWidth: ImageCaptionWidthTypes.TEXT_WIDTH,
				textGroup: [
					{
						text: {
							value: 'Example Text'
						}
					}
				],
				wrapText: true,
				captionText: mockCaptionText,
				float: 'right'
			}
		})

		const component = renderer.create(<Figure model={model} moduleData={moduleData} />)

		// Grab a few elements to make some comparisons
		const textGroupEl = component.root.findByType(TextGroupEl)
		const containerElement = component.root.findByProps({ className: 'container' })

		// When text-wrapped, the text group should be a child of the top-level container element
		expect(textGroupEl.parent).toBe(containerElement)

		// Also check the classes
		expect(component.root.findByType('figure').props.className).toEqual(
			' is-wrapped-text right-float'
		)

		// Also make sure caption text is rendered correctly
		const figCaptionElement = component.root.findByType('figcaption')
		expect(figCaptionElement.children[0]).toBe(mockCaptionText)
	})
})
