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

	test('adapter sets newWindow correctly', () => {
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

	test('adapter sets border correctly', () => {
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

	test('adapter sets fit correctly', () => {
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

	test('adapter sets controls correctly', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.controls).toEqual(['reload', 'expand'])

		IFrameAdapter.construct(model, { content: { type: 'webpage' } })
		expect(model.modelState.controls).toEqual(['zoom', 'reload', 'expand'])

		IFrameAdapter.construct(model, { content: { type: 'media' } })
		expect(model.modelState.controls).toEqual(['reload', 'expand'])

		IFrameAdapter.construct(model, { content: { controls: '  ExAmPle , zoom' } })
		expect(model.modelState.controls).toEqual(['example', 'zoom'])
	})

	test('adapter sets src correctly', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.src).toBe(null)

		IFrameAdapter.construct(model, { content: { src: 'mocked-src' } })
		expect(model.modelState.src).toBe('mocked-src')
	})

	test('adapter sets width correctly', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.width).toBe(null)

		IFrameAdapter.construct(model, { content: { width: 'invalid' } })
		expect(model.modelState.width).toBe(null)

		IFrameAdapter.construct(model, { content: { width: 123 } })
		expect(model.modelState.width).toBe(123)
	})

	test('adapter sets height correctly', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.height).toBe(null)

		IFrameAdapter.construct(model, { content: { height: 'invalid' } })
		expect(model.modelState.height).toBe(null)

		IFrameAdapter.construct(model, { content: { height: 123 } })
		expect(model.modelState.height).toBe(123)
	})

	test('adapter sets zoom correctly', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.zoom).toBe(1)

		IFrameAdapter.construct(model, { content: { zoom: 'invalid' } })
		expect(model.modelState.zoom).toBe(1)

		IFrameAdapter.construct(model, { content: { zoom: 123 } })
		expect(model.modelState.zoom).toBe(123)
	})

	test('adapter sets newWindowSrc correctly', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.newWindowSrc).toBe(null)

		IFrameAdapter.construct(model, { content: { newWindowSrc: 'mocked-src' } })
		expect(model.modelState.newWindowSrc).toBe('mocked-src')
	})

	test('adapter sets autoload correctly', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.autoload).toBe(false)

		IFrameAdapter.construct(model, { content: { autoload: false } })
		expect(model.modelState.autoload).toBe(false)

		IFrameAdapter.construct(model, { content: { autoload: true } })
		expect(model.modelState.autoload).toBe(true)
	})

	test('adapter sets expandedSize correctly', () => {
		IFrameAdapter.construct(model, { content: {} })
		expect(model.modelState.expandedSize).toBe('full')

		IFrameAdapter.construct(model, { content: { expandedSize: 'fULl' } })
		expect(model.modelState.expandedSize).toBe('full')

		IFrameAdapter.construct(model, { content: { expandedSize: 'other' } })
		expect(model.modelState.expandedSize).toBe('full')

		IFrameAdapter.construct(model, { content: { expandedSize: 'RESTRIctED' } })
		expect(model.modelState.expandedSize).toBe('restricted')
	})

	test('adapter sets title correctly', () => {
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
