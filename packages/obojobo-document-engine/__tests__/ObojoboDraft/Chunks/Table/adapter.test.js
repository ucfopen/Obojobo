import TableAdapter from '../../../../ObojoboDraft/Chunks/Table/adapter'
import GridTextGroup from '../../../../ObojoboDraft/Chunks/Table/grid-text-group'
import StylableText from '../../../../src/scripts/common/text/styleable-text'

describe('Table adapter', () => {
	test('construct builds without attributes', () => {
		let model = { modelState: {} }
		TableAdapter.construct(model)

		expect(model.modelState.textGroup).toEqual(GridTextGroup.create(3, 2, null))
	})

	test('construct builds with attributes', () => {
		let model = { modelState: {} }
		TableAdapter.construct(model, {
			content: {
				header: true,
				textGroup: {
					numRows: 2,
					numCols: 2,
					textGroup: [
						{
							text: {
								value: 'First column heading'
							}
						},
						{
							text: {
								value: 'Second column heading'
							}
						},
						{
							text: {
								value: 'First column second row'
							}
						},
						{
							text: {
								value: 'Second column second row'
							}
						}
					]
				}
			}
		})
		let tempGridTextGroup = GridTextGroup.create(2, 2, { indent: 0, value: true })
		tempGridTextGroup.set(0, new StylableText('First column heading'))
		tempGridTextGroup.set(1, new StylableText('Second column heading'))
		tempGridTextGroup.set(2, new StylableText('First column second row'))
		tempGridTextGroup.set(3, new StylableText('Second column second row'))

		expect(model.modelState.textGroup).toEqual(
			GridTextGroup.fromDescriptor(tempGridTextGroup.toDescriptor(), 4, { indent: 0 }, null)
		)
	})

	test('clone creates a copy', () => {
		let a = { modelState: { header: 'mockHeader' } }
		let b = { modelState: {} }

		TableAdapter.construct(a)
		TableAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		let a = { modelState: { header: 'mockHeader' } }
		let b = { content: {} }

		TableAdapter.construct(a)
		TableAdapter.toJSON(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState.header).toEqual(b.content.header)
	})

	test('toText creates a text representation', () => {
		let model = { modelState: {} }
		let expectedResult = `------------------------
| First column heading     | Second column heading    |
------------------------
| First column second row  | Second column second row |
------------------------`

		TableAdapter.construct(model, {
			content: {
				header: true,
				textGroup: {
					numRows: 2,
					numCols: 2,
					textGroup: [
						{
							text: {
								value: 'First column heading'
							}
						},
						{
							text: {
								value: 'Second column heading'
							}
						},
						{
							text: {
								value: 'First column second row'
							}
						},
						{
							text: {
								value: 'Second column second row'
							}
						}
					]
				}
			}
		})
		expect(TableAdapter.toText(model)).toMatch(expectedResult)
	})
})
