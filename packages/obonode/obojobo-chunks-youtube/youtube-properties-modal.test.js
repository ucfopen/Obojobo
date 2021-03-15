import React from 'react'
import { mount } from 'enzyme'

import YouTubeProperties from './youtube-properties-modal'

describe('YouTubeProperties modal', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('YouTubeProperties component renders correctly', () => {
		const component = mount(<YouTubeProperties content={{}} />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('YouTubeProperties component focuses on first element', () => {
		const component = mount(<YouTubeProperties content={{}} />)

		component.instance().focusOnFirstElement()
		expect(component.html()).toMatchSnapshot()
	})

	test('YouTubeProperties component changes id', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)
		// find the id input
		component
			.find('input')
			.at(1)
			.simulate('change', {
				target: {
					value: 'mockVideoId'
				}
			})

		// click confirm
		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(onConfirm).toHaveBeenCalled()
		expect(component.html()).toMatchSnapshot()
	})

	test('YouTubeProperties component changes startTime', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)
		// find the startTime input
		component
			.find('input')
			.at(2)
			.simulate('change', {
				target: {
					value: 100
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(onConfirm).toHaveBeenCalled()
	})

	test('YouTubeProperties component changes endTime', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)

		// find the endTime input
		component
			.find('input')
			.at(3)
			.simulate('change', {
				target: {
					value: 100
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(onConfirm).toHaveBeenCalled()
	})

	test('YouTubeProperties component checks startTime before confirming', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)
		const spy = jest.spyOn(component.instance(), 'setState')

		component
			.find('input')
			.at(2)
			.simulate('change', {
				target: {
					value: -1000000
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
		expect(spy).toHaveBeenCalledWith({ startTimeError: 'Start time must be > 0' })
	})

	test('YouTubeProperties component checks endTime before confirming', () => {
		const onConfirm = jest.fn()
		const mockContent = { startTime: 100 }
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={mockContent} />)
		const spy = jest.spyOn(component.instance(), 'setState')

		component
			.find('input')
			.at(3)
			.simulate('change', {
				target: {
					value: -1000000
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
		expect(spy).toHaveBeenCalledWith({ endTimeError: 'End time must be > 0' })
	})

	test('YouTubeProperties component checks endTime is less than startTime', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)
		const spy = jest.spyOn(component.instance(), 'setState')

		component
			.find('input')
			.at(2)
			.simulate('change', {
				target: {
					value: 100
				}
			})

		component
			.find('input')
			.at(3)
			.simulate('change', {
				target: {
					value: 90
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
		expect(spy).toHaveBeenCalledWith({ endTimeError: 'End time must be > start time' })
	})
})
