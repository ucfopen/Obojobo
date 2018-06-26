import YoutubeAdapter from '../../../../ObojoboDraft/Chunks/YouTube/adapter'

describe('Youtube adapter', () => {
	test('construct builds without attributes', () => {
		let model = { modelState: {} }
		YoutubeAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		let model = { modelState: {} }
		let attrs = { content: { videoId: 'example_video_id' } }
		YoutubeAdapter.construct(model, attrs)
		expect(model).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		let a = { modelState: {} }
		let b = { modelState: {} }
		let attrs = { content: { videoId: 'example_video_id' } }

		YoutubeAdapter.construct(a, attrs)
		YoutubeAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a).toEqual(b)
	})

	test('toJSON builds a JSON representation', () => {
		let model = { modelState: {} }
		let json = { content: {} }
		let attrs = { content: { videoId: 'example_video_id' } }

		YoutubeAdapter.construct(model, attrs)
		YoutubeAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('toText creates a text representation', () => {
		let model = { modelState: {} }
		let attrs = { content: { videoId: 'example_video_id' } }
		YoutubeAdapter.construct(model, attrs)
		expect(YoutubeAdapter.toText(model)).toMatch('https://www.youtube.com/watch?v=example_video_id')
	})
})
