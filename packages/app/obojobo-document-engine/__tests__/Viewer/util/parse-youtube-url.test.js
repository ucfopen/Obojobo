import ParseYoutubeUrl from '../../../src/scripts/oboeditor/util/parse-youtube-url'

describe('YouTube Parse Url', () => {
	beforeEach(() => {
		jest.restoreAllMocks()
		jest.resetAllMocks()
	})

	test('test ParseYoutubeUrl youTubeParseUrl method with valid url', () => {
		const validUrl = 'https://www.youtube.com/watch?v=krfcq5pF8u8'
		const videoInfo = ParseYoutubeUrl.youTubeParseUrl(validUrl)

		expect(videoInfo).toMatchSnapshot()
	})

	test('test ParseYoutubeUrl youTubeParseUrl method with a different valid url', () => {
		const validUrl = 'https://www.youtube.com/watch?v=krfcq5pF8u8?t=5000'
		const videoInfo = ParseYoutubeUrl.youTubeParseUrl(validUrl)

		expect(videoInfo).toMatchSnapshot()
	})

	test('test ParseYoutubeUrl youTubeParseUrl method with valid embed code and start and end values', () => {
		const validUrl =
			'<iframe src=”https://www.youtube.com/embed/tpiyEe_CqB4?start=100&amp;end=300” allowfullscreen=”” width=”560″ height=”315″ frameborder=”0″>'
		const videoInfo = ParseYoutubeUrl.youTubeParseUrl(validUrl)

		expect(videoInfo).toMatchSnapshot()
	})

	test('test ParseYoutubeUrl youTubeParseUrl method with valid embed code and start and end values', () => {
		const validUrl =
			'<iframe src=”https://www.youtube.com/embed/tpiyEe_CqB4?start=50&end=345” allowfullscreen=”” width=”560″ height=”315″ frameborder=”0″>'
		const videoInfo = ParseYoutubeUrl.youTubeParseUrl(validUrl)

		expect(videoInfo).toMatchSnapshot()
	})

	test('test ParseYoutubeUrl youTubeParseUrl method with valid embed code', () => {
		const validUrl =
			'<iframe width="560" height="315" src="https://www.youtube.com/embed/ByH9LuSILxU?start=3" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
		const videoInfo = ParseYoutubeUrl.youTubeParseUrl(validUrl)

		expect(videoInfo).toMatchSnapshot()
	})

	test('test ParseYoutubeUrl youTubeParseUrl method with a valid embed url', () => {
		const validUrl = 'https://www.youtube.com/embed/Ho8niBS1nrU?start=539&end=541&version=3'
		const videoInfo = ParseYoutubeUrl.youTubeParseUrl(validUrl)

		expect(videoInfo).toMatchSnapshot()
	})

	test('test ParseYoutubeUrl youTubeParseUrl method with invalid url', () => {
		const validUrl = 'https://www.youtube.com/krfcq5pF8u8'
		const videoInfo = ParseYoutubeUrl.youTubeParseUrl(validUrl)

		expect(videoInfo).toMatchSnapshot()
	})

	test('test ParseYoutubeUrl youTubeParseUrl method with no url', () => {
		const videoInfo = ParseYoutubeUrl.youTubeParseUrl()

		expect(videoInfo).toMatchInlineSnapshot(`
		Object {
		  "endTime": false,
		  "startTime": false,
		  "videoId": false,
		}
	`)
	})
})
