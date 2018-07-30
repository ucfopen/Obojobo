import IFrameAdapter from '../../../../ObojoboDraft/Chunks/IFrame/adapter'

describe('IFrame adapter', () => {
	let model

	beforeEach(() => {
		model = { modelState: {} }
	})

	test('construct builds without attributes', () => {
		IFrameAdapter.construct(model)
		expect(model).toMatchSnapshot()
	})

	test('construct builds with attributes', () => {
		const attrs = {
			content: {
				src: 'mockSrc',
				allow: 'mockAllow'
			}
		}

		IFrameAdapter.construct(model, attrs)
	})

	test('adapter sets modelState.newWindow to true when given attributes newWindow=true (or when newWindow not specified and type="webpage")', () => {
		IFrameAdapter.construct(model, { content: { newWindow: false } })
		expect(model.modelState.newWindow).toBe(false)

		IFrameAdapter.construct(model, { content: { newWindow: true } })
		expect(model.modelState.newWindow).toBe(true)

		IFrameAdapter.construct(model, { content: { type: 'webpage' } })
		expect(model.modelState.newWindow).toBe(true)

		IFrameAdapter.construct(model, { content: { type: 'media' } })
		expect(model.modelState.newWindow).toBe(false)

		IFrameAdapter.construct(model, { content: { type: 'webpage', newWindow: false } })
		expect(model.modelState.newWindow).toBe(false)

		IFrameAdapter.construct(model, { content: { type: 'media', newWindow: false } })
		expect(model.modelState.newWindow).toBe(false)

		IFrameAdapter.construct(model, { content: { type: 'webpage', newWindow: true } })
		expect(model.modelState.newWindow).toBe(true)

		IFrameAdapter.construct(model, { content: { type: 'media', newWindow: true } })
		expect(model.modelState.newWindow).toBe(true)
	})

	test('adapter sets modelState.border to true when given attributes border=true (or when border not specified and type="webpage")', () => {
		IFrameAdapter.construct(model, { content: { border: false } })
		expect(model.modelState.border).toBe(false)

		IFrameAdapter.construct(model, { content: { border: true } })
		expect(model.modelState.border).toBe(true)

		IFrameAdapter.construct(model, { content: { type: 'webpage' } })
		expect(model.modelState.border).toBe(true)

		IFrameAdapter.construct(model, { content: { type: 'media' } })
		expect(model.modelState.border).toBe(false)

		IFrameAdapter.construct(model, { content: { type: 'webpage', border: false } })
		expect(model.modelState.border).toBe(false)

		IFrameAdapter.construct(model, { content: { type: 'media', border: false } })
		expect(model.modelState.border).toBe(false)

		IFrameAdapter.construct(model, { content: { type: 'webpage', border: true } })
		expect(model.modelState.border).toBe(true)

		IFrameAdapter.construct(model, { content: { type: 'media', border: true } })
		expect(model.modelState.border).toBe(true)
	})

	test('adapter sets modelState.fit to "scale" by default, "scale" or "scroll" when specified, "scroll" if not specified (and type="webpage") and "scale" if not specified (and type="media")', () => {
		IFrameAdapter.construct(model, { content: { fit: 'sCroll' } })
		expect(model.modelState.fit).toBe('scroll')

		IFrameAdapter.construct(model, { content: { fit: 'SCALE' } })
		expect(model.modelState.fit).toBe('scale')

		IFrameAdapter.construct(model, { content: { fit: 'other' } })
		expect(model.modelState.fit).toBe('scale')

		IFrameAdapter.construct(model, { content: { type: 'webpage' } })
		expect(model.modelState.fit).toBe('scroll')

		IFrameAdapter.construct(model, { content: { type: 'media' } })
		expect(model.modelState.fit).toBe('scale')

		IFrameAdapter.construct(model, { content: { type: 'webpage', fit: 'scroll' } })
		expect(model.modelState.fit).toBe('scroll')

		IFrameAdapter.construct(model, { content: { type: 'media', fit: 'scroll' } })
		expect(model.modelState.fit).toBe('scroll')

		IFrameAdapter.construct(model, { content: { type: 'webpage', fit: 'scale' } })
		expect(model.modelState.fit).toBe('scale')

		IFrameAdapter.construct(model, { content: { type: 'media', fit: 'scale' } })
		expect(model.modelState.fit).toBe('scale')

		IFrameAdapter.construct(model, { content: { type: 'webpage', fit: 'other' } })
		expect(model.modelState.fit).toBe('scroll')

		IFrameAdapter.construct(model, { content: { type: 'media', fit: 'other' } })
		expect(model.modelState.fit).toBe('scale')
	})

	test('adapter sets modelState.controls to "reload" by default, "zoom,reload" if not specified (and type="webpage"), "reload" if not specified (and type="media") and lower-cases and trims values if specified', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.controls).toEqual(['reload'])

		IFrameAdapter.construct(model, { content: { type: 'webpage' } })
		expect(model.modelState.controls).toEqual(['zoom', 'reload'])

		IFrameAdapter.construct(model, { content: { type: 'media' } })
		expect(model.modelState.controls).toEqual(['reload'])

		IFrameAdapter.construct(model, { content: { controls: '  ExAmPle , zoom' } })
		expect(model.modelState.controls).toEqual(['example', 'zoom'])
	})

	test('adapter sets modelState.src to content.src (or null if not specified)', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.src).toBe(null)

		IFrameAdapter.construct(model, { content: { src: 'mocked-src' } })
		expect(model.modelState.src).toBe('mocked-src')
	})

	test('adapter sets modelState.width to a number if specified and null otherwise', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.width).toBe(null)

		IFrameAdapter.construct(model, { content: { width: 'invalid' } })
		expect(model.modelState.width).toBe(null)

		IFrameAdapter.construct(model, { content: { width: 123 } })
		expect(model.modelState.width).toBe(123)
	})

	test('adapter sets modelState.height to a number if specified and null otherwise', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.height).toBe(null)

		IFrameAdapter.construct(model, { content: { height: 'invalid' } })
		expect(model.modelState.height).toBe(null)

		IFrameAdapter.construct(model, { content: { height: 123 } })
		expect(model.modelState.height).toBe(123)
	})

	test('adapter sets modelState.zoom to a number if specified and 1 otherwise', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.zoom).toBe(1)

		IFrameAdapter.construct(model, { content: { zoom: 'invalid' } })
		expect(model.modelState.zoom).toBe(1)

		IFrameAdapter.construct(model, { content: { zoom: 123 } })
		expect(model.modelState.zoom).toBe(123)
	})

	test('adapter sets modelState.newWindowSrc from content.newWindowSrc (or null if not specified)', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.newWindowSrc).toBe(null)

		IFrameAdapter.construct(model, { content: { newWindowSrc: 'mocked-src' } })
		expect(model.modelState.newWindowSrc).toBe('mocked-src')
	})

	test('adapter sets modelState.autoload to true if content.autoload === true, otherwise false', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.autoload).toBe(false)

		IFrameAdapter.construct(model, { content: { autoload: false } })
		expect(model.modelState.autoload).toBe(false)

		IFrameAdapter.construct(model, { content: { autoload: true } })
		expect(model.modelState.autoload).toBe(true)
	})

	test('adapter sets modelState.title to content.title (or null if not specified)', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.title).toBe(null)

		IFrameAdapter.construct(model, { content: { title: 'mocked-src' } })
		expect(model.modelState.title).toBe('mocked-src')
	})

	test('can be cloned', () => {
		const a = { modelState: {} }
		const b = { modelState: {} }

		IFrameAdapter.construct(a)
		IFrameAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		const model = { modelState: {} }
		const attrs = { content: { src: 'mockSrc' } }
		const json = { content: {} }

		IFrameAdapter.construct(model, attrs)
		IFrameAdapter.toJSON(model, json)
		expect(json).toMatchSnapshot()
	})

	test('toText creates a text representation', () => {
		const model = { modelState: {} }
		const attrs = { content: { src: 'mockSrc' } }

		IFrameAdapter.construct(model, attrs)
		expect(IFrameAdapter.toText(model)).toMatch('mockSrc')
	})
})
