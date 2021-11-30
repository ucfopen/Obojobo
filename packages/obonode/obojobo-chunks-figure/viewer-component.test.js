import React from 'react'
import renderer from 'react-test-renderer'

import Figure from './viewer-component'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import ImageCaptionWidthTypes from './image-caption-width-types'

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

		const component = renderer.create(<Figure model={model} moduleData={moduleData} />)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
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
})
