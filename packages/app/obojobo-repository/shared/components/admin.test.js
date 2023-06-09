import React from 'react'
import { create, act } from 'react-test-renderer'
// import Button from './button'

jest.mock('./people-list-item', () => props => {
	return <mock-PeopleListItem>{props.children}</mock-PeopleListItem>
})
import PeopleListItem from './people-list-item'

jest.mock('./search', () => props => {
	return <mock-Search>{props.children}</mock-Search>
})
import Search from './search'

jest.mock('../util/implicit-perms', () => ({
	POSSIBLE_PERMS: ['perm1', 'perm2', 'perm3', 'perm4', 'mockExtraPerm'],
	PERMS_PER_ROLE: {
		role1: ['perm1', 'perm2', 'perm3'],
		role2: ['perm4']
	}
}))

import Admin from './admin'

describe('Admin', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	const defaultProps = {
		currentUser: {
			id: 99,
			avatarUrl: '/path/to/avatar',
			firstName: 'firstName',
			lastName: 'lastName',
			perms: [
				'canViewEditor',
				'canEditDrafts',
				'canDeleteDrafts',
				'canCreateDrafts',
				'canPreviewDrafts'
			]
		},
		addUserPermission: jest.fn(),
		removeUserPermission: jest.fn(),
		searchForUser: jest.fn(),
		clearPeopleSearchResults: jest.fn()
	}

	test('renders default view correctly', () => {
		const component = create(<Admin {...defaultProps} />)

		// should only be a search input visible by default, no search results
		expect(component.root.findAllByType(PeopleListItem).length).toBe(0)
		expect(component.root.findByProps({ className: 'user-list' }).children.length).toBe(0)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('renders user search results correctly', () => {
		const newProps = { ...defaultProps }
		newProps.searchUsers = {
			items: [
				{ id: 1, firstName: 'Mock', lastName: 'User1' },
				{ id: 2, firstName: 'Mock', lastName: 'User2' },
				{ id: 3, firstName: 'Mock', lastName: 'User3' },
				// just to make sure the current user doesn't show up in the list
				{ ...defaultProps.currentUser }
			]
		}

		const component = create(<Admin {...newProps} />)
		const searchResults = component.root.findAllByType(PeopleListItem)
		expect(searchResults.length).toBe(3)
		// bit inelegant but does the job
		searchResults.forEach(i => {
			expect(i.props.isMe).toBe(false)
			expect(i.props.firstName).not.toBe(defaultProps.currentUser.firstName)
			expect(i.props.lastName).not.toBe(defaultProps.currentUser.lastName)
		})
	})

	test('calls functions appropriately when search value changes', () => {
		const component = create(<Admin {...defaultProps} />)
		act(() => {
			// ordinarily there'd be targets and values to parse, but the Search component does that for us
			component.root.findByType(Search).props.onChange('mock-new-search-value')
		})

		expect(defaultProps.searchForUser).toHaveBeenCalledTimes(1)
		expect(defaultProps.searchForUser).toHaveBeenCalledWith('mock-new-search-value')
	})

	test('sets selected user correctly - no roles or explicit perms', () => {
		const newProps = { ...defaultProps }
		newProps.searchUsers = {
			items: [
				{
					id: 1,
					firstName: 'Mock',
					lastName: 'User1',
					roles: [],
					perms: []
				}
			]
		}

		const component = create(<Admin {...newProps} />)

		// pre-selection state - make sure the search tools are visible
		expect(component.root.findAllByType('mock-Search').length).toBe(1)
		expect(component.root.findAllByProps({ className: 'tool' }).length).toBe(0)

		act(() => {
			component.root.findByType(PeopleListItem).children[0].children[0].props.onClick()
		})

		// post-selection state - make sure the search tools are no longer available
		expect(component.root.findAllByType('mock-Search').length).toBe(0)
		expect(component.root.findAllByProps({ className: 'tool' }).length).toBe(1)

		const implicitContainer = component.root.findByProps({ className: 'implicit-perms-container' })
		expect(implicitContainer.findAllByType('ul').length).toBe(0)
		expect(implicitContainer.children[implicitContainer.children.length - 1]).toBe('None')

		const explicitContainer = component.root.findByProps({ className: 'explicit-perms-container' })
		expect(explicitContainer.findAllByType('ul').length).toBe(0)
		expect(explicitContainer.children[explicitContainer.children.length - 1]).toBe('None')

		// for good measure, make sure the permissions list is populated correctly and the add/remove buttons appear
		// this is a bit brute force-y, but at least we know for sure
		// also a bit magical since we happen to know what the mocked values are
		const expectedSelectOptions = [
			'no-select-permission', // this will always be there
			'perm1',
			'perm2',
			'perm3',
			'perm4',
			'mockExtraPerm'
		]
		const permSelect = component.root.findByType('select')
		expectedSelectOptions.forEach((v, i) => {
			expect(permSelect.findAllByType('option')[i].props.value).toBe(v)
		})

		const buttons = component.root.findAllByProps({ className: 'tool-button' })
		expect(buttons.length).toBe(2)
		expect(buttons[0].children[0].children[0]).toBe('Add')
		expect(buttons[1].children[0].children[0]).toBe('Remove')
	})

	test('sets selected user correctly - one role and explicit perms', () => {
		const newProps = { ...defaultProps }
		newProps.searchUsers = {
			items: [
				{
					id: 1,
					firstName: 'Mock',
					lastName: 'User1',
					roles: ['role1'],
					perms: ['perm1', 'perm2', 'perm3', 'mockExtraPerm']
				}
			]
		}

		const component = create(<Admin {...newProps} />)

		act(() => {
			component.root.findByType(PeopleListItem).children[0].children[0].props.onClick()
		})

		const implicitContainer = component.root.findByProps({ className: 'implicit-perms-container' })
		// the 'single' rendered string is actually three strings, since the singular/plural part is interpolated
		// checking to make sure 'role' isn't 'roles' since any number greater than one requires the extra 's'
		expect(implicitContainer.findByType('span').children).toEqual([
			'Current implicit permissions from role',
			'',
			':'
		])
		expect(implicitContainer.findAllByType('ul').length).toBe(1)
		// we happen to know what this should be based on our mock of the role-based perms at the top of this file
		// ...but ideally this shouldn't be a magical number
		expect(implicitContainer.findByType('ul').children.length).toBe(3)

		const explicitContainer = component.root.findByProps({ className: 'explicit-perms-container' })
		expect(explicitContainer.findByType('ul').children.length).toBe(1)
		expect(explicitContainer.findByType('ul').children[0].children[0]).toBe('mockExtraPerm')
	})

	test('sets selected user correctly - multiple roles', () => {
		const newProps = { ...defaultProps }
		newProps.searchUsers = {
			items: [
				{
					id: 1,
					firstName: 'Mock',
					lastName: 'User1',
					roles: ['role1', 'role2'],
					perms: ['perm1', 'perm2', 'perm3', 'perm4', 'mockExtraPerm']
				}
			]
		}

		const component = create(<Admin {...newProps} />)

		act(() => {
			component.root.findByType(PeopleListItem).children[0].children[0].props.onClick()
		})

		const implicitContainer = component.root.findByProps({ className: 'implicit-perms-container' })

		expect(implicitContainer.findByType('span').children).toEqual([
			'Current implicit permissions from role',
			's',
			':'
		])
		expect(implicitContainer.findAllByType('ul').length).toBe(2)
		// same situation - we know what order these will be in because we mocked them to show up this way, but... magical
		expect(implicitContainer.findAllByType('ul')[0].children.length).toBe(3)
		expect(implicitContainer.findAllByType('ul')[0].children[0].children[0]).toBe('perm1')
		expect(implicitContainer.findAllByType('ul')[0].children[1].children[0]).toBe('perm2')
		expect(implicitContainer.findAllByType('ul')[0].children[2].children[0]).toBe('perm3')

		expect(implicitContainer.findAllByType('ul')[1].children.length).toBe(1)
		expect(implicitContainer.findAllByType('ul')[1].children[0].children[0]).toBe('perm4')

		const explicitContainer = component.root.findByProps({ className: 'explicit-perms-container' })
		expect(explicitContainer.findByType('ul').children.length).toBe(1)
		expect(explicitContainer.findByType('ul').children[0].children[0]).toBe('mockExtraPerm')
	})

	test('does nothing when trying to add or remove before selecting a valid permission', () => {
		const newProps = { ...defaultProps }
		newProps.searchUsers = {
			items: [
				{
					id: 1,
					firstName: 'Mock',
					lastName: 'User1',
					roles: ['role1'],
					perms: ['perm1', 'perm2', 'perm3']
				}
			]
		}

		const component = create(<Admin {...newProps} />)

		act(() => {
			component.root.findByType(PeopleListItem).children[0].children[0].props.onClick()
		})

		// without selecting a new permission, try adding and removing to make sure they don't do anything
		const buttons = component.root.findAllByProps({ className: 'tool-button' })

		// clicking the 'Add' button should do nothing
		act(() => {
			buttons[0].props.onClick()
		})
		expect(newProps.addUserPermission).not.toHaveBeenCalled()

		// clicking the 'Remove' button should do nothing
		act(() => {
			buttons[1].props.onClick()
		})
		expect(newProps.removeUserPermission).not.toHaveBeenCalled()
	})

	test('sends the correct permission to the API utility when adding - success response', async () => {
		const mockUser = {
			id: 43,
			firstName: 'Mock',
			lastName: 'User1',
			roles: ['role1'],
			perms: ['perm1', 'perm2', 'perm3']
		}

		const newProps = { ...defaultProps }
		newProps.searchUsers = {
			items: [{ ...mockUser }]
		}

		newProps.addUserPermission = jest.fn().mockResolvedValueOnce({
			payload: {
				status: 'ok',
				value: { ...mockUser, perms: ['perm1', 'perm2', 'perm3', 'perm4'] }
			}
		})

		const component = create(<Admin {...newProps} />)

		act(() => {
			component.root.findByType(PeopleListItem).children[0].children[0].props.onClick()
		})

		// make sure there are no explicit perms before we add one
		const explicitContainer = component.root.findByProps({ className: 'explicit-perms-container' })
		expect(explicitContainer.findAllByType('ul').length).toBe(0)

		// as a bonus we're also making sure the permission selection update works properly
		// since there's no real way of checking that independently
		// make sure clicking the 'Add' button calls functions appropriately
		const permSelect = component.root.findByType('select')
		const buttons = component.root.findAllByProps({ className: 'tool-button' })
		act(() => {
			// ordinarily this value would come from the selected option attached to the change event
			// we can just simulate the change event's target's value here
			const mockChangeEvent = { target: { value: 'perm4' } }
			permSelect.props.onChange(mockChangeEvent)
		})
		await act(async () => {
			await buttons[0].props.onClick()
		})

		expect(newProps.addUserPermission).toHaveBeenCalledTimes(1)
		expect(newProps.addUserPermission).toHaveBeenCalledWith(mockUser.id, 'perm4')

		// on success, the implicit/explicit perms areas should update with any changes
		// we added an explicit change this time so we can check that
		expect(explicitContainer.findByType('ul').children.length).toBe(1)
		expect(explicitContainer.findByType('ul').children[0].children[0]).toBe('perm4')
	})
	test('sends the correct permission to the API utility when adding - non-success response', async () => {
		const mockUser = {
			id: 43,
			firstName: 'Mock',
			lastName: 'User1',
			roles: ['role1'],
			perms: ['perm1', 'perm2', 'perm3']
		}

		const newProps = { ...defaultProps }
		newProps.searchUsers = {
			items: [{ ...mockUser }]
		}

		newProps.addUserPermission = jest.fn().mockResolvedValueOnce({
			payload: { status: 'not-ok' }
		})

		const component = create(<Admin {...newProps} />)

		act(() => {
			component.root.findByType(PeopleListItem).children[0].children[0].props.onClick()
		})

		// make sure there are no explicit perms before we try adding one
		const explicitContainer = component.root.findByProps({ className: 'explicit-perms-container' })
		expect(explicitContainer.findAllByType('ul').length).toBe(0)

		const permSelect = component.root.findByType('select')
		const buttons = component.root.findAllByProps({ className: 'tool-button' })
		act(() => {
			const mockChangeEvent = { target: { value: 'perm4' } }
			permSelect.props.onChange(mockChangeEvent)
		})
		await act(async () => {
			await buttons[0].props.onClick()
		})

		expect(newProps.addUserPermission).toHaveBeenCalledTimes(1)
		expect(newProps.addUserPermission).toHaveBeenCalledWith(mockUser.id, 'perm4')

		// response wasn't successful, make sure nothing changed
		expect(explicitContainer.findAllByType('ul').length).toBe(0)
	})

	test('sends the correct permission to the API utility when removing - success response', async () => {
		const mockUser = {
			id: 43,
			firstName: 'Mock',
			lastName: 'User1',
			roles: ['role1'],
			perms: ['perm1', 'perm2', 'perm3', 'perm4']
		}

		const newProps = { ...defaultProps }
		newProps.searchUsers = {
			items: [{ ...mockUser }]
		}

		newProps.removeUserPermission = jest.fn().mockResolvedValueOnce({
			payload: {
				status: 'ok',
				value: { ...mockUser, perms: ['perm1', 'perm2', 'perm3'] }
			}
		})

		const component = create(<Admin {...newProps} />)

		act(() => {
			component.root.findByType(PeopleListItem).children[0].children[0].props.onClick()
		})

		// make sure the single explicit perm is shown before we remove it
		const explicitContainer = component.root.findByProps({ className: 'explicit-perms-container' })
		expect(explicitContainer.findByType('ul').children.length).toBe(1)
		expect(explicitContainer.findByType('ul').children[0].children[0]).toBe('perm4')

		// make sure clicking the 'Remove' button calls functions appropriately
		const permSelect = component.root.findByType('select')
		const buttons = component.root.findAllByProps({ className: 'tool-button' })
		act(() => {
			const mockChangeEvent = { target: { value: 'perm4' } }
			permSelect.props.onChange(mockChangeEvent)
		})
		await act(async () => {
			await buttons[1].props.onClick()
		})

		expect(newProps.removeUserPermission).toHaveBeenCalledTimes(1)
		expect(newProps.removeUserPermission).toHaveBeenCalledWith(mockUser.id, 'perm4')

		// we removed the only explicit perm, make sure that's reflected properly
		expect(explicitContainer.findAllByType('ul').length).toBe(0)
	})
	test('sends the correct permission to the API utility when removing - success response', async () => {
		const mockUser = {
			id: 43,
			firstName: 'Mock',
			lastName: 'User1',
			roles: ['role1'],
			perms: ['perm1', 'perm2', 'perm3', 'perm4']
		}

		const newProps = { ...defaultProps }
		newProps.searchUsers = {
			items: [{ ...mockUser }]
		}

		newProps.removeUserPermission = jest.fn().mockResolvedValueOnce({
			payload: {
				status: 'not-ok'
			}
		})

		const component = create(<Admin {...newProps} />)

		act(() => {
			component.root.findByType(PeopleListItem).children[0].children[0].props.onClick()
		})

		const explicitContainer = component.root.findByProps({ className: 'explicit-perms-container' })
		expect(explicitContainer.findByType('ul').children.length).toBe(1)
		expect(explicitContainer.findByType('ul').children[0].children[0]).toBe('perm4')

		const permSelect = component.root.findByType('select')
		const buttons = component.root.findAllByProps({ className: 'tool-button' })
		act(() => {
			const mockChangeEvent = { target: { value: 'perm4' } }
			permSelect.props.onChange(mockChangeEvent)
		})
		await act(async () => {
			await buttons[1].props.onClick()
		})

		expect(newProps.removeUserPermission).toHaveBeenCalledTimes(1)
		expect(newProps.removeUserPermission).toHaveBeenCalledWith(mockUser.id, 'perm4')

		// response wasn't successful, make sure nothing changed
		expect(explicitContainer.findByType('ul').children.length).toBe(1)
		expect(explicitContainer.findByType('ul').children[0].children[0]).toBe('perm4')
	})
})
