import { shallow, mount } from 'enzyme'
import React from 'react'

import FileMenu from '../../../../src/scripts/oboeditor/components/toolbars/file-menu'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import APIUtil from 'src/scripts/viewer/util/api-util'
jest.mock('obojobo-document-engine/src/scripts/viewer/util/api-util')
import ClipboardUtil from '../../../../src/scripts/oboeditor/util/clipboard-util'
jest.mock('../../../../src/scripts/oboeditor/util/clipboard-util')
import EditorUtil from '../../../../src/scripts/oboeditor/util/editor-util'
jest.mock('../../../../src/scripts/oboeditor/util/editor-util')
import EditorStore from '../../../../src/scripts/oboeditor/stores/editor-store'
jest.mock('../../../../src/scripts/oboeditor/stores/editor-store', () => ({
	state: { startingId: null, itemsById: { mockStartingId: { label: 'theLabel' } } }
}))
import download from 'downloadjs'
jest.mock('downloadjs')

const CONTENT_NODE = 'ObojoboDraft.Sections.Content'
const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'

describe('File Menu', () => {
	beforeEach(() => {
		EditorStore.state.startingId = null
		jest.clearAllMocks()
	})

	test('File Menu node', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})
		const component = shallow(<FileMenu draftId="mockDraft" />)
		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileMenu - processFileContent', () => {
		APIUtil.postDraft.mockResolvedValue({ status: 'ok', value: { id: 'mockId' } })

		const reload = jest.fn()
		const component = mount(<FileMenu draftId="mockDraft" reload={reload} />)

		component
			.find('button')
			.at(1)
			.simulate('click')

		const mockId = 'mockId'
		const content = 'mockContent'

		component.instance().processFileContent(mockId, content, 'application/json')
		expect(APIUtil.postDraft).toHaveBeenCalledWith(mockId, content, 'application/json')

		component.instance().processFileContent(mockId, content, 'text')
		expect(APIUtil.postDraft).toHaveBeenCalledWith(mockId, content, 'text/plain')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileMenu calls Import', () => {
		const component = mount(<FileMenu draftId="mockDraft" />)

		component
			.find('button')
			.at(1)
			.simulate('click')
		expect(ModalUtil.show).toHaveBeenCalled()

		component.instance().buildFileSelector()
		expect(ModalUtil.hide).toHaveBeenCalled()

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileMenu calls onFileChange', () => {
		const component = mount(<FileMenu draftId="mockDraft" reload={jest.fn} />)

		const file = new Blob(['fileContents'], { type: 'text/plain' })
		component.instance().onFileChange({ target: { files: [file] } })

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('FileMenu calls save', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

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

		component
			.find('button')
			.at(2)
			.simulate('click')

		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'error',
			value: { message: 'mock Error' }
		})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(APIUtil.postDraft).toHaveBeenCalledTimes(2)
	})

	test('FileMenu calls new', done => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

		const component = mount(<FileMenu draftId="mockDraft" />)
		const tree = component.html()

		APIUtil.createNewDraft.mockResolvedValueOnce({
			status: 'ok',
			value: { id: 'mock-id' }
		})

		component
			.find('button')
			.at(3)
			.simulate('click')

		APIUtil.createNewDraft.mockResolvedValueOnce({
			status: 'error',
			value: { message: 'mock Error' }
		})

		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		setTimeout(() => {
			component.update()
			expect(APIUtil.createNewDraft).toHaveBeenCalledTimes(2)

			component.unmount()
			done()
		})
	})

	test('FileMenu calls Copy', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

		const model = {
			title: 'mockTitle'
		}

		const component = mount(<FileMenu draftId="mockDraft" model={model} />)
		const tree = component.html()

		component
			.find('button')
			.at(4)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('FileMenu calls Download', done => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

		const model = {
			title: 'mockTitle'
		}

		const component = mount(<FileMenu draftId="mockDraft" model={model} />)
		const tree = component.html()

		APIUtil.getFullDraft.mockResolvedValueOnce('')

		component
			.find('button')
			.at(6)
			.simulate('click')

		APIUtil.getFullDraft.mockResolvedValueOnce('{ "item": "value" }')

		component
			.find('button')
			.at(7)
			.simulate('click')

		expect(tree).toMatchSnapshot()

		setTimeout(() => {
			component.update()
			expect(APIUtil.getFullDraft).toHaveBeenCalled()
			expect(download).toHaveBeenCalled()

			component.unmount()
			done()
		})
	})

	test('FileMenu calls Rename', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

		const model = {
			title: 'mockTitle'
		}

		const component = mount(<FileMenu draftId="mockDraft" model={model} />)
		const tree = component.html()

		component
			.find('button')
			.at(8)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('FileMenu calls Delete', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

		const model = {
			title: 'mockTitle'
		}

		const component = mount(<FileMenu draftId="mockDraft" model={model} />)
		const tree = component.html()

		component
			.find('button')
			.at(9)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('FileMenu calls Copy LTI Link', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

		const model = {
			title: 'mockTitle'
		}

		const component = mount(<FileMenu draftId="mockDraft" model={model} />)
		const tree = component.html()

		component
			.find('button')
			.at(10)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ClipboardUtil.copyToClipboard).toHaveBeenCalled()
	})

	test('renameModule renames with blank name', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

		const component = mount(<FileMenu draftId="mockDraft" onRename={jest.fn()} />)

		component.instance().renameModule('mockId', '      ')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
	})

	test('renameModule renames with new name', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

		const component = mount(<FileMenu draftId="mockDraft" />)

		component.instance().renameModule('mockId', 'mock title')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
	})

	test('renameAndSaveModule renames and saves draft', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})
		const onSave = jest.fn()

		const component = mount(<FileMenu draftId="mockDraft" onSave={onSave} />)

		component.instance().renameAndSaveModule('mockId', 'mock title')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
		expect(onSave).toHaveBeenCalled()
	})

	test('copyModule creates a copy of the current draft', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

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
			<FileMenu draftId="mockDraft" model={model} exportToJSON={exportToJSON} onSave={jest.fn()} />
		)

		APIUtil.createNewDraft.mockResolvedValueOnce({
			value: { id: 'mockId' }
		})
		APIUtil.postDraft.mockResolvedValueOnce({
			status: 'ok'
		})

		component.instance().copyModule('mockId', 'mock title - copy')

		expect(APIUtil.createNewDraft).toHaveBeenCalled()
	})

	test('deleteModule removes draft', () => {
		APIUtil.getAllDrafts.mockResolvedValueOnce({
			value: [{ draftId: 'mockDraft' }, { draftId: 'otherDraft' }]
		})

		const component = mount(<FileMenu draftId="mockDraft" />)

		APIUtil.deleteDraft.mockResolvedValueOnce({ status: 'ok' })
		component.instance().deleteModule('mockId', '      ')

		APIUtil.deleteDraft.mockResolvedValueOnce({ status: 'error' })
		component.instance().deleteModule('mockId', '      ')

		expect(APIUtil.deleteDraft).toHaveBeenCalled()
	})
})
