import { shallow, mount } from 'enzyme'
import React from 'react'

import FileMenu from '../../../../src/scripts/oboeditor/components/toolbars/file-menu'

import ModalUtil from '../../../../src/scripts/common/util/modal-util'
jest.mock('../../../../src/scripts/common/util/modal-util')
import APIUtil from 'src/scripts/viewer/util/api-util'
jest.mock('../../../../src/scripts/viewer/util/api-util')
import ClipboardUtil from '../../../../src/scripts/oboeditor/util/clipboard-util'
jest.mock('../../../../src/scripts/oboeditor/util/clipboard-util')
import EditorUtil from '../../../../src/scripts/oboeditor/util/editor-util'
jest.mock('../../../../src/scripts/oboeditor/util/editor-util')
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
		// setup
		const model = {
			title: 'mockTitle'
		}

		APIUtil.getFullDraft.mockResolvedValueOnce('')
		APIUtil.getFullDraft.mockResolvedValueOnce('{ "item": "value" }')

		// render
		const component = mount(<FileMenu draftId="mockDraft" model={model} />)

		// get references to buttons
		const downloadXmlButton = component.find('button').at(6)
		const downloadJSONButton = component.find('button').at(7)

		// Verify references are correct
		expect(downloadXmlButton.text()).toBe('XML Document (.xml)')
		expect(downloadJSONButton.text()).toBe('JSON Document (.json)')

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

	test('FileMenu calls Rename', () => {
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
		const component = mount(<FileMenu draftId="mockDraft" onRename={jest.fn()} />)

		component.instance().renameModule('mockId', '      ')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
	})

	test('renameModule renames with new name', () => {
		const component = mount(<FileMenu draftId="mockDraft" />)

		component.instance().renameModule('mockId', 'mock title')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
	})

	test('renameAndSaveModule renames and saves draft', () => {
		expect.hasAssertions()
		const onSave = jest.fn()

		const component = mount(<FileMenu draftId="mockDraft" onSave={onSave} />)

		component.instance().renameAndSaveModule('mockId', 'mock title')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
		expect(onSave).toHaveBeenCalled()
	})

	test('copyModule creates a copy of the current draft', () => {
		expect.hasAssertions()
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
		expect.hasAssertions()
		// make sure window.close doesn't break further tests
		jest.spyOn(window, 'close').mockReturnValueOnce()
		const component = mount(<FileMenu draftId="mockDraft" />)

		APIUtil.deleteDraft.mockResolvedValueOnce({ status: 'ok' })
		component.instance().deleteModule('mockId', '      ')

		APIUtil.deleteDraft.mockResolvedValueOnce({ status: 'error' })
		return component
			.instance()
			.deleteModule('mockId', '      ')
			.then(() => {
				expect(APIUtil.deleteDraft).toHaveBeenCalled()
			})
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
		const fileReaderReadAsText = jest.spyOn(FileReader.prototype, 'readAsText')
		fileReaderReadAsText.mockReturnValueOnce()
		const file = new Blob(['fileContents'], { type: 'text/plain' })
		const component = mount(<FileMenu draftId="mockDraft" reload={jest.fn} />)
		const processFileContent = jest.spyOn(component.instance(), 'processFileContent')
		processFileContent.mockReturnValueOnce()

		const fileReader = component.instance().onFileChange({ target: { files: [file] } })

		expect(fileReaderReadAsText).toHaveBeenCalledWith(file, 'UTF-8')
		fileReader.onload({ target: { result: 'mock-content' } })
		expect(processFileContent).toHaveBeenCalledWith('mockDraft', 'mock-content', 'text/plain')
	})
})
