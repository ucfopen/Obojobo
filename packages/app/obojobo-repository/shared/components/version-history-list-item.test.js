import React from 'react'
import { create } from 'react-test-renderer'

import VersionHistoryListItem from './version-history-list-item'

describe('VersionHistoryListItem', () => {
	const standardProps = {
		isLatestVersion: false,
		createdAtDisplay: 'mockCreatedAtDisplay',
		username: 'mockUsername',
		onClick: jest.fn(),
		isSelected: false,
		index: 0,
		versionNumber: 1
	}

	test('renders with standard expected props - default isRestored', () => {
		const component = create(<VersionHistoryListItem {...standardProps} />)

		// isRestored is false by default
		expect(component.root.findAllByProps({ className: 'version restored' }).length).toBe(0)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with standard expected props plus isRestored', () => {
		const component = create(<VersionHistoryListItem {...standardProps} isRestored={true} />)

		// isRestored is false by default
		expect(component.root.findAllByProps({ className: 'version restored' }).length).toBe(1)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('onClick callback is called properly', () => {
		const component = create(<VersionHistoryListItem {...standardProps} />)

		component.root.children[0].props.onClick()

		expect(standardProps.onClick).toHaveBeenCalledTimes(1)
		expect(standardProps.onClick).toHaveBeenCalledWith(standardProps.index)
	})
})
