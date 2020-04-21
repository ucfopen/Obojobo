jest.mock('obojobo-document-engine/src/scripts/common/util/download-document')
jest.mock('../repository-utils')

import React from 'react'
import { create } from 'react-test-renderer'

import ModuleOptionsDialog from './module-options-dialog'

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
			editor: 'mockEditorType'
		}

		mockRepositoryUtils = require('../repository-utils')
		mockRepositoryUtils.urlForEditor.mockReturnValue('/url/for/editor')
		mockDownloadDocument = require('obojobo-document-engine/src/scripts/common/util/download-document')
	})

	afterAll(() => {
		window.confirm = originalConfirm
	})

	test('ModuleOptionsDialog renders correctly with standard expected props', () => {
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		expect(mockRepositoryUtils.urlForEditor).toHaveBeenCalledTimes(1)
		expect(mockRepositoryUtils.urlForEditor).toHaveBeenCalledWith('mockEditorType', 'mockDraftId')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('"Share" button calls showModulePermissions', () => {
		defaultProps.showModulePermissions = jest.fn()
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		//there are a few buttons on the page using this class
		component.root.findAllByProps({ className: 'new-button' })[0].props.onClick()

		expect(defaultProps.showModulePermissions).toHaveBeenCalledTimes(1)
		expect(defaultProps.showModulePermissions).toHaveBeenCalledWith(defaultProps)
	})

	test('"Manage Collections" button calls showModuleManageCollections', () => {
		defaultProps.showModuleManageCollections = jest.fn()
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		component.root.findAllByProps({ className: 'manage-collections-button' })[0].props.onClick()

		expect(defaultProps.showModuleManageCollections).toHaveBeenCalledTimes(1)
		expect(defaultProps.showModuleManageCollections).toHaveBeenCalledWith(defaultProps)
	})

	test('"Download JSON" button calls downloadDocument with the correct arguments', () => {
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		//there are a few buttons on the page using this class
		component.root.findAllByProps({ className: 'new-button' })[1].props.onClick()

		expect(mockDownloadDocument.downloadDocument).toHaveBeenCalledTimes(1)
		expect(mockDownloadDocument.downloadDocument).toHaveBeenCalledWith('mockDraftId', 'json')
	})

	test('"Download XML" button calls downloadDocument with the correct arguments', () => {
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		//there are a few buttons on the page using this class
		component.root.findAllByProps({ className: 'new-button' })[2].props.onClick()

		expect(mockDownloadDocument.downloadDocument).toHaveBeenCalledTimes(1)
		expect(mockDownloadDocument.downloadDocument).toHaveBeenCalledWith('mockDraftId', 'xml')
	})

	test('"Delete" button brings up confirmation dialog, canceled', () => {
		defaultProps.deleteModule = jest.fn()
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		window.confirm = jest.fn()
		window.confirm.mockReturnValue(false)

		//there are a few buttons on the page using this class
		component.root.findByProps({ className: 'new-button dangerous-button' }).props.onClick()

		expect(window.confirm).toHaveBeenCalledTimes(1)
		expect(window.confirm).toHaveBeenCalledWith('Delete "Mock Module Title" id: mockDraftId ?')

		expect(defaultProps.deleteModule).not.toHaveBeenCalled()
	})

	test('"Delete" button brings up confirmation dialog, confirmed', () => {
		defaultProps.deleteModule = jest.fn()
		const component = create(<ModuleOptionsDialog {...defaultProps} />)

		window.confirm = jest.fn()
		window.confirm.mockReturnValue(true)

		//there are a few buttons on the page using this class
		component.root.findByProps({ className: 'new-button dangerous-button' }).props.onClick()

		expect(window.confirm).toHaveBeenCalledTimes(1)
		expect(window.confirm).toHaveBeenCalledWith('Delete "Mock Module Title" id: mockDraftId ?')

		expect(defaultProps.deleteModule).toHaveBeenCalledTimes(1)
		expect(defaultProps.deleteModule).toHaveBeenCalledWith('mockDraftId')
	})
})
