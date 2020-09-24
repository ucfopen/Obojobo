import React from 'react'
import PeopleListItem from './people-list-item'
import { create } from 'react-test-renderer'

describe('PeopleListItem', () => {
	// this should never happen
	test('renders correctly with default props', () => {
		const component = create(<PeopleListItem />)

		// for some reason the 'full name' chunk, the 'is me' chunk, and
		//  the single space character between them all count as separate children
		const userNameChildren = component.root.findByProps({ className: 'user-name' }).children
		expect(userNameChildren.length).toBe(2)
		expect(userNameChildren[0]).toBe(' ')
		expect(userNameChildren[1]).toBe(' ')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with standard props provided', () => {
		const itemProps = {
			firstName: 'firstName',
			lastName: 'lastName'
		}
		const component = create(<PeopleListItem {...itemProps}>usuallyAButton</PeopleListItem>)

		const userNameChildren = component.root.findByProps({ className: 'user-name' }).children
		expect(userNameChildren.length).toBe(2)
		expect(userNameChildren[0]).toBe('firstName lastName')
		expect(userNameChildren[1]).toBe(' ')

		expect(component.root.children[0].children[2]).toBe('usuallyAButton')

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('renders correctly with standard props plus "isMe=true" provided', () => {
		const itemProps = {
			firstName: 'firstName',
			lastName: 'lastName',
			isMe: true
		}
		const component = create(<PeopleListItem {...itemProps}>usuallyAButton</PeopleListItem>)

		const userNameChildren = component.root.findByProps({ className: 'user-name' }).children
		expect(userNameChildren.length).toBe(3)
		expect(userNameChildren[0]).toBe('firstName lastName')
		expect(userNameChildren[1]).toBe(' ')
		expect(userNameChildren[2].children[0]).toBe('(me)')

		expect(component.root.children[0].children[2]).toBe('usuallyAButton')

		expect(component.toJSON()).toMatchSnapshot()
	})
})
