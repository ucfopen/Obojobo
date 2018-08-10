import IFrameAdapter from '../../../../ObojoboDraft/Chunks/IFrame/adapter'
import setProp from '../../../../src/scripts/common/util/set-prop'

describe('IFrame adapter', () => {
	let model

	class MockOboModel {
		constructor(attrs = {}) {
			this.modelState = {}
			this.content = attrs
		}

		setStateProp(propName, defaultValue, transformValueFn, allowedValues) {
			setProp(
				this.modelState,
				this.content,
				propName,
				defaultValue,
				transformValueFn,
				allowedValues
			)

			return true
		}
	}

	test('construct builds without attributes', () => {
		const model = new MockOboModel()
		IFrameAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('adapter sets modelState.border to true when given attributes border=true (or when border not specified and type="webpage")', () => {
		model = new MockOboModel({ border: false })
		IFrameAdapter.construct(model)
		expect(model.modelState.border).toBe(false)

		model = new MockOboModel({ border: true })
		IFrameAdapter.construct(model)
		expect(model.modelState.border).toBe(true)

		model = new MockOboModel({ type: 'webpage' })
		IFrameAdapter.construct(model)
		expect(model.modelState.border).toBe(true)

		model = new MockOboModel({ type: 'media' })
		IFrameAdapter.construct(model)
		expect(model.modelState.border).toBe(false)

		model = new MockOboModel({ type: 'webpage', border: false })
		IFrameAdapter.construct(model)
		expect(model.modelState.border).toBe(false)

		model = new MockOboModel({ type: 'media', border: false })
		IFrameAdapter.construct(model)
		expect(model.modelState.border).toBe(false)

		model = new MockOboModel({ type: 'webpage', border: true })
		IFrameAdapter.construct(model)
		expect(model.modelState.border).toBe(true)

		model = new MockOboModel({ type: 'media', border: true })
		IFrameAdapter.construct(model)
		expect(model.modelState.border).toBe(true)
	})

	test('adapter sets modelState.fit to "scale" by default, "scale" or "scroll" when specified, "scroll" if not specified (and type="webpage") and "scale" if not specified (and type="media")', () => {
		model = new MockOboModel({ fit: 'sCroll' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scroll')

		model = new MockOboModel({ fit: 'SCALE' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scale')

		model = new MockOboModel({ fit: 'other' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scale')

		model = new MockOboModel({ type: 'webpage' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scroll')

		model = new MockOboModel({ type: 'media' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scale')

		model = new MockOboModel({ type: 'webpage', fit: 'scroll' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scroll')

		model = new MockOboModel({ type: 'media', fit: 'scroll' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scroll')

		model = new MockOboModel({ type: 'webpage', fit: 'scale' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scale')

		model = new MockOboModel({ type: 'media', fit: 'scale' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scale')

		model = new MockOboModel({ type: 'webpage', fit: 'other' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scroll')

		model = new MockOboModel({ type: 'media', fit: 'other' })
		IFrameAdapter.construct(model)
		expect(model.modelState.fit).toBe('scale')
	})

	test('adapter sets modelState.controls to "reload" by default, "zoom,reload,new-window" if not specified (and type="webpage"), "reload" if not specified (and type="media") and lower-cases and trims values if specified', () => {
		model = new MockOboModel({})
		IFrameAdapter.construct(model)
		expect(model.modelState.controls).toEqual(['reload'])

		model = new MockOboModel({ type: 'webpage' })
		IFrameAdapter.construct(model)
		expect(model.modelState.controls).toEqual(['zoom', 'reload', 'new-window'])

		model = new MockOboModel({ type: 'media' })
		IFrameAdapter.construct(model)
		expect(model.modelState.controls).toEqual(['reload'])

		model = new MockOboModel({ controls: '  ExAmPle , zoom' })
		IFrameAdapter.construct(model)
		expect(model.modelState.controls).toEqual(['example', 'zoom'])
	})

	test('adapter sets modelState.src to content.src (or null if not specified)', () => {
		model = new MockOboModel({})
		IFrameAdapter.construct(model)
		expect(model.modelState.src).toBe(null)

		model = new MockOboModel({ src: 'mocked-src' })
		IFrameAdapter.construct(model)
		expect(model.modelState.src).toBe('mocked-src')
	})

	test('adapter sets modelState.width to a number if specified and null otherwise', () => {
		model = new MockOboModel({})
		IFrameAdapter.construct(model)
		expect(model.modelState.width).toBe(null)

		model = new MockOboModel({ width: 'invalid' })
		IFrameAdapter.construct(model)
		expect(model.modelState.width).toBe(null)

		model = new MockOboModel({ width: 123 })
		IFrameAdapter.construct(model)
		expect(model.modelState.width).toBe(123)
	})

	test('adapter sets modelState.height to a number if specified and null otherwise', () => {
		model = new MockOboModel({})
		IFrameAdapter.construct(model)
		expect(model.modelState.height).toBe(null)

		model = new MockOboModel({ height: 'invalid' })
		IFrameAdapter.construct(model)
		expect(model.modelState.height).toBe(null)

		model = new MockOboModel({ height: 123 })
		IFrameAdapter.construct(model)
		expect(model.modelState.height).toBe(123)
	})

	test('adapter sets modelState.initialZoom to a number if specified and 1 otherwise', () => {
		model = new MockOboModel({})
		IFrameAdapter.construct(model)
		expect(model.modelState.initialZoom).toBe(1)

		model = new MockOboModel({ initialZoom: 'invalid' })
		IFrameAdapter.construct(model)
		expect(model.modelState.initialZoom).toBe(1)

		model = new MockOboModel({ initialZoom: 123 })
		IFrameAdapter.construct(model)
		expect(model.modelState.initialZoom).toBe(123)
	})

	test('adapter sets modelState.autoload to true if content.autoload === true, otherwise false', () => {
		model = new MockOboModel({})
		IFrameAdapter.construct(model)
		expect(model.modelState.autoload).toBe(false)

		model = new MockOboModel({ autoload: false })
		IFrameAdapter.construct(model)
		expect(model.modelState.autoload).toBe(false)

		model = new MockOboModel({ autoload: true })
		IFrameAdapter.construct(model)
		expect(model.modelState.autoload).toBe(true)
	})

	test('adapter sets modelState.title to content.title (or null if not specified)', () => {
		model = new MockOboModel({})
		IFrameAdapter.construct(model)
		expect(model.modelState.title).toBe(null)

		model = new MockOboModel({ title: 'mocked-src' })
		IFrameAdapter.construct(model)
		expect(model.modelState.title).toBe('mocked-src')
	})

	test('can be cloned', () => {
		const a = new MockOboModel()
		const b = new MockOboModel()

		IFrameAdapter.construct(a)
		IFrameAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		model = new MockOboModel({ src: 'mockSrc' })
		const json = { content: {} }

		IFrameAdapter.construct(model)
		IFrameAdapter.toJSON(model, json)
		expect(json).toMatchSnapshot()
	})

	test('toText creates a text representation', () => {
		model = new MockOboModel({ src: 'mockSrc' })

		IFrameAdapter.construct(model)
		expect(IFrameAdapter.toText(model)).toMatch('mockSrc')
	})
})
