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
			.at(0)
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
					value: '100'
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(onConfirm).toHaveBeenCalled()
	})

	test('YouTubeProperties component changes startTime onBlur', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)

		// find the endTime input
		component
			.find('input')
			.at(2)
			.simulate('blur', {
				target: {
					value: '100'
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(onConfirm).toHaveBeenCalled()
	})

	test('YouTubeProperties component changes startTime onBlur with string-based time', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)

		component
			.find('input')
			.at(2)
			.simulate('change', {
				target: {
					value: '00:05'
				}
			})
			.simulate('blur')

		expect(component.html()).toMatchSnapshot()
	})

	test('YouTubeProperties component changes startTime onBlur with text', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)

		component
			.find('input')
			.at(2)
			.simulate('change', {
				target: {
					value: 'test'
				}
			})
			.simulate('blur')

		expect(component.html()).toMatchSnapshot()
	})

	test('YouTubeProperties component checks startTime before confirming', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)
		const spy = jest.spyOn(component.instance(), 'setState')

		component
			.find('input')
			.at(3)
			.simulate('change', {
				target: {
					value: '-1000000'
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(spy).toHaveBeenCalledWith({ startTimeError: 'Start time must be > 0' })
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
					value: '100'
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(onConfirm).toHaveBeenCalled()
	})

	test('YouTubeProperties component changes endTime onBlur', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)

		// find the endTime input
		component
			.find('input')
			.at(3)
			.simulate('blur', {
				target: {
					value: '100'
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(onConfirm).toHaveBeenCalled()
	})

	test('YouTubeProperties component checks endTime before confirming', () => {
		const onConfirm = jest.fn()
		const mockContent = { endTime: 100 }
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={mockContent} />)
		const spy = jest.spyOn(component.instance(), 'setState')

		component
			.find('input')
			.at(4)
			.simulate('change', {
				target: {
					value: -3
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
			.at(3)
			.simulate('change', {
				target: {
					value: '100'
				}
			})

		component
			.find('input')
			.at(4)
			.simulate('change', {
				target: {
					value: '90'
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(onConfirm).not.toHaveBeenCalled()
		expect(spy).toHaveBeenCalledWith({ endTimeError: 'End time must be > start time' })
	})

	test('YouTubeProperties component changes endTime onBlur with string-based time', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)

		component
			.find('input')
			.at(4)
			.simulate('blur', {
				target: {
					value: '00:05'
				}
			})

		expect(component.html()).toMatchSnapshot()
	})

	test('YouTubeProperties component changes endTime onBlur with string-based time', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)

		component
			.find('input')
			.at(4)
			.simulate('blur', {
				target: {
					value: '10'
				}
			})

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(component.html()).toMatchSnapshot()
		expect(onConfirm).toHaveBeenCalled()
	})

	test('YouTubeProperties component changes endTime onBlur with text', () => {
		const onConfirm = jest.fn()
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={{}} />)

		component
			.find('input')
			.at(4)
			.simulate('change', {
				target: {
					value: 'test'
				}
			})
			.simulate('blur')

		expect(component.html()).toMatchSnapshot()
	})

	test('YouTubeProperties component received a valid url', () => {
		const mockContent = { startTime: 20, videoUrl: 'https://www.youtube.com/watch?v=krfcq5pF8u8' }
		const component = mount(<YouTubeProperties content={mockContent} />)

		component
			.find('input')
			.at(1)
			.simulate('change', {
				target: {
					value: 'https://www.youtube.com/watch?v=krfcq5pF8u8&t=5000'
				}
			})
			.simulate('blur')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('YouTubeProperties component received a invalid url', () => {
		const mockContent = { startTime: 5000, videoUrl: 'https://www.youtube.com/watch?v=krfcq5pF8u8' }
		const component = mount(<YouTubeProperties content={mockContent} />)

		component
			.find('input')
			.at(1)
			.simulate('change', {
				target: {
					value: 'https://www.youtube.com/watchit?v=krfcq5pF8u8&time=5000'
				}
			})

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('YouTubeProperties component received a invalid url', () => {
		const mockContent = { startTime: 5000 }
		const component = mount(<YouTubeProperties content={mockContent} />)

		component
			.find('#obojobo-draft--chunks--youtube--video-url')
			.simulate('change', {
				target: {
					value: 'https://www.youtube.com/krfcq5pF8u8'
				}
			})
			.simulate('blur')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('YouTubeProperties component received a invalid url', () => {
		const mockContent = { startTime: 5000 }
		const component = mount(<YouTubeProperties content={mockContent} />)

		component
			.find('#obojobo-draft--chunks--youtube--video-url')
			.simulate('change', {
				target: {
					value: 'https://www.youtube'
				}
			})
			.simulate('blur')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})
})
