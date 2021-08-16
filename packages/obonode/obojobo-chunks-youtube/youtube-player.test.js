import React from 'react'
import YouTubePlayer from './youtube-player'
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
				cueVideoById: jest.fn(),
				getVideoUrl: jest.fn(),
				pauseVideo: jest.fn()
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
		spy.mockRestore()
	})

	test("YouTubePlayer doesn't update if content hasn't changed", () => {
		window.YT = {
			Player: jest.fn(() => ({
				destroy: jest.fn(),
				cueVideoById: jest.fn(),
				getVideoUrl: jest.fn(),
				pauseVideo: jest.fn()
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

		spy.mockRestore()
	})

	test('Pause other players when a player is unpaused', () => {
		const player1 = {
			destroy: jest.fn(),
			cueVideoById: jest.fn(),
			getVideoUrl: () => 'url-1',
			pauseVideo: jest.fn()
		}
		const player2 = {
			destroy: jest.fn(),
			cueVideoById: jest.fn(),
			getVideoUrl: () => 'url-2',
			pauseVideo: jest.fn()
		}

		const mockContent1 = {
			videoId: 'mockIDzz',
			startTime: 1,
			endTime: 2,
			playerState: 2
		}
		jest.mock('obojobo-document-engine/src/scripts/common/util/uuid', () => {
			return () => 'mockId'
		})
		const mockContent2 = {
			videoId: 'mockIDzz2',
			startTime: 1,
			endTime: 2,
			playerState: 2
		}

		window.YT = {
			Player: jest.fn(() => player1),
			test: 123
		}
		const component1 = mount(<YouTubePlayer content={mockContent1} />)

		window.YT = {
			Player: jest.fn(() => player2),
			test: 456
		}
		const component2 = mount(<YouTubePlayer content={mockContent2} />)

		component1.instance().onStateChange({
			data: 1,
			target: player1
		})
		expect(player1.pauseVideo).not.toHaveBeenCalled()
		expect(player2.pauseVideo).toHaveBeenCalledTimes(1)

		component1.instance().onStateChange({
			data: 1,
			target: player2
		})
		expect(player2.pauseVideo).toHaveBeenCalledTimes(1)
		expect(player1.pauseVideo).toHaveBeenCalledTimes(1)

		component2.instance().onStateChange({
			data: 1,
			target: player1
		})
		expect(player1.pauseVideo).toHaveBeenCalledTimes(1)
		expect(player2.pauseVideo).toHaveBeenCalledTimes(2)

		component2.instance().onStateChange({
			data: 1,
			target: player2
		})
		expect(player1.pauseVideo).toHaveBeenCalledTimes(2)
		expect(player2.pauseVideo).toHaveBeenCalledTimes(2)
	})
})
