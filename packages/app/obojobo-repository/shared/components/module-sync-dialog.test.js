import React from 'react'
import { create } from 'react-test-renderer'

import ModuleSyncDialog from './module-sync-dialog'

describe('ModuleSyncDialog', () => {
	let defaultProps

	beforeEach(() => {
		jest.resetAllMocks()

		defaultProps = {
			draftId: 'mockDraftId',
			title: 'Mock Draft Title',
			newest: false
		}
	})

	test('ModuleSyncDialog renders with default props', () => {
		const component = create(<ModuleSyncDialog {...defaultProps} />)

		// 'Checking for updates' text should appear by default
		const syncInfoComponent = component.root.findAllByProps({ className: 'sync-info' })
		expect(syncInfoComponent.length).toBe(0)

		const syncInfoTextOnlyComponent = component.root.findAllByProps({
			className: 'sync-info-text-only'
		})
		expect(syncInfoTextOnlyComponent.length).toBe(1)
		expect(syncInfoTextOnlyComponent[0].props.children).toBe(
			"Checking for updates to this module's original..."
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ModuleSyncDialog renders with provided newest as null', () => {
		defaultProps.newest = null
		const component = create(<ModuleSyncDialog {...defaultProps} />)

		// 'No updates' text should appear
		const syncInfoComponent = component.root.findAllByProps({ className: 'sync-info' })
		expect(syncInfoComponent.length).toBe(0)

		const syncInfoTextOnlyComponent = component.root.findAllByProps({
			className: 'sync-info-text-only'
		})
		expect(syncInfoTextOnlyComponent.length).toBe(1)
		expect(syncInfoTextOnlyComponent[0].props.children).toBe(
			'No changes found, copy is up-to-date.'
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('ModuleSyncDialog renders with provided newest module', () => {
		defaultProps.newest = {
			draftId: 'mockOriginalDraftId',
			title: 'Original Mock Draft Title',
			updatedAt: '1999/01/01 01:01'
		}
		const component = create(<ModuleSyncDialog {...defaultProps} />)

		// text-only fields should not appear
		const syncInfoTextOnlyComponent = component.root.findAllByProps({
			className: 'sync-info-text-only'
		})
		expect(syncInfoTextOnlyComponent.length).toBe(0)

		// updated module info should appear
		const syncInfoComponent = component.root.findAllByProps({ className: 'sync-info' })
		expect(syncInfoComponent.length).toBe(1)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('Synchronize button onClick calls syncModuleUpdates', () => {
		defaultProps.syncModuleUpdates = jest.fn()
		defaultProps.newest = {
			draftId: 'mockOriginalDraftId',
			title: 'Original Mock Draft Title',
			updatedAt: '1999/01/01 01:01'
		}
		const component = create(<ModuleSyncDialog {...defaultProps} />)

		const syncButton = component.root.findByProps({ className: 'sync-button' })
		syncButton.props.onClick()

		expect(defaultProps.syncModuleUpdates).toHaveBeenCalledWith('mockDraftId')
	})
})
