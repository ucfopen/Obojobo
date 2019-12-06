import React from 'react'
import { mount, shallow } from 'enzyme'

import YouTubePlayer from './youtube-player'

jest.mock('obojobo-document-engine/src/scripts/common/util/uuid', () => {
	return () => 'mockId'
})

describe('YouTubeProperties component renders correctly', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test('YouTubePlayer renders correctly', () => {
		const component = mount(<YouTubePlayer />)
		const tree = component.html()

		expect(tree).toMatchSnapshot()
	})

	test('YoutubePlayer updates video on content change', () => {
		// mock YouTube's Iframe Player object
		global.YT = {
			Player: jest.fn(() => ({
				destroy: jest.fn()
			}))
		}

		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		const spy = jest.spyOn(YouTubePlayer.prototype, 'loadVideo')
		const component = shallow(<YouTubePlayer content={mockContent} />)

		expect(spy).toHaveBeenCalledTimes(1)

		component.setProps({
			content: {
				...mockContent,
				videoId: 'foo'
			}
		})

		expect(spy).toHaveBeenCalledTimes(2)

		component.setProps({
			content: {
				...mockContent,
				startTime: 4
			}
		})

		expect(spy).toHaveBeenCalledTimes(3)

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
				destroy: jest.fn()
			}))
		}

		const mockContent = {
			videoId: 'mockId',
			startTime: 1,
			endTime: 2
		}
		const spy = jest.spyOn(YouTubePlayer.prototype, 'loadVideo')
		const component = shallow(<YouTubePlayer content={mockContent} />)

		expect(spy).toHaveBeenCalledTimes(1)

		component.setProps({
			content: {
				...mockContent
			}
		})

		expect(spy).toHaveBeenCalledTimes(1)
		expect(component.instance().player.destroy).not.toHaveBeenCalled()
	})
})
