jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-adapter-mock').default
})
import OboModel from '../../../../src/scripts/common/models/obo-model'

import YoutubeAdapter from '../../../../ObojoboDraft/Chunks/YouTube/adapter'

describe('Youtube adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		YoutubeAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const attrs = { content: { videoId: 'example_video_id' } }
		const model = new OboModel(attrs)
		YoutubeAdapter.construct(model, attrs)
		expect(model.modelState).toMatchSnapshot()
	})

	test('clone creates a copy', () => {
		const attrs = { content: { videoId: 'example_video_id' } }
		const a = new OboModel(attrs)
		const b = new OboModel({})

		YoutubeAdapter.construct(a, attrs)
		YoutubeAdapter.clone(a, b)

		expect(a.modelState).not.toBe(b.modelState)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		const json = { content: {} }
		const attrs = { content: { videoId: 'example_video_id' } }
		const model = new OboModel(attrs)

		YoutubeAdapter.construct(model, attrs)
		YoutubeAdapter.toJSON(model, json)

		expect(json).toMatchSnapshot()
	})

	test('toText creates a text representation', () => {
		const attrs = { content: { videoId: 'example_video_id' } }
		const model = new OboModel(attrs)

		YoutubeAdapter.construct(model, attrs)

		expect(YoutubeAdapter.toText(model)).toMatch('https://www.youtube.com/watch?v=example_video_id')
	})
})
