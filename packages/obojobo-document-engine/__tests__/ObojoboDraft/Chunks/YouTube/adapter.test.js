import YoutubeAdapter from '../../../../ObojoboDraft/Chunks/YouTube/adapter'

describe('Youtube adapter', () => {
	it('can be constructed WITHOUT attributes', () => {
		let model = { modelState: {} }
		YoutubeAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	it('can be constructed WITH attributes', () => {
		let model = { modelState: {} }
		let attrs = { content: { videoId: 'example_video_id' } }
		YoutubeAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	it('can be cloned', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }
		let attrs = { content: { videoId: 'example_video_id' } }

		YoutubeAdapter.construct(a, attrs)
		YoutubeAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	it('can conver to JSON', () => {
		let model = { modelState: {} }
		let json = { content: {} }
		let attrs = { content: { videoId: 'example_video_id' } }

		YoutubeAdapter.construct(model, attrs)
		YoutubeAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	it('can convert to text', () => {
		let model = { modelState: {} }
		let attrs = { content: { videoId: 'example_video_id' } }
		YoutubeAdapter.construct(model, attrs)
		expect(YoutubeAdapter.toText(model)).toMatch('https://www.youtube.com/watch?v=example_video_id')
	})
})
