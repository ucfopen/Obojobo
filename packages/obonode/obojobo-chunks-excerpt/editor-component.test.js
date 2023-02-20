import React from 'react'
import renderer from 'react-test-renderer'
import Excerpt from './editor-component'
import { Transforms } from 'slate'

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

describe('Excerpt Node', () => {
	test('Node builds the expected component', () => {
		const content = {
			bodyStyle: 'filled-box',
			width: 'medium',
			font: 'sans',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: false
		}

		const component = renderer.create(
			<Excerpt
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					content: {}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
				element={{
					content: content
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node builds component while selected with effect', () => {
		const content = {
			bodyStyle: 'filled-box',
			width: 'medium',
			font: 'sans',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		const component = renderer.create(
			<Excerpt
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					content: {}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
				element={{
					content: content
				}}
				selected={true}
			/>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Excerpt component deletes itself', () => {
		const content = {
			bodyStyle: 'filled-box',
			width: 'medium',
			font: 'sans',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		const component = renderer.create(
			<Excerpt
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					content: {}
				}}
				parent={{
					getPath: () => ({
						get: () => 0
					}),
					nodes: {
						size: 2
					}
				}}
				element={{
					content: content
				}}
				selected={true}
			/>
		)

		// click Delete button
		const deleteButton = component.root.findByProps({ className: 'delete-button' })
		deleteButton.props.onClick()

		expect(Transforms.removeNodes).toHaveBeenCalled()
	})
})
