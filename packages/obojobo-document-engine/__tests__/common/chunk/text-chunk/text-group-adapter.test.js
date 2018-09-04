import TextGroupAdapter from '../../../../src/scripts/common/chunk/text-chunk/text-group-adapter'
import TextGroup from '../../../../src/scripts/common/text-group/text-group'
import StyleableText from '../../../../src/scripts/common/text/styleable-text'

describe('TextGroupAdapter', () => {
	test('construct with no attributes', () => {
		const model = {
			modelState: {}
		}

		TextGroupAdapter.construct(model)

		expect(model.modelState.textGroup).toEqual(
			TextGroup.create(Infinity, { indent: 0, align: 'left' })
		)
	})

	test('construct with attributes', () => {
		const model = {
			modelState: {}
		}

		TextGroupAdapter.construct(model, {
			content: {
				textGroup: [
					{
						text: {
							value: 'Text goes here'
						}
					}
				]
			}
		})

		const compareTo = TextGroup.create(Infinity, { indent: 0, align: 'left' })

		compareTo.set(0, new StyleableText('Text goes here'))

		expect(model.modelState.textGroup).toEqual(compareTo)
	})

	test('clone', () => {
		const a = {
			modelState: {}
		}
		const b = {
			modelState: {}
		}

		TextGroupAdapter.construct(a)
		TextGroupAdapter.clone(a, b)

		expect(a.modelState.textGroup).toEqual(b.modelState.textGroup)
	})

	test('toJSON', () => {
		const model = {
			modelState: {}
		}
		const json = {
			content: {}
		}

		TextGroupAdapter.construct(model)
		TextGroupAdapter.toJSON(model, json)

		expect(json.content.textGroup).toEqual(model.modelState.textGroup.toDescriptor())
	})
})
