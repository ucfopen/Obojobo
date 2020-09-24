import MateriaAdapter from './adapter'
import setProp from 'obojobo-document-engine/src/scripts/common/util/set-prop'

describe('Materia adapter', () => {
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
		MateriaAdapter.construct(model)
		expect(model.modelState).toMatchSnapshot()
	})

	test('adapter sets modelState.widgetEngine to a number if specified and null otherwise', () => {
		model = new MockOboModel({})
		MateriaAdapter.construct(model)
		expect(model.modelState.widgetEngine).toBe(null)

		model = new MockOboModel({ widgetEngine: 'Enigma' })
		MateriaAdapter.construct(model)
		expect(model.modelState.widgetEngine).toBe('Enigma')

		model = new MockOboModel({ widgetEngine: '' })
		MateriaAdapter.construct(model)
		expect(model.modelState.widgetEngine).toBe('')
	})

	test('adapter sets modelState.icon to a number if specified and null otherwise', () => {
		model = new MockOboModel({})
		MateriaAdapter.construct(model)
		expect(model.modelState.icon).toBe(null)

		model = new MockOboModel({ icon: 'https://url.to.icon' })
		MateriaAdapter.construct(model)
		expect(model.modelState.icon).toBe('https://url.to.icon')

		model = new MockOboModel({ icon: '' })
		MateriaAdapter.construct(model)
		expect(model.modelState.icon).toBe('')
	})

	test('adapter sets modelState.controls to "reload" by default, "zoom,reload,new-window" if not specified (and type="webpage"), "reload" if not specified (and type="media") and lower-cases and trims values if specified', () => {
		model = new MockOboModel({})
		MateriaAdapter.construct(model)
		expect(model.modelState.controls).toEqual(['reload'])

		model = new MockOboModel({ controls: 'media' })
	})

	test('adapter sets modelState.src to content.src (or null if not specified)', () => {
		model = new MockOboModel({})
		MateriaAdapter.construct(model)
		expect(model.modelState.src).toBe(null)

		model = new MockOboModel({ src: 'mocked-src' })
		MateriaAdapter.construct(model)
		expect(model.modelState.src).toBe('mocked-src')
	})

	test('adapter sets modelState.width to a number if specified and null otherwise', () => {
		model = new MockOboModel({})
		MateriaAdapter.construct(model)
		expect(model.modelState.width).toBe(null)

		model = new MockOboModel({ width: 'invalid' })
		MateriaAdapter.construct(model)
		expect(model.modelState.width).toBe(null)

		model = new MockOboModel({ width: 123 })
		MateriaAdapter.construct(model)
		expect(model.modelState.width).toBe(123)
	})

	test('adapter sets modelState.height to a number if specified and null otherwise', () => {
		model = new MockOboModel({})
		MateriaAdapter.construct(model)
		expect(model.modelState.height).toBe(null)

		model = new MockOboModel({ height: 'invalid' })
		MateriaAdapter.construct(model)
		expect(model.modelState.height).toBe(null)

		model = new MockOboModel({ height: 123 })
		MateriaAdapter.construct(model)
		expect(model.modelState.height).toBe(123)
	})

	test('adapter sets modelState.textGroup to a number if specified and null otherwise', () => {
		model = new MockOboModel({})
		MateriaAdapter.construct(model, {})
		expect(model.modelState.textGroup).toMatchInlineSnapshot(`
		TextGroup {
		  "dataTemplate": Object {},
		  "items": Array [
		    TextGroupItem {
		      "data": Object {},
		      "parent": [Circular],
		      "text": StyleableText {
		        "styleList": ChunkStyleList {
		          "styles": Array [],
		        },
		        "value": "",
		      },
		    },
		  ],
		  "maxItems": 1,
		}
	`)

		model = new MockOboModel({})
		MateriaAdapter.construct(model, { content: {} })
		expect(model.modelState.textGroup).toMatchInlineSnapshot(`
		TextGroup {
		  "dataTemplate": Object {},
		  "items": Array [
		    TextGroupItem {
		      "data": Object {},
		      "parent": [Circular],
		      "text": StyleableText {
		        "styleList": ChunkStyleList {
		          "styles": Array [],
		        },
		        "value": "",
		      },
		    },
		  ],
		  "maxItems": 1,
		}
	`)

		const attrs = {
			content: {
				textGroup: [
					{
						text: {
							value: 'Widget Caption'
						}
					}
				]
			}
		}

		model = new MockOboModel({})

		MateriaAdapter.construct(model, attrs)
		expect(model.modelState.textGroup).toMatchInlineSnapshot(`
		TextGroup {
		  "dataTemplate": Object {},
		  "items": Array [
		    TextGroupItem {
		      "data": Object {},
		      "parent": [Circular],
		      "text": StyleableText {
		        "styleList": ChunkStyleList {
		          "styles": Array [],
		        },
		        "value": "Widget Caption",
		      },
		    },
		  ],
		  "maxItems": 1,
		}
	`)
	})

	test('can be cloned', () => {
		const a = new MockOboModel()
		const b = new MockOboModel()

		MateriaAdapter.construct(a)
		MateriaAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		model = new MockOboModel({ src: 'mockSrc' })
		const json = { content: {} }

		MateriaAdapter.construct(model)
		MateriaAdapter.toJSON(model, json)
		expect(json).toMatchSnapshot()
	})

	test('toText creates a text representation', () => {
		model = new MockOboModel({ src: 'mockSrc' })

		MateriaAdapter.construct(model)
		expect(MateriaAdapter.toText(model)).toMatch('mockSrc')
	})
})
