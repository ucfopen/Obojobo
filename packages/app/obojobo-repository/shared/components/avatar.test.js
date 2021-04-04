import React from 'react'
import Avatar from './avatar'
import { mount } from 'enzyme'

describe('Avatar', () => {
	test('Avatar renders correctly with no props', () => {
		const component = mount(<Avatar />)

		expect(component.find('.avatar').prop('className')).toBe('avatar ')
		expect(component.find('img').prop('alt')).toBe('')
		expect(component.find('.avatar--notice').length).toBe(0)
	})

	test('Avatar renders correctly with props provided', () => {
		const mockProps = {
			className: 'extraClass',
			avatarUrl: 'path/to/avatar',
			alt: 'avatar alt text',
			notice: 'notice text'
		}
		const component = mount(<Avatar {...mockProps} />)

		expect(component.find('.avatar').prop('className')).toBe('avatar extraClass')
		expect(component.find('img').prop('alt')).toBe('avatar alt text')
		expect(component.find('.avatar--notice').length).toBe(1)
	})
})
