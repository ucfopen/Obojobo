import React from 'react'
import YouTubePlayer from './youtube-player'
import { mount } from 'enzyme'

jest.mock('obojobo-document-engine/src/scripts/common/util/uuid', () => {
	return () => 'mockId'
})

describe('YouTubePlayer', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('YouTubePlayer renders correctly', () => {
		const component = mount(<YouTubePlayer />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('YouTubePlayer updates video on content change', () => {
		// Mock YouTube's Iframe Player object
		global.YT = {
			Player: jest.fn(() => ({
				cueVideoById: jest.fn()
			}))
		}

		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		const spy = jest.spyOn(YouTubePlayer.prototype, 'loadVideo')
		const component = mount(<YouTubePlayer content={mockContent} />)

		component.setProps({
			content: {
				...mockContent,
				videoId: 'foo'
			}
		})

		component.setProps({
			content: {
				...mockContent,
				startTime: 4
			}
		})

		component.setProps({
			content: {
				...mockContent,
				endTime: 14
			}
		})

		expect(spy).toHaveBeenCalledTimes(4)
	})

	test("YouTubePlayer doesn't update if content hasn't changed", () => {
		global.YT = {
			Player: jest.fn(() => ({
				destroy: jest.fn(),
				cueVideoById: jest.fn()
			}))
		}

		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		const spy = jest.spyOn(YouTubePlayer.prototype, 'loadVideo')
		const component = mount(<YouTubePlayer content={mockContent} />)

		component.setProps({
			content: {
				...mockContent
			}
		})

		expect(spy).toHaveBeenCalledTimes(1)
		expect(component.instance().player.destroy).not.toHaveBeenCalled()
	})

	test('YouTubePlayer loads Iframe API', () => {
		global.YT = null

		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2,
			test: true
		}

		// Make sure loading multiple videos doesn't break anything
		mount(
			<div>
				<YouTubePlayer content={mockContent} />
				<YouTubePlayer content={mockContent} />
				<YouTubePlayer content={mockContent} />
			</div>
		)

		const callbacks = YouTubePlayer.callbacks

		// Simulate loading YouTube's Player object
		window.YT = {
			Player: jest.fn(() => ({
				destroy: jest.fn(),
				cueVideoById: jest.fn()
			}))
		}
		window.onYouTubeIframeAPIReady()

		callbacks.forEach(cb => expect(cb).toHaveBeenCalled())

		expect(callbacks.length).toEqual(0)
	})
})
