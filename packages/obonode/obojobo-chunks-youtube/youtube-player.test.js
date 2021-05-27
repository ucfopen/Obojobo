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

	test("YouTubePlayer doesn't update if content hasn't changed", () => {
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
	let onStateChange
	let getCurrentTime
	let player

	beforeEach(() => {
		jest.clearAllMocks()
		jest.mock('obojobo-document-engine/src/scripts/viewer')
		jest.mock('./youtube-player')

		onStateChange = jest.fn()
		getCurrentTime = jest.fn()
		getCurrentTime.mockReturnValue(2) // simulates a currentPlayHeadPosition to compared with the currentState.playHeadPosition

		player = {
			getCurrentTime: getCurrentTime
		}
	})

	test('Unstarted event is received', () => {
		const component = mount(<YouTubePlayer onStateChange={onStateChange} player={player} />)
		component.instance().player = player

		const spy = jest.spyOn(component.instance(), 'onStateChange')
		component.instance().onStateChange({ data: -1 })

		expect(spy).toHaveBeenCalled()
	})
	test('Cued event is received', () => {
		const component = mount(<YouTubePlayer onStateChange={onStateChange} player={player} />)
		component.instance().player = player

		const spy = jest.spyOn(component.instance(), 'onStateChange')
		component.instance().onStateChange({ data: 5 })

		expect(spy).toHaveBeenCalled()
	})
	test('Ended event is received', () => {
		MediaUtil.mediaEnded = jest.fn()

		const component = mount(<YouTubePlayer onStateChange={onStateChange} player={player} />)
		component.instance().player = player

		const spy = jest.spyOn(component.instance(), 'onStateChange')
		component.instance().onStateChange({ data: 0 })

		expect(spy).toHaveBeenCalled()
	})

	test('Paused event is received', () => {
		MediaUtil.mediaPaused = jest.fn()

		const component = mount(<YouTubePlayer onStateChange={onStateChange} player={player} />)
		component.instance().player = player

		const spy = jest.spyOn(component.instance(), 'onStateChange')
		component.instance().onStateChange({ data: 2 })

		expect(spy).toHaveBeenCalled()
	})

	test('Buffering event is received', () => {
		MediaUtil.mediaBuffering = jest.fn()

		const component = mount(<YouTubePlayer onStateChange={onStateChange} player={player} />)
		component.instance().player = player

		//tests for the video buffering when unstarted
		const spy = jest.spyOn(component.instance(), 'onStateChange')
		component.instance().onStateChange({ data: 3 })
		expect(spy).toHaveBeenCalled()

		//modifies current state to mock the video buffering due to a skip
		component.instance().currentState.action = 'paused'
		component.instance().currentState.actor = 'user'

		component.instance().onStateChange({ data: 3 })
		expect(spy).toHaveBeenCalled()

		//modifies current state to mock the video randomly buffering
		component.instance().currentState.action = 'playing'
		component.instance().onStateChange({ data: 3 })
		expect(spy).toHaveBeenCalled()
	})

	test('Playing and SeekTo event is received', () => {
		MediaUtil.mediaPlayed = jest.fn()
		MediaUtil.mediaSeekTo = jest.fn()

		const component = mount(<YouTubePlayer onStateChange={onStateChange} player={player} />)
		component.instance().player = player

		//tests for the video playing
		const spy = jest.spyOn(component.instance(), 'onStateChange')
		component.instance().onStateChange({ data: 1 })
		expect(spy).toHaveBeenCalled()

		//checks for possible double playing event
		component.instance().currentState.action = 'playing'
		component.instance().onStateChange({ data: 1 })
		expect(spy).toHaveBeenCalled()

		//test video playing after buffering
		component.instance().currentState.action = 'buffering'
		component.instance().currentState.actor = 'user'
		component.instance().currentState.playHeadPosition = 2

		component.instance().onStateChange({ data: 1 })
		expect(spy).toHaveBeenCalled()

		//test video playing after buffering after a skip
		component.instance().currentState.action = 'buffering'
		component.instance().currentState.actor = 'youtube'
		component.instance().currentState.playHeadPosition = 100
		component.instance().currentState.isPossibleSeekTo = true

		component.instance().onStateChange({ data: 1 })
		expect(spy).toHaveBeenCalled()

		//test for a seekTo event
		component.instance().currentState.action = 'paused'
		component.instance().currentState.playHeadPosition = 100

		component.instance().onStateChange({ data: 1 })
		expect(spy).toHaveBeenCalled()
	})
})
