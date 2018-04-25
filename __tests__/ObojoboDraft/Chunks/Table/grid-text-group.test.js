import { shallow, mount } from 'enzyme'
import GridTextGroup from '../../../../ObojoboDraft/Chunks/Table/grid-text-group'
import StylableText from '../../../../src/scripts/common/text/styleable-text'

describe('GridTextGroup', () => {
	let expectDimensionsAndMaxItems
	let fillUsingAddRow, fillUsingAddCol
	let gridTextGroup
	beforeEach(() => {
		gridTextGroup = new GridTextGroup(2, 2, {}, [
			{ text: new StylableText('first cell') },
			{ text: new StylableText('second cell') },
			{ text: new StylableText('third cell') },
			{ text: new StylableText('fourth cell') }
		])
		expectDimensionsAndMaxItems = (numRows, numCols, maxItems) => {
			expect(gridTextGroup.numRows).toEqual(numRows)
			expect(gridTextGroup.numCols).toEqual(numCols)
			expect(gridTextGroup.maxItems).toEqual(maxItems)
		}
	})

	it('adds a row to the first index', () => {
		const result = [
			{ text: { value: 'added row cell', styleList: null }, data: {} },
			{ text: { value: 'added row cell', styleList: null }, data: {} },
			{ text: { value: 'first cell', styleList: null }, data: {} },
			{ text: { value: 'second cell', styleList: null }, data: {} },
			{ text: { value: 'third cell', styleList: null }, data: {} },
			{ text: { value: 'fourth cell', styleList: null }, data: {} }
		]

		gridTextGroup.addRow(0, new StylableText('added row cell'))
		expectDimensionsAndMaxItems(3, 2, 6)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('adds a row to a middle index', () => {
		const result = [
			{ text: { value: 'first cell', styleList: null }, data: {} },
			{ text: { value: 'second cell', styleList: null }, data: {} },
			{ text: { value: 'added row cell', styleList: null }, data: {} },
			{ text: { value: 'added row cell', styleList: null }, data: {} },
			{ text: { value: 'third cell', styleList: null }, data: {} },
			{ text: { value: 'fourth cell', styleList: null }, data: {} }
		]

		gridTextGroup.addRow(1, new StylableText('added row cell'))
		expectDimensionsAndMaxItems(3, 2, 6)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('adds a row to the end', () => {
		const result = [
			{ text: { value: 'first cell', styleList: null }, data: {} },
			{ text: { value: 'second cell', styleList: null }, data: {} },
			{ text: { value: 'third cell', styleList: null }, data: {} },
			{ text: { value: 'fourth cell', styleList: null }, data: {} },
			{ text: { value: 'added row cell', styleList: null }, data: {} },
			{ text: { value: 'added row cell', styleList: null }, data: {} }
		]

		gridTextGroup.addRow(2, new StylableText('added row cell'))
		expectDimensionsAndMaxItems(3, 2, 6)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('removes a row from the first index', () => {
		const result = [
			{ text: { value: 'third cell', styleList: null }, data: {} },
			{ text: { value: 'fourth cell', styleList: null }, data: {} }
		]

		gridTextGroup.removeRow(0)
		expectDimensionsAndMaxItems(1, 2, 2)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('removes a row from a middle index', () => {
		const result = [
			{ text: { value: 'added row cell', styleList: null }, data: {} },
			{ text: { value: 'added row cell', styleList: null }, data: {} },
			{ text: { value: 'third cell', styleList: null }, data: {} },
			{ text: { value: 'fourth cell', styleList: null }, data: {} }
		]

		gridTextGroup.addRow(0, new StylableText('added row cell'))
		gridTextGroup.removeRow(1)
		expectDimensionsAndMaxItems(2, 2, 4)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('removes a row from the end', () => {
		const result = [
			{ text: { value: 'first cell', styleList: null }, data: {} },
			{ text: { value: 'second cell', styleList: null }, data: {} }
		]

		gridTextGroup.removeRow(1)
		expectDimensionsAndMaxItems(1, 2, 2)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('adds a col to the first index', () => {
		const result = [
			{ text: { value: 'added col cell', styleList: null }, data: {} },
			{ text: { value: 'first cell', styleList: null }, data: {} },
			{ text: { value: 'second cell', styleList: null }, data: {} },
			{ text: { value: 'added col cell', styleList: null }, data: {} },
			{ text: { value: 'third cell', styleList: null }, data: {} },
			{ text: { value: 'fourth cell', styleList: null }, data: {} }
		]

		gridTextGroup.addCol(0, new StylableText('added col cell'))
		expectDimensionsAndMaxItems(2, 3, 6)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('adds a col to a middle index', () => {
		const result = [
			{ text: { value: 'first cell', styleList: null }, data: {} },
			{ text: { value: 'added col cell', styleList: null }, data: {} },
			{ text: { value: 'second cell', styleList: null }, data: {} },
			{ text: { value: 'third cell', styleList: null }, data: {} },
			{ text: { value: 'added col cell', styleList: null }, data: {} },
			{ text: { value: 'fourth cell', styleList: null }, data: {} }
		]

		gridTextGroup.addCol(1, new StylableText('added col cell'))
		expectDimensionsAndMaxItems(2, 3, 6)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('adds a col to the end', () => {
		const result = [
			{ text: { value: 'first cell', styleList: null }, data: {} },
			{ text: { value: 'second cell', styleList: null }, data: {} },
			{ text: { value: 'added col cell', styleList: null }, data: {} },
			{ text: { value: 'third cell', styleList: null }, data: {} },
			{ text: { value: 'fourth cell', styleList: null }, data: {} },
			{ text: { value: 'added col cell', styleList: null }, data: {} }
		]

		gridTextGroup.addCol(2, new StylableText('added col cell'))
		expectDimensionsAndMaxItems(2, 3, 6)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('removes a col from the first index', () => {
		const result = [
			{ text: { value: 'second cell', styleList: null }, data: {} },
			{ text: { value: 'fourth cell', styleList: null }, data: {} }
		]

		gridTextGroup.removeCol(0)
		expectDimensionsAndMaxItems(2, 1, 2)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('removes a col from a middle index', () => {
		const result = [
			{ text: { value: 'first cell', styleList: null }, data: {} },
			{ text: { value: 'second cell', styleList: null }, data: {} },
			{ text: { value: 'third cell', styleList: null }, data: {} },
			{ text: { value: 'fourth cell', styleList: null }, data: {} }
		]

		gridTextGroup.addCol(1, new StylableText('added col cell'))
		gridTextGroup.removeCol(1)
		expectDimensionsAndMaxItems(2, 2, 4)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('removes a col from the end', () => {
		const result = [
			{ text: { value: 'first cell', styleList: null }, data: {} },
			{ text: { value: 'third cell', styleList: null }, data: {} }
		]

		gridTextGroup.removeCol(1)
		expectDimensionsAndMaxItems(2, 1, 2)
		expect(gridTextGroup.toDescriptor().textGroup).toEqual(result)
	})

	it('can be cloned', () => {
		const tempGridTextGroup = new GridTextGroup(1, 1, { num: true }, [
			{ text: new StylableText('first cell'), data: { num: 1 } }
		])
		expect(tempGridTextGroup.clone().toDescriptor()).toEqual(tempGridTextGroup.toDescriptor())
	})

	it('can be converted to its descriptor', () => {
		const mockDataToDescriptorFn = jest.fn(data => {
			return { num: data.num * 2 }
		})
		const tempGridTextGroup = new GridTextGroup(1, 2, { num: true }, [
			{ text: new StylableText('first cell'), data: { num: 1 } },
			{ text: new StylableText('second cell'), data: { num: 2 } }
		])

		const result = {
			textGroup: [
				{ text: { styleList: null, value: 'first cell' }, data: { num: 1 } },
				{ text: { styleList: null, value: 'second cell' }, data: { num: 2 } }
			],
			numRows: 1,
			numCols: 2
		}

		const resultAfterFunction = {
			textGroup: [
				{ text: { styleList: null, value: 'first cell' }, data: { num: 2 } },
				{ text: { styleList: null, value: 'second cell' }, data: { num: 4 } }
			],
			numRows: 1,
			numCols: 2
		}

		expect(tempGridTextGroup.toDescriptor()).toEqual(result)
		expect(tempGridTextGroup.toDescriptor(mockDataToDescriptorFn)).toEqual(resultAfterFunction)
	})
})
