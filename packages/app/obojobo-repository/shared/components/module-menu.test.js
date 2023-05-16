jest.mock('../repository-utils')

import React from 'react'
import { create } from 'react-test-renderer'

import Button from './button'
import ModuleMenu from './module-menu'
import { FULL, PARTIAL, MINIMAL } from 'obojobo-express/server/constants'

describe('ModuleMenu', () => {
	let defaultProps

	let mockRepositoryUtils

	beforeEach(() => {
		jest.resetAllMocks()

		defaultProps = {
			draftId: 'mockDraftId',
			editor: 'mockEditorType'
		}

		mockRepositoryUtils = require('../repository-utils')
		mockRepositoryUtils.urlForEditor.mockReturnValue('/url/for/editor')
	})

	test('ModuleMenu renders correctly with standard expected props', () => {
		const component = create(<ModuleMenu {...defaultProps} />)

		const menuDiv = component.root.findByProps({
			className: 'repository--module-icon--menu-wrapper'
		}).children[0]

		expect(menuDiv.props.className).toBe('repository--module-icon--menu ')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ModuleMenu renders correctly with "Minimal" access level', () => {
		defaultProps.accessLevel = MINIMAL
		const component = create(<ModuleMenu {...defaultProps} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ModuleMenu renders correctly with "Partial" access level', () => {
		defaultProps.accessLevel = PARTIAL
		const component = create(<ModuleMenu {...defaultProps} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ModuleMenu renders correctly with "Full" access level', () => {
		defaultProps.accessLevel = FULL
		const component = create(<ModuleMenu {...defaultProps} />)
		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ModuleMenu renders correctly with className prop', () => {
		defaultProps.className = 'extra-class'
		const component = create(<ModuleMenu {...defaultProps} />)

		const menuDiv = component.root.findByProps({
			className: 'repository--module-icon--menu-wrapper'
		}).children[0]

		expect(menuDiv.props.className).toBe('repository--module-icon--menu extra-class')

		expect(mockRepositoryUtils.urlForEditor).toHaveBeenCalledTimes(1)
		expect(mockRepositoryUtils.urlForEditor).toHaveBeenCalledWith('mockEditorType', 'mockDraftId')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('"Share" button onClick calls showModulePermissions', () => {
		defaultProps.showModulePermissions = jest.fn()
		defaultProps.accessLevel = FULL
		const component = create(<ModuleMenu {...defaultProps} />)

		component.root.findAllByType(Button)[0].props.onClick()

		expect(defaultProps.showModulePermissions).toHaveBeenCalledTimes(1)
		expect(defaultProps.showModulePermissions).toHaveBeenCalledWith(defaultProps)
	})

	test('"More..." button onClick calls showModuleMore', () => {
		defaultProps.showModuleMore = jest.fn()
		defaultProps.accessLevel = FULL
		const component = create(<ModuleMenu {...defaultProps} />)

		component.root.findAllByType(Button)[1].props.onClick()

		expect(defaultProps.showModuleMore).toHaveBeenCalledTimes(1)
		expect(defaultProps.showModuleMore).toHaveBeenCalledWith(defaultProps)
	})
})
