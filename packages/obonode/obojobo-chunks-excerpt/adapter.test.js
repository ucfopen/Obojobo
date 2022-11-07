jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model', () => {
	return require('obojobo-document-engine/__mocks__/obo-model-adapter-mock').default
})
import Common from 'obojobo-document-engine/src/scripts/common'
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'
import ExcerptAdapter from './adapter'
const { TextGroup } = Common.textGroup
// const { TextGroupAdapter } = Common.chunk.textChunk


describe('Excerpt adapter', () => {

    const defaultState = {
        bodyStyle: 'filled-box',
        width: 'medium',
        font: 'sans',
        lineHeight: 'moderate',
        fontSize: 'smaller',
        effect: false,
    }

    const defaultStateWithCitation = {
        ...defaultState,
        citation: TextGroup.create(1, {})
    }

    // const defaultAttrs = {
    //     bodyStyle:
    // }

	test('construct builds without attributes', () => {
		const model = new OboModel({})

		ExcerptAdapter.construct(model)

		expect(model.modelState).toEqual(defaultState)
	})

	test('construct builds with citation attributes', () => {
		const attrs = {
			content: {
				citation: [
                    {
                        data: { align: 'center', hangingIndent: 0, indent: 0 },
                        text: { styleList: null, value: 'Placeholder text' }
                    }
                ]
			}
        }

		const model = new OboModel(attrs)
		const expected = {
            ...defaultStateWithCitation,
            citation: TextGroup.fromDescriptor(attrs.content.citation, 1, {})
        }
        ExcerptAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
    })

    test('construct builds with empty content object', () => {

        const attrs = {
			content: { }
        }

		const model = new OboModel(attrs)
		const expected = defaultStateWithCitation
        ExcerptAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
    })

    test('construct builds with font attribute', () => {
        const attrs = {
			content: {
				font: 'monospace',
			}
        }

		const model = new OboModel(attrs)
		const expected = {
            ...defaultStateWithCitation,
            font: 'monospace'
        }
        ExcerptAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
    })

    test('construct builds with bodyStyle attribute', () => {
        const attrs = {
			content: {
				bodyStyle: 'card',
			}
        }

		const model = new OboModel(attrs)
		const expected = {
            ...defaultStateWithCitation,
            bodyStyle: 'card'
        }
        ExcerptAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
    })

    test('construct builds with width attribute', () => {
        const attrs = {
			content: {
				width: 'large',
			}
        }

		const model = new OboModel(attrs)
		const expected = {
            ...defaultStateWithCitation,
            width: 'large'
        }
        ExcerptAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
    })

    test('construct builds with fontSize attribute', () => {
        const attrs = {
			content: {
				fontSize: 'smaller',
			}
        }

		const model = new OboModel(attrs)
		const expected = {
            ...defaultStateWithCitation,
            fontSize: 'smaller'
        }
        ExcerptAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
    })

    test('construct builds with lineHeight attribute', () => {
        const attrs = {
			content: {
				lineHeight: 'generous',
			}
        }

		const model = new OboModel(attrs)
		const expected = {
            ...defaultStateWithCitation,
            lineHeight: 'generous'
        }
        ExcerptAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
    })

    test('construct builds with effect attribute', () => {
        const attrs = {
			content: {
				effect: true,
			}
        }

		const model = new OboModel(attrs)
		const expected = {
            ...defaultStateWithCitation,
            effect: true
        }
        ExcerptAdapter.construct(model, attrs)

		expect(model.modelState).toEqual(expected)
    })

})
