jest.mock('./search', () => props => {
	return <mock-Search {...props}></mock-Search>
})
import React from 'react'
import { create, act } from 'react-test-renderer'

import PeopleSearchDialog from './people-search-dialog'
import Search from './search'
import PeopleListItem from './people-list-item'

describe('PeopleSearchDialog', () => {
	let defaultProps

	beforeEach(() => {
		defaultProps = {
			currentUserId: 99,
			people: [],
			clearPeopleSearchResults: jest.fn(),
			onSearchChange: jest.fn(),
			onSelectPerson: jest.fn(),
			onClose: jest.fn()
		}
	})

	test('renders with no people', () => {
		let component
		act(() => {
			component = create(<PeopleSearchDialog {...defaultProps} />)
		})

		expect(defaultProps.clearPeopleSearchResults).toHaveBeenCalledTimes(1)

		expect(component.root.findAllByType(PeopleListItem).length).toBe(0)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders with people', () => {
		defaultProps.people = [{ id: 1 }, { id: 2 }, { id: 99 }]
		let component
		act(() => {
			component = create(<PeopleSearchDialog {...defaultProps} />)
		})

		expect(defaultProps.clearPeopleSearchResults).toHaveBeenCalledTimes(1)

		const peopleListItems = component.root.findAllByType(PeopleListItem)
		expect(peopleListItems.length).toBe(3)
		// PeopleListItems have an 'isMe' prop which should only be true if the id
		//  provided is the same as the current user's id
		expect(peopleListItems[0].props.isMe).toBe(false)
		expect(peopleListItems[1].props.isMe).toBe(false)
		expect(peopleListItems[2].props.isMe).toBe(true)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('changing search field should call onSearchChange', () => {
		let component
		act(() => {
			component = create(<PeopleSearchDialog {...defaultProps} />)
		})

		const filterChangePayload = { target: { value: 'string' } }
		component.root.findByType(Search).props.onChange(filterChangePayload)
		expect(defaultProps.onSearchChange).toHaveBeenCalledTimes(1)
		expect(defaultProps.onSearchChange).toHaveBeenCalledWith(filterChangePayload)
	})

	test('clicking a PeopleListItem "Select" button should call onSelectPerson and onClose', () => {
		defaultProps.people = [{ id: 1 }]
		let component
		act(() => {
			component = create(<PeopleSearchDialog {...defaultProps} />)
		})

		expect(defaultProps.clearPeopleSearchResults).toHaveBeenCalledTimes(1)

		component.root
			.findByType(PeopleListItem)
			.findByProps({ className: 'select-button' })
			.props.onClick()
		expect(defaultProps.onSelectPerson).toBeCalledTimes(1)
		expect(defaultProps.onSelectPerson).toBeCalledWith({ id: 1 })

		expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
	})

	test('clicking the "x" button calls onClose', () => {
		let component
		act(() => {
			component = create(<PeopleSearchDialog {...defaultProps} />)
		})

		component.root.findByProps({ className: 'close-button' }).props.onClick()
		expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
	})
})
