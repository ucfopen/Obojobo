import { shallow, mount } from 'enzyme'
import React from 'react'

import FileMenu from '../../../../src/scripts/oboeditor/components/toolbars/file-menu'

import ModalUtil from '../../../../src/scripts/common/util/modal-util'
jest.mock('../../../../src/scripts/common/util/modal-util')
import APIUtil from 'src/scripts/viewer/util/api-util'
jest.mock('../../../../src/scripts/viewer/util/api-util')
import ClipboardUtil from '../../../../src/scripts/oboeditor/util/clipboard-util'
jest.mock('../../../../src/scripts/oboeditor/util/clipboard-util')
import EditorStore from '../../../../src/scripts/oboeditor/stores/editor-store'
jest.mock('../../../../src/scripts/oboeditor/stores/editor-store', () => ({
	state: { startingId: null, itemsById: { mockStartingId: { label: 'theLabel' } } }
}))
import { downloadDocument } from '../../../../src/scripts/common/util/download-document'
jest.mock('../../../../src/scripts/common/util/download-document')

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

describe('File Menu', () => {
	beforeEach(() => {
		EditorStore.state.startingId = null
		jest.clearAllMocks()
	})

	test('File Menu node', () => {
		const component = shallow(<FileMenu draftId="mockDraft" />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileMenu calls save', () => {
		const model = {
			flatJSON: () => ({ children: [] }),
			children: [
				{
					get: () => CONTENT_NODE,
					flatJSON: () => ({ children: [] }),
					children: { models: [{ get: () => 'mockValue' }] }
				},
				{
					get: () => ASSESSMENT_NODE
				}
			]
		}

		const exportToJSON = jest.fn()

		const component = mount(
			<FileMenu
				draftId="mockDraft"
				model={model}
				exportToJSON={exportToJSON}
				onSave={APIUtil.postDraft}
			/>
		)
		const tree = component.html()

		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'ok'
		})

		component.find({ children: 'Save' }).simulate('click')

		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'error',
			value: { message: 'mock Error' }
		})

		component.find({ children: 'Save' }).simulate('click')

		expect(tree).toMatchSnapshot()
		expect(APIUtil.postDraft).toHaveBeenCalledTimes(2)
	})

	test('FileMenu calls new', done => {
		const component = mount(<FileMenu draftId="mockDraft" />)
		const tree = component.html()

		APIUtil.createNewDraft.mockResolvedValueOnce({
			status: 'ok',
			value: { id: 'mock-id' }
		})

		component.find({ children: 'New' }).simulate('click')

		APIUtil.createNewDraft.mockResolvedValueOnce({
			status: 'error',
			value: { message: 'mock Error' }
		})

		component.find({ children: 'New' }).simulate('click')

		expect(tree).toMatchSnapshot()
		setTimeout(() => {
			component.update()
			expect(APIUtil.createNewDraft).toHaveBeenCalledTimes(2)

			component.unmount()
			done()
		})
	})

	test('FileMenu calls Copy', () => {
		const model = {
			title: 'mockTitle'
		}

		const component = mount(<FileMenu draftId="mockDraft" model={model} />)
		const tree = component.html()

		component.find({ children: 'Make a copy' }).simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('FileMenu calls Download', done => {
		// setup
		const model = {
			title: 'mockTitle'
		}

		APIUtil.getFullDraft.mockResolvedValueOnce('')
		APIUtil.getFullDraft.mockResolvedValueOnce('{ "item": "value" }')

		// render
		const component = mount(<FileMenu draftId="mockDraft" model={model} />)

		// get references to buttons
		const downloadXmlButton = component.find({ children: 'XML Document (.xml)' })
		const downloadJSONButton = component.find({ children: 'JSON Document (.json)' })

		// click
		downloadJSONButton.simulate('click')
		downloadXmlButton.simulate('click')

		setTimeout(() => {
			component.update()
			expect(downloadDocument.mock.calls).toMatchInlineSnapshot(`
			Array [
			  Array [
			    "mockDraft",
			    "json",
			  ],
			  Array [
			    "mockDraft",
			    "xml",
			  ],
			]
		`)

			component.unmount()
			done()
		})
	})

	test('FileMenu calls Delete', () => {
		const model = {
			title: 'mockTitle'
		}

		const component = mount(<FileMenu draftId="mockDraft" model={model} />)
		const tree = component.html()

		component.find({ children: 'Delete Module' }).simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('FileMenu calls Copy LTI Link', () => {
		const model = {
			title: 'mockTitle'
		}

		const component = mount(<FileMenu draftId="mockDraft" model={model} />)
		const tree = component.html()

		component.find({ children: 'Copy LTI Link' }).simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ClipboardUtil.copyToClipboard).toHaveBeenCalled()
	})

	test('copyModule calls copyDraft api', () => {
		const model = {
			flatJSON: () => ({ children: [] }),
			children: [
				{
					get: () => CONTENT_NODE,
					flatJSON: () => ({ children: [] }),
					children: { models: [{ get: () => 'mockValue' }] }
				},
				{
					get: () => ASSESSMENT_NODE
				}
			]
		}

		const exportToJSON = jest.fn()

		const component = mount(
			<FileMenu
				draftId="mockDraftId"
				model={model}
				exportToJSON={exportToJSON}
				onSave={jest.fn()}
			/>
		)

		APIUtil.copyDraft.mockResolvedValueOnce({
			status: 'ok',
			value: {
				draftId: 'new-copy-draft-id'
			}
		})

		return component
			.instance()
			.copyModule('new title')
			.then(() => {
				expect(APIUtil.copyDraft).toHaveBeenCalledWith('mockDraftId', 'new title')
			})
	})

	test('deleteModule calls deleteDraft api', () => {
		const component = mount(<FileMenu draftId="mockDraft" />)

		APIUtil.deleteDraft.mockResolvedValueOnce({ status: 'ok' })
		component.instance().deleteModule('mockId', '      ')

		APIUtil.deleteDraft.mockResolvedValueOnce({ status: 'error' })
		component.instance().deleteModule('mockId', '      ')

		expect(APIUtil.deleteDraft).toHaveBeenCalled()
	})
})
