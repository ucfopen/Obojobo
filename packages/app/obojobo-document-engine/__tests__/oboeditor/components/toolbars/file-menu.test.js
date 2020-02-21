import { shallow, mount } from 'enzyme'
import React from 'react'

import FileMenu from '../../../../src/scripts/oboeditor/components/toolbars/file-menu'

import ModalUtil from 'obojobo-document-engine/src/scripts/common/util/modal-util'
jest.mock('obojobo-document-engine/src/scripts/common/util/modal-util')
import EditorAPI from 'src/scripts/viewer/util/editor-api'
jest.mock('obojobo-document-engine/src/scripts/viewer/util/editor-api')
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
				onSave={EditorAPI.postDraft}
			/>
		)
		const tree = component.html()

		EditorAPI.postDraft.mockResolvedValueOnce({
			status: 'ok'
		})

		component
			.find('button')
			.at(1)
			.simulate('click')

		EditorAPI.postDraft.mockResolvedValueOnce({
			status: 'error',
			value: { message: 'mock Error' }
		})

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(EditorAPI.postDraft).toHaveBeenCalledTimes(2)
	})

	test('FileMenu calls new', done => {
		const component = mount(<FileMenu draftId="mockDraft" />)
		const tree = component.html()

		EditorAPI.createNewDraft.mockResolvedValueOnce({
			status: 'ok',
			value: { id: 'mock-id' }
		})

		component
			.find('button')
			.at(2)
			.simulate('click')

		EditorAPI.createNewDraft.mockResolvedValueOnce({
			status: 'error',
			value: { message: 'mock Error' }
		})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		setTimeout(() => {
			component.update()
			expect(EditorAPI.createNewDraft).toHaveBeenCalledTimes(2)

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
			.at(3)
			.simulate('click')

		expect(tree).toMatchSnapshot()
		expect(ModalUtil.show).toHaveBeenCalled()
	})

	test('FileMenu calls Download', done => {
		const model = {
			title: 'mockTitle'
		}

		const component = mount(<FileMenu draftId="mockDraft" model={model} />)
		const tree = component.html()

		EditorAPI.getFullDraft.mockResolvedValueOnce('')

		component
			.find('button')
			.at(5)
			.simulate('click')

		EditorAPI.getFullDraft.mockResolvedValueOnce('{ "item": "value" }')

		component
			.find('button')
			.at(6)
			.simulate('click')

		expect(tree).toMatchSnapshot()

		setTimeout(() => {
			component.update()
			expect(EditorAPI.getFullDraft).toHaveBeenCalled()
			expect(download).toHaveBeenCalled()

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
			.at(7)
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
			.at(8)
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
			.at(9)
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
		const onSave = jest.fn()

		const component = mount(<FileMenu draftId="mockDraft" onSave={onSave} />)

		component.instance().renameAndSaveModule('mockId', 'mock title')

		expect(EditorUtil.renamePage).toHaveBeenCalled()
		expect(onSave).toHaveBeenCalled()
	})

	test('copyModule creates a copy of the current draft', () => {
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

		EditorAPI.createNewDraft.mockResolvedValueOnce({
			value: { id: 'mockId' }
		})
		EditorAPI.postDraft.mockResolvedValueOnce({
			status: 'ok'
		})

		component.instance().copyModule('mockId', 'mock title - copy')

		expect(EditorAPI.createNewDraft).toHaveBeenCalled()
	})

	test('deleteModule removes draft', () => {
		const component = mount(<FileMenu draftId="mockDraft" />)

		EditorAPI.deleteDraft.mockResolvedValueOnce({ status: 'ok' })
		component.instance().deleteModule('mockId', '      ')

		EditorAPI.deleteDraft.mockResolvedValueOnce({ status: 'error' })
		component.instance().deleteModule('mockId', '      ')

		expect(EditorAPI.deleteDraft).toHaveBeenCalled()
	})
})
