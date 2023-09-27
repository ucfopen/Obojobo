jest.mock('obojobo-document-engine/src/scripts/common/util/download-document')
jest.mock('../repository-utils')

import React from 'react'
import { create } from 'react-test-renderer'

import ModuleOptionsDialog from './module-options-dialog'
import { FULL, PARTIAL, MINIMAL } from 'obojobo-express/server/constants'

describe('ModuleOptionsDialog', () => {
	let defaultProps

	let mockRepositoryUtils
	let mockDownloadDocument

	const originalConfirm = window.confirm

	beforeEach(() => {
		jest.resetAllMocks()

		defaultProps = {
			draftId: 'mockDraftId',
			title: 'Mock Module Title',
			editor: 'mockEditorType',
			accessLevel: FULL
		}

		mockRepositoryUtils = require('../repository-utils')
		mockRepositoryUtils.urlForEditor.mockReturnValue('/url/for/editor')
		mockDownloadDocument = require('obojobo-document-engine/src/scripts/common/util/download-document')
	})

	afterAll(() => {
		window.confirm = originalConfirm
	})

	test('renders correctly with standard expected props', () => {
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		expect(mockRepositoryUtils.urlForEditor).toHaveBeenCalledTimes(1)
		expect(mockRepositoryUtils.urlForEditor).toHaveBeenCalledWith('mockEditorType', 'mockDraftId')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with Minimal access level', () => {
		defaultProps.accessLevel = MINIMAL

		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		// should only be showing the preview, assessment stats, manage collections and public page buttons
		const expectedButtons = ['Preview', 'Assessment Stats', 'Manage Collections', 'Public Page']
		const allButtons = component.root.findAllByProps({ className: 'button-label-group' })
		expect(allButtons.length).toEqual(expectedButtons.length)
		allButtons.forEach((b, i) => {
			expect(b.children[0].props.children).toEqual(expectedButtons[i])
		})

		expect(mockRepositoryUtils.urlForEditor).not.toHaveBeenCalled()

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with Partial access level - not read-only', () => {
		defaultProps.accessLevel = PARTIAL

		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		// should be showing minimal access buttons plus edit and download json/xml buttons
		const expectedButtons = [
			'Preview',
			'Edit',
			'Assessment Stats',
			'Version History',
			'Manage Collections',
			'Download JSON',
			'Download XML',
			'Public Page'
		]
		const allButtons = component.root.findAllByProps({ className: 'button-label-group' })
		expect(allButtons.length).toEqual(expectedButtons.length)
		allButtons.forEach((b, i) => {
			expect(b.children[0].props.children).toEqual(expectedButtons[i])
		})

		expect(mockRepositoryUtils.urlForEditor).toHaveBeenCalledTimes(1)
		expect(mockRepositoryUtils.urlForEditor).toHaveBeenCalledWith('mockEditorType', 'mockDraftId')

		expect(component.toJSON()).toMatchSnapshot()
	})
	test('renders correctly with Partial access level - read-only', () => {
		defaultProps.accessLevel = PARTIAL
		defaultProps.readOnly = true
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		// should be showing minimal access buttons plus synchronize and download json/xml buttons
		// but no version history because read-only
		const expectedButtons = [
			'Preview',
			'Synchronize',
			'Assessment Stats',
			'Manage Collections',
			'Download JSON',
			'Download XML',
			'Public Page'
		]
		const allButtons = component.root.findAllByProps({ className: 'button-label-group' })
		expect(allButtons.length).toEqual(expectedButtons.length)
		allButtons.forEach((b, i) => {
			expect(b.children[0].props.children).toEqual(expectedButtons[i])
		})

		expect(mockRepositoryUtils.urlForEditor).not.toHaveBeenCalled()

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with Full access level - not read-only', () => {
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		// should be showing partial access buttons plus share and delete buttons
		const expectedButtons = [
			'Preview',
			'Edit',
			'Share',
			'Assessment Stats',
			'Version History',
			'Manage Collections',
			'Download JSON',
			'Download XML',
			'Public Page',
			'Delete'
		]
		const allButtons = component.root.findAllByProps({ className: 'button-label-group' })
		// expect(allButtons.length).toEqual(expectedButtons.length)
		allButtons.forEach((b, i) => {
			expect(b.children[0].props.children).toEqual(expectedButtons[i])
		})

		expect(mockRepositoryUtils.urlForEditor).toHaveBeenCalledTimes(1)
		expect(mockRepositoryUtils.urlForEditor).toHaveBeenCalledWith('mockEditorType', 'mockDraftId')

		expect(component.toJSON()).toMatchSnapshot()
	})
	test('renders correctly with Full access level - read-only', () => {
		defaultProps.readOnly = true
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		// should be showing partial access buttons plus share and delete buttons
		const expectedButtons = [
			'Preview',
			'Synchronize',
			'Share',
			'Assessment Stats',
			'Manage Collections',
			'Download JSON',
			'Download XML',
			'Public Page',
			'Delete'
		]
		const allButtons = component.root.findAllByProps({ className: 'button-label-group' })
		// expect(allButtons.length).toEqual(expectedButtons.length)
		allButtons.forEach((b, i) => {
			expect(b.children[0].props.children).toEqual(expectedButtons[i])
			// console.log(b.children[0].props.children)
		})

		expect(mockRepositoryUtils.urlForEditor).not.toHaveBeenCalled()

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('"Share" button calls showModulePermissions', () => {
		defaultProps.showModulePermissions = jest.fn()
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		//there are a few buttons on the page using this class
		component.root.findByProps({ id: 'moduleOptionsDialog-shareButton' }).props.onClick()

		expect(defaultProps.showModulePermissions).toHaveBeenCalledTimes(1)
		expect(defaultProps.showModulePermissions).toHaveBeenCalledWith(defaultProps)
	})

	test('"Manage Collections" button calls showModuleManageCollections', () => {
		defaultProps.showModuleManageCollections = jest.fn()
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		component.root
			.findByProps({ id: 'moduleOptionsDialog-manageCollectionsButton' })
			.props.onClick()

		expect(defaultProps.showModuleManageCollections).toHaveBeenCalledTimes(1)
		expect(defaultProps.showModuleManageCollections).toHaveBeenCalledWith(defaultProps)
	})

	test('"Version History" button calls showVersionHistory', () => {
		defaultProps.showVersionHistory = jest.fn()
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		component.root
			.findByProps({ id: 'moduleOptionsDialog-showVersionHistoryButton' })
			.props.onClick()

		expect(defaultProps.showVersionHistory).toHaveBeenCalledTimes(1)
		expect(defaultProps.showVersionHistory).toHaveBeenCalledWith(defaultProps)
	})

	test('"Assessment Stats" button calls showAssessmentScoreData', () => {
		defaultProps.showAssessmentScoreData = jest.fn()
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		component.root.findByProps({ id: 'moduleOptionsDialog-assessmentScoreData' }).props.onClick()

		expect(defaultProps.showAssessmentScoreData).toHaveBeenCalledTimes(1)
		expect(defaultProps.showAssessmentScoreData).toHaveBeenCalledWith(defaultProps)
	})

	test('"Download JSON" button calls downloadDocument with the correct arguments', () => {
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		//there are a few buttons on the page using this class
		component.root.findByProps({ id: 'moduleOptionsDialog-downloadJSONButton' }).props.onClick()

		expect(mockDownloadDocument.downloadDocument).toHaveBeenCalledTimes(1)
		expect(mockDownloadDocument.downloadDocument).toHaveBeenCalledWith('mockDraftId', 'json')
	})

	test('"Download XML" button calls downloadDocument with the correct arguments', () => {
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		//there are a few buttons on the page using this class
		component.root.findByProps({ id: 'moduleOptionsDialog-downloadXMLButton' }).props.onClick()

		expect(mockDownloadDocument.downloadDocument).toHaveBeenCalledTimes(1)
		expect(mockDownloadDocument.downloadDocument).toHaveBeenCalledWith('mockDraftId', 'xml')
	})

	test('"Delete" button brings up confirmation dialog, canceled', () => {
		defaultProps.deleteModule = jest.fn()
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		window.confirm = jest.fn()
		window.confirm.mockReturnValue(false)

		//there are a few buttons on the page using this class
		component.root.findByProps({ id: 'moduleOptionsDialog-deleteButton' }).props.onClick()

		expect(window.confirm).toHaveBeenCalledTimes(1)
		expect(window.confirm).toHaveBeenCalledWith('Delete "Mock Module Title" id: mockDraftId ?')

		expect(defaultProps.deleteModule).not.toHaveBeenCalled()
	})

	test('"Delete" button brings up confirmation dialog, confirmed', () => {
		defaultProps.deleteModule = jest.fn(() => Promise.resolve())
		defaultProps.startLoadingAnimation = jest.fn()
		defaultProps.stopLoadingAnimation = jest.fn()
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		window.confirm = jest.fn()
		window.confirm.mockReturnValue(true)

		//there are a few buttons on the page using this class
		component.root.findByProps({ id: 'moduleOptionsDialog-deleteButton' }).props.onClick()

		expect(window.confirm).toHaveBeenCalledTimes(1)
		expect(window.confirm).toHaveBeenCalledWith('Delete "Mock Module Title" id: mockDraftId ?')

		expect(defaultProps.deleteModule).toHaveBeenCalledTimes(1)
		expect(defaultProps.deleteModule).toHaveBeenCalledWith('mockDraftId')
	})

	test('"Synchronize" button brings up synchronize dialog', () => {
		defaultProps.readOnly = true
		defaultProps.showModuleSync = jest.fn(() => Promise.resolve())
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		component.root.findByProps({ id: 'moduleOptionsDialog-synchronizeButton' }).props.onClick()

		expect(defaultProps.showModuleSync).toHaveBeenCalledTimes(1)
		expect(defaultProps.showModuleSync).toHaveBeenCalledWith(defaultProps)
	})
})
