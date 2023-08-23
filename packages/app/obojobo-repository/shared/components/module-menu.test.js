jest.mock('../repository-utils')

import React from 'react'
import { create } from 'react-test-renderer'

import Button from './button'
import ButtonLink from './button-link'
import ModuleMenu from './module-menu'
import { FULL, PARTIAL, MINIMAL } from 'obojobo-express/server/constants'

describe('ModuleMenu', () => {
	let defaultProps

	let mockRepositoryUtils

	beforeEach(() => {
		jest.resetAllMocks()

		defaultProps = {
			draftId: 'mockDraftId',
			editor: 'mockEditorType',
			accessLevel: MINIMAL
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

	test('ModuleMenu renders correctly with "Minimal" access level, no readOnly', () => {
		defaultProps.accessLevel = MINIMAL
		const component = create(<ModuleMenu {...defaultProps} />)

		// Shouldn't be an 'Edit' button or a 'Synchronize' button
		const buttonLinks = component.root.findAllByType(ButtonLink)
		expect(buttonLinks.length).toBe(1)
		expect(buttonLinks[0].props.children).toBe('Preview')

		// Shouldn't be a 'Share' button'
		const buttons = component.root.findAllByType(Button)
		expect(buttons.length).toBe(1)
		expect(buttons[0].props.children).toBe('More...')

		expect(component.toJSON()).toMatchSnapshot()
	})
	test('ModuleMenu renders correctly with "Minimal" access level, readOnly false', () => {
		defaultProps.accessLevel = MINIMAL
		defaultProps.readOnly = false
		const component = create(<ModuleMenu {...defaultProps} />)

		// Shouldn't be an 'Edit' button or a 'Synchronize' button
		const buttonLinks = component.root.findAllByType(ButtonLink)
		expect(buttonLinks.length).toBe(1)
		expect(buttonLinks[0].props.children).toBe('Preview')

		// Shouldn't be a 'Share' button'
		const buttons = component.root.findAllByType(Button)
		expect(buttons.length).toBe(1)
		expect(buttons[0].props.children).toBe('More...')

		expect(component.toJSON()).toMatchSnapshot()
	})
	test('ModuleMenu renders correctly with "Minimal" access level, readOnly true', () => {
		defaultProps.accessLevel = MINIMAL
		defaultProps.readOnly = true
		const component = create(<ModuleMenu {...defaultProps} />)

		// Shouldn't be an 'Edit' button or a 'Synchronize' button
		const buttonLinks = component.root.findAllByType(ButtonLink)
		expect(buttonLinks.length).toBe(1)
		expect(buttonLinks[0].props.children).toBe('Preview')

		// Shouldn't be a 'Share' button'
		const buttons = component.root.findAllByType(Button)
		expect(buttons.length).toBe(1)
		expect(buttons[0].props.children).toBe('More...')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ModuleMenu renders correctly with "Partial" access level, no readOnly', () => {
		defaultProps.accessLevel = PARTIAL
		const component = create(<ModuleMenu {...defaultProps} />)

		// Should be an 'Edit' button, shouldn't be a 'Synchronize' button
		const buttonLinks = component.root.findAllByType(ButtonLink)
		expect(buttonLinks.length).toBe(2)
		expect(buttonLinks[0].props.children).toBe('Preview')
		expect(buttonLinks[1].props.children).toBe('Edit')

		// Shouldn't be a 'Share' button'
		const buttons = component.root.findAllByType(Button)
		expect(buttons.length).toBe(1)
		expect(buttons[0].props.children).toBe('More...')

		expect(component.toJSON()).toMatchSnapshot()
	})
	test('ModuleMenu renders correctly with "Partial" access level, readOnly false', () => {
		defaultProps.accessLevel = PARTIAL
		defaultProps.readOnly = false
		const component = create(<ModuleMenu {...defaultProps} />)

		// Should be an 'Edit' button, shouldn't be a 'Synchronize' button
		const buttonLinks = component.root.findAllByType(ButtonLink)
		expect(buttonLinks.length).toBe(2)
		expect(buttonLinks[0].props.children).toBe('Preview')
		expect(buttonLinks[1].props.children).toBe('Edit')

		// Shouldn't be a 'Share' button'
		const buttons = component.root.findAllByType(Button)
		expect(buttons.length).toBe(1)
		expect(buttons[0].props.children).toBe('More...')

		expect(component.toJSON()).toMatchSnapshot()
	})
	test('ModuleMenu renders correctly with "Partial" access level, readOnly true', () => {
		defaultProps.accessLevel = PARTIAL
		defaultProps.readOnly = true
		const component = create(<ModuleMenu {...defaultProps} />)

		// Shouldn't be an 'Edit' button
		const buttonLinks = component.root.findAllByType(ButtonLink)
		expect(buttonLinks.length).toBe(1)
		expect(buttonLinks[0].props.children).toBe('Preview')

		// Shouldn't be a 'Share' button', should be a 'Synchronize' button
		const buttons = component.root.findAllByType(Button)
		expect(buttons.length).toBe(2)
		expect(buttons[0].props.children).toBe('Synchronize')
		expect(buttons[1].props.children).toBe('More...')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ModuleMenu renders correctly with "Full" access level, no readOnly', () => {
		defaultProps.accessLevel = FULL
		const component = create(<ModuleMenu {...defaultProps} />)

		// Should be an 'Edit' button, shouldn't be a 'Synchronize' button
		const buttonLinks = component.root.findAllByType(ButtonLink)
		expect(buttonLinks.length).toBe(2)
		expect(buttonLinks[0].props.children).toBe('Preview')
		expect(buttonLinks[1].props.children).toBe('Edit')

		// Should be a 'Share' button'
		const buttons = component.root.findAllByType(Button)
		expect(buttons.length).toBe(2)
		expect(buttons[0].props.children).toBe('Share')
		expect(buttons[1].props.children).toBe('More...')

		expect(component.toJSON()).toMatchSnapshot()
	})
	test('ModuleMenu renders correctly with "Full" access level, readOnly false', () => {
		defaultProps.accessLevel = FULL
		defaultProps.readOnly = false
		const component = create(<ModuleMenu {...defaultProps} />)

		// Should be an 'Edit' button, shouldn't be a 'Synchronize' button
		const buttonLinks = component.root.findAllByType(ButtonLink)
		expect(buttonLinks.length).toBe(2)
		expect(buttonLinks[0].props.children).toBe('Preview')
		expect(buttonLinks[1].props.children).toBe('Edit')

		// Should be a 'Share' button'
		const buttons = component.root.findAllByType(Button)
		expect(buttons.length).toBe(2)
		expect(buttons[0].props.children).toBe('Share')
		expect(buttons[1].props.children).toBe('More...')

		expect(component.toJSON()).toMatchSnapshot()
	})
	test('ModuleMenu renders correctly with "Full" access level, readOnly true', () => {
		defaultProps.accessLevel = FULL
		defaultProps.readOnly = true
		const component = create(<ModuleMenu {...defaultProps} />)

		// Shouldn't be an 'Edit' button
		const buttonLinks = component.root.findAllByType(ButtonLink)
		expect(buttonLinks.length).toBe(1)
		expect(buttonLinks[0].props.children).toBe('Preview')

		// Should be a 'Share' button', should be a 'Synchronize' button
		const buttons = component.root.findAllByType(Button)
		expect(buttons.length).toBe(3)
		expect(buttons[0].props.children).toBe('Synchronize')
		expect(buttons[1].props.children).toBe('Share')
		expect(buttons[2].props.children).toBe('More...')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ModuleMenu renders correctly with className prop', () => {
		defaultProps.className = 'extra-class'
		defaultProps.accessLevel = FULL
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

	test('"Synchronize" button onClick calls showModuleSync', () => {
		defaultProps.showModuleSync = jest.fn()
		defaultProps.accessLevel = FULL
		defaultProps.readOnly = true
		const component = create(<ModuleMenu {...defaultProps} />)

		component.root.findAllByType(Button)[0].props.onClick()

		expect(defaultProps.showModuleSync).toHaveBeenCalledTimes(1)
		expect(defaultProps.showModuleSync).toHaveBeenCalledWith(defaultProps)
	})
})
