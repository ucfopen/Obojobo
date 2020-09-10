jest.mock('obojobo-document-engine/src/scripts/common/models/obo-model', () => {
	return require('obojobo-document-engine/__mocks__/obo-model-adapter-mock').default
})
import OboModel from 'obojobo-document-engine/src/scripts/common/models/obo-model'

import TableAdapter from './adapter'
import GridTextGroup from './grid-text-group'
import StylableText from 'obojobo-document-engine/src/scripts/common/text/styleable-text'

describe('Table adapter', () => {
	test('construct builds without attributes', () => {
		const model = new OboModel({})
		TableAdapter.construct(model)

		expect(model.modelState.textGroup).toEqual(GridTextGroup.create(3, 2, null))
	})

	test('construct builds with attributes', () => {
		const attrs = {
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
		}
		const model = new OboModel(attrs)

		TableAdapter.construct(model, attrs)
		const tempGridTextGroup = GridTextGroup.create(2, 2, { indent: 0 })
		tempGridTextGroup.set(0, new StylableText('First column heading'))
		tempGridTextGroup.set(1, new StylableText('Second column heading'))
		tempGridTextGroup.set(2, new StylableText('First column second row'))
		tempGridTextGroup.set(3, new StylableText('Second column second row'))

		expect(model.modelState.textGroup).toEqual(tempGridTextGroup)
	})

	test.each`
		input                                               | output
		${''}                                               | ${'fixed'}
		${'fixed'}                                          | ${'fixed'}
		${'auto'}                                           | ${'auto'}
		${'invalid-value'}                                  | ${'fixed'}
		${'  FIxEd  '}                                      | ${'fixed'}
		${'  aUTO  '}                                       | ${'auto'}
		${true}                                             | ${'fixed'}
		${false}                                            | ${'fixed'}
		${'true'}                                           | ${'fixed'}
		${'false'}                                          | ${'fixed'}
		${null}                                             | ${'fixed'}
		${'null'}                                           | ${'fixed'}
		${undefined /* eslint-disable-line no-undefined */} | ${'fixed'}
		${'undefined'}                                      | ${'fixed'}
	`('display property "$input" = "$output"', ({ input, output }) => {
		const model = new OboModel({ content: { display: input } })

		TableAdapter.construct(model)

		expect(model.modelState.display).toBe(output)
	})

	test('display property is cleaned up and respects defaults', () => {
		const a = new OboModel({ content: {} })
		const b = new OboModel({ content: { display: 'fixed' } })
		const c = new OboModel({ content: { display: 'auto' } })
		const d = new OboModel({ content: { display: 'invalid-value' } })
		const e = new OboModel({ content: { display: '  FIxEd ' } })
		const f = new OboModel({ content: { display: '   aUTO  ' } })
		const g = new OboModel({ content: { display: true } })
		const h = new OboModel({ content: { display: false } })
		const i = new OboModel({ content: { display: null } })
		const j = new OboModel({ content: { display: undefined } }) //eslint-disable-line no-undefined
		const k = new OboModel({})

		TableAdapter.construct(a)
		TableAdapter.construct(b)
		TableAdapter.construct(c)
		TableAdapter.construct(d)
		TableAdapter.construct(e)
		TableAdapter.construct(f)
		TableAdapter.construct(g)
		TableAdapter.construct(h)
		TableAdapter.construct(i)
		TableAdapter.construct(j)
		TableAdapter.construct(k)

		expect(a.modelState.display).toBe('fixed')
		expect(b.modelState.display).toBe('fixed')
		expect(c.modelState.display).toBe('auto')
		expect(d.modelState.display).toBe('fixed')
		expect(e.modelState.display).toBe('fixed')
		expect(f.modelState.display).toBe('auto')
		expect(g.modelState.display).toBe('fixed')
		expect(h.modelState.display).toBe('fixed')
		expect(i.modelState.display).toBe('fixed')
		expect(j.modelState.display).toBe('fixed')
		expect(j.modelState.display).toBe('fixed')
	})

	test('clone creates a copy', () => {
		const a = new OboModel({ header: 'mockHeader', display: 'mockDisplay' })
		const b = new OboModel({})

		TableAdapter.construct(a)
		TableAdapter.clone(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState).toEqual(b.modelState)
	})

	test('toJSON builds a JSON representation', () => {
		const a = new OboModel({ modelState: { header: 'mockHeader' } })
		const b = { content: {} }

		TableAdapter.construct(a)
		TableAdapter.toJSON(a, b)

		expect(a).not.toBe(b)
		expect(a.modelState.header).toEqual(b.content.header)
	})

	test('toText creates a text representation', () => {
		const attrs = {
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
		}
		const model = new OboModel(attrs)

		const expectedResult = `------------------------
| First column heading     | Second column heading    |
------------------------
| First column second row  | Second column second row |
------------------------`

		TableAdapter.construct(model, attrs)
		expect(TableAdapter.toText(model)).toMatch(expectedResult)
	})
})
