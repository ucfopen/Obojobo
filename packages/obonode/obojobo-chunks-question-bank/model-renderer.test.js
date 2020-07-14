import React from 'react'
import { create } from 'react-test-renderer'

import ModelRenderer from './model-renderer'

jest.mock('obojobo-chunks-action-button/viewer-component', () => () => <div>ActionButton</div>)
jest.mock('obojobo-chunks-action-button/adapter')
jest.mock('obojobo-chunks-break/viewer-component', () => () => <div>Break</div>)
jest.mock('obojobo-chunks-break/adapter')
jest.mock('obojobo-chunks-figure/viewer-component', () => () => <div>Figure</div>)
jest.mock('obojobo-chunks-figure/adapter')
jest.mock('obojobo-chunks-heading/viewer-component', () => () => <div>Heading</div>)
jest.mock('obojobo-chunks-heading/adapter')
jest.mock('obojobo-chunks-html/viewer-component', () => () => <div>HTML</div>)
jest.mock('obojobo-chunks-html/adapter')
jest.mock('obojobo-chunks-list/viewer-component', () => () => <div>List</div>)
jest.mock('obojobo-chunks-list/adapter')
jest.mock('obojobo-chunks-math-equation/viewer-component', () => () => <div>MathEquation</div>)
jest.mock('obojobo-chunks-math-equation/adapter')
jest.mock('obojobo-chunks-table/viewer-component', () => () => <div>Table</div>)
jest.mock('obojobo-chunks-table/adapter')
jest.mock('obojobo-chunks-text/viewer-component', () => () => <div>Text</div>)
jest.mock('obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-adapter.js')
jest.mock('obojobo-chunks-youtube/viewer-component', () => () => <div>Youtube</div>)
jest.mock('obojobo-chunks-youtube/adapter')

describe('ModelRenderer', () => {
	test('ModelRenderer component', () => {
		const model = { get: () => null }
		const component = create(<ModelRenderer model={model} />)
		expect(component.toJSON()).toEqual(null)
	})

	test('ModelRenderer component with type "ObojoboDraft.Chunks.ActionButton"', () => {
		const model = { get: () => 'ObojoboDraft.Chunks.ActionButton' }
		const component = create(<ModelRenderer model={model} />)
		expect(component).toMatchSnapshot()
	})

	test('ModelRenderer component with type "ObojoboDraft.Chunks.Break"', () => {
		const model = { get: () => 'ObojoboDraft.Chunks.Break' }
		const component = create(<ModelRenderer model={model} />)
		expect(component).toMatchSnapshot()
	})

	test('ModelRenderer component with type "ObojoboDraft.Chunks.Figure"', () => {
		const model = { get: () => 'ObojoboDraft.Chunks.Figure' }
		const component = create(<ModelRenderer model={model} />)
		expect(component).toMatchSnapshot()
	})

	test('ModelRenderer component with type "ObojoboDraft.Chunks.Heading"', () => {
		const model = { get: () => 'ObojoboDraft.Chunks.Heading' }
		const component = create(<ModelRenderer model={model} />)
		expect(component).toMatchSnapshot()
	})

	test('ModelRenderer component with type "ObojoboDraft.Chunks.HTML"', () => {
		const model = { get: () => 'ObojoboDraft.Chunks.HTML' }
		const component = create(<ModelRenderer model={model} />)
		expect(component).toMatchSnapshot()
	})

	test('ModelRenderer component with type "ObojoboDraft.Chunks.List"', () => {
		const model = { get: () => 'ObojoboDraft.Chunks.List' }
		const component = create(<ModelRenderer model={model} />)
		expect(component).toMatchSnapshot()
	})

	test('ModelRenderer component with type "ObojoboDraft.Chunks.MathEquation"', () => {
		const model = { get: () => 'ObojoboDraft.Chunks.MathEquation' }
		const component = create(<ModelRenderer model={model} />)
		expect(component).toMatchSnapshot()
	})

	test('ModelRenderer component with type "ObojoboDraft.Chunks.Table"', () => {
		const model = { get: () => 'ObojoboDraft.Chunks.Table' }
		const component = create(<ModelRenderer model={model} />)
		expect(component).toMatchSnapshot()
	})

	test('ModelRenderer component with type "ObojoboDraft.Chunks.Text"', () => {
		const model = { get: () => 'ObojoboDraft.Chunks.Text' }
		const component = create(<ModelRenderer model={model} />)
		expect(component).toMatchSnapshot()
	})

	test('ModelRenderer component with type "ObojoboDraft.Chunks.YouTube"', () => {
		const model = { get: () => 'ObojoboDraft.Chunks.YouTube' }
		const component = create(<ModelRenderer model={model} />)
		expect(component).toMatchSnapshot()
	})
})
