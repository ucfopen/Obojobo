import injectKatexIfNeeded from './inject-katex-if-needed'
import insertDomTag from './insert-dom-tag'

jest.mock('./insert-dom-tag', () => {
	return jest.fn().mockImplementation(() => {
		// simulate loading the katex script
		global.window.katex = {}
	})
})

describe('Inject Katex if Needed Util', () => {
	beforeEach(() => {
		delete global.window.katex
	})

	test('loads katex when object contains string of latex', async () => {
		const result = await injectKatexIfNeeded({ value: { text: 'latex' } })
		expect(global.window).toHaveProperty('katex')
		expect(result).toEqual({ text: 'latex' })
	})

	test('skips katex when object doesnt contains string of latex', async () => {
		await injectKatexIfNeeded({ value: { text: 'no math here' } })
		expect(global.window).not.toHaveProperty('katex')
	})

	test('skips loading if katex is already defined', async () => {
		global.window.katex = 'mockObjectWithKatexLoaded'
		await injectKatexIfNeeded({ value: { text: 'latex' } })
		expect(global.window.katex).toEqual('mockObjectWithKatexLoaded')
	})

	test('handles error when katex loading times out', async () => {
		expect.assertions(2)

		jest.useFakeTimers()
		insertDomTag.mockReturnValue('')
		try {
			const promise = injectKatexIfNeeded({ value: { text: 'is latex here' } })
			jest.runAllTimers()
			await promise
		} catch (error) {
			expect(error).toEqual('Timed out loading katex library')
		}

		expect(global.window).not.toHaveProperty('katex')
	})
})
