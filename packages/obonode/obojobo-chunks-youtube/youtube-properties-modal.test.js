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

		// expect(onConfirm).not.toHaveBeenCalled()
		expect(spy).toHaveBeenCalledWith({ startTimeError: 'Start time must be > 0' })
	})

	test('YouTubeProperties component checks endTime before confirming', () => {
		const onConfirm = jest.fn()
		const mockContent = { startTime: 100 }
		const component = mount(<YouTubeProperties onConfirm={onConfirm} content={mockContent} />)
		const spy = jest.spyOn(component.instance(), 'setState')

		component
			.find('input')
			.at(4)
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
			.at(3)
			.simulate('change', {
				target: {
					value: 100
				}
			})

		component
			.find('input')
			.at(4)
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

	test('YouTubeProperties component received a valid url', () => {
		// const onConfirm = jest.fn()
		//const mockContent = { videoUrl: 'https://www.youtube.com/watch?v=MiEoW5Hg_lw' }
		//const component = mount(<YouTubeProperties onConfirm={onConfirm} content={mockContent} />)

		const mockContent = { startTime: 20, videoUrl: 'https://www.youtube.com/watch?v=krfcq5pF8u8' }
		const component = mount(<YouTubeProperties content={mockContent} />)
		const tree = component.html()

		component
			.find('input')
			.at(1)
			.simulate('change', {
				target: {
					value: 'https://www.youtube.com/watch?v=krfcq5pF8u8&t=5000'
				}
			})

		// component
		// 	.find('input')
		// 	.at(2)
		// 	.simulate('change', {
		// 		target: {
		// 			value: 0
		// 		}
		// 	})

		// component
		// 	.find('button')
		// 	.at(2)
		// 	.simulate('click')

		// expect(tree).toMatchInlineSnapshot(
		// 	`"<div class=\\"obojobo-draft--components--modal--simple-dialog\\"><div class=\\"obojobo-draft--components--modal--dialog \\"><div class=\\"obojobo-draft--components--modal--modal\\" role=\\"dialog\\" aria-labelledby=\\"obojobo-draft--components--modal--modal--content\\"><input class=\\"first-tab\\" type=\\"text\\"><div class=\\"content\\" id=\\"obojobo-draft--components--modal--modal--content\\"><h1 class=\\"heading\\" style=\\"text-align: center;\\">YouTube Video</h1><div class=\\"dialog-content\\" style=\\"text-align: center;\\"><div class=\\"youtube-video-properties\\"><div class=\\"youtube-video-properties-input-wrapper\\"><label>Youtube video url:</label><div><div class=\\"obojobo-draft--components--more-info-button is-default-label is-mode-hidden\\"><button aria-label=\\"Click to explain youtube video options\\">?</button></div></div></div><input id=\\"obojobo-draft--chunks--youtube--video-url\\" type=\\"text\\" value=\\"https://www.youtube.com/watch?v=MiEoW5Hg_lw\\"><input id=\\"obojobo-draft--chunks--youtube--video-id\\" type=\\"hidden\\" value=\\"\\"><label>Start time (optional):</label><input type=\\"number\\" min=\\"0\\" value=\\"20\\"><small>Seconds or MM:SS format (e.g. 135 or 2:15)</small><span class=\\"error\\"></span><label>End time (optional):</label><input type=\\"number\\" min=\\"1\\" value=\\"\\"><span class=\\"error\\"></span></div></div><div class=\\"controls\\"><div class=\\"obojobo-draft--components--button alt-action is-not-dangerous align-center\\"><button class=\\"button\\" contenteditable=\\"false\\">Cancel</button></div><div class=\\"obojobo-draft--components--button is-not-dangerous align-center\\"><button class=\\"button\\" contenteditable=\\"false\\" tabindex=\\"0\\">OK</button></div></div></div><input class=\\"last-tab\\" type=\\"text\\"></div></div></div>"`
		// )
		expect(tree).toMatchSnapshot()
		// expect(tree).toMatchSnapshot()
		// expect(onConfirm).toHaveBeenCalled()
		// expect(spy).toHaveBeenCalledWith({ endTimeError: 'End time must be > start time' })
	})

	test('YouTubeProperties component received a invalid url', () => {
		const mockContent = { startTime: 5000, videoUrl: 'https://www.youtube.com/watch?v=krfcq5pF8u8' }
		const component = mount(<YouTubeProperties content={mockContent} />)
		const tree = component.html()

		component
			.find('input')
			.at(1)
			.simulate('change', {
				target: {
					value: 'https://www.youtube.com/watchit?v=krfcq5pF8u8&time=5000'
				}
			})

		expect(tree).toMatchSnapshot()
	})
})
