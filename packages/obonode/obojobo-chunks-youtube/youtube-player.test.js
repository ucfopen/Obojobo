import React from 'react'
import YouTubePlayer from './youtube-player'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const MediaUtil = Viewer.util.MediaUtil

import { mount } from 'enzyme'

jest.mock('obojobo-document-engine/src/scripts/common/util/insert-dom-tag', () => () => {
	// simulate loading the youtube iframe api
	global.window.onYouTubeIframeAPIReady()
})
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
		window.YT = {
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

	test('YouTubePlayer does not update if content has not changed', () => {
		window.YT = {
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
})

describe('YouTubePlayer events', () => {
	let getCurrentTime
	let player

	beforeEach(() => {
		jest.clearAllMocks()
		jest.mock('obojobo-document-engine/src/scripts/viewer')
		jest.mock('./youtube-player')

		getCurrentTime = jest.fn()
		getCurrentTime.mockReturnValue(2) // simulates a currentPlayheadPosition to compared with the currentState.playheadPosition

		player = {
			getCurrentTime: getCurrentTime
		}
	})

	test('Unstarted event is received', () => {
		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		const component = mount(<YouTubePlayer content={mockContent} />)
		component.instance().player = player
		component.instance().state = {
			action: 'paused',
			...component.instance().state
		}

		component.instance().onStateChange({ data: -1 })

		expect(component.instance().state).toEqual(
			expect.objectContaining({
				action: 'unstarted'
			})
		)
	})

	test('Cued event is received', () => {
		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		const component = mount(<YouTubePlayer content={mockContent} />)
		component.instance().player = player
		component.instance().state = {
			action: 'paused',
			...component.instance().state
		}

		component.instance().onStateChange({ data: 5 })

		expect(component.instance().state).toEqual(
			expect.objectContaining({
				action: 'cued'
			})
		)
	})

	test('Ended event is received', () => {
		MediaUtil.mediaEnded = jest.fn()

		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		const component = mount(<YouTubePlayer content={mockContent} />)
		component.instance().player = player
		component.instance().state = {
			...component.instance().state
		}

		component.instance().onStateChange({ data: 0 })

		expect(component.instance().state).toEqual(
			expect.objectContaining({
				action: 'ended'
			})
		)
		expect(MediaUtil.mediaEnded).toHaveBeenCalledTimes(1)
	})

	test('Paused event is received', () => {
		MediaUtil.mediaPaused = jest.fn()

		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		const component = mount(<YouTubePlayer content={mockContent} />)
		component.instance().player = player

		component.instance().onStateChange({ data: 2 })

		expect(component.instance().state).toEqual(
			expect.objectContaining({
				action: 'paused'
			})
		)
		expect(MediaUtil.mediaPaused).toHaveBeenCalledTimes(1)
	})

	test('Buffering event is received', () => {
		MediaUtil.mediaBuffering = jest.fn()

		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		const component = mount(<YouTubePlayer content={mockContent} />)
		component.instance().player = player

		// tests for the video buffering when unstarted
		component.instance().onStateChange({ data: 3 })
		expect(component.instance().state).toEqual(
			expect.objectContaining({
				action: 'buffering'
			})
		)
		expect(MediaUtil.mediaBuffering).toHaveBeenCalledTimes(1)

		// modifies current state to mock the video buffering due to a skip
		component.instance().state.action = 'paused'

		component.instance().onStateChange({ data: 3 })
		expect(component.instance().state).toEqual(
			expect.objectContaining({
				action: 'buffering'
			})
		)
		expect(MediaUtil.mediaBuffering).toHaveBeenCalledTimes(2)

		// modifies current state to mock the video randomly buffering
		component.instance().state.action = 'playing'
		component.instance().onStateChange({ data: 3 })
		expect(component.instance().state).toEqual(
			expect.objectContaining({
				action: 'buffering'
			})
		)
		expect(MediaUtil.mediaBuffering).toHaveBeenCalledTimes(3)
	})

	test('Playing event is received', () => {
		MediaUtil.mediaPlayed = jest.fn()
		MediaUtil.mediaSeekTo = jest.fn()

		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		const component = mount(<YouTubePlayer content={mockContent} />)
		component.instance().player = player

		// tests for the video playing
		component.instance().onStateChange({ data: 1 })
		expect(component.instance().state).toEqual(
			expect.objectContaining({
				action: 'playing'
			})
		)
		expect(MediaUtil.mediaPlayed).toHaveBeenCalledTimes(1)

		// checks for possible double playing event
		component.instance().state.action = 'playing'
		component.instance().onStateChange({ data: 1 })
		expect(component.instance().state).toEqual(
			expect.objectContaining({
				action: 'playing'
			})
		)
		expect(MediaUtil.mediaPlayed).toHaveBeenCalledTimes(2)

		// test video playing after buffering
		component.instance().state.action = 'buffering'
		component.instance().state.playheadPosition = 2

		component.instance().onStateChange({ data: 1 })
		expect(component.instance().state).toEqual(
			expect.objectContaining({
				action: 'playing'
			})
		)
		expect(MediaUtil.mediaPlayed).toHaveBeenCalledTimes(3)
	})

	test('Unload event is received', () => {
		MediaUtil.mediaUnloaded = jest.fn()
		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		let component = mount(<YouTubePlayer content={mockContent} />)
		component.instance().state.action = 'ended'
		component.unmount()
		expect(MediaUtil.mediaUnloaded).not.toHaveBeenCalled()

		component = mount(<YouTubePlayer content={mockContent} />)
		component.instance().state.action = 'playing'
		component.instance().player = player
		component.unmount()
		expect(MediaUtil.mediaUnloaded).toHaveBeenCalled()
	})
})
