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

	test('constructor builds a GridTextGroup', () => {
		let gridTextGroup = new GridTextGroup(2, 2, {}, [
			{ text: new StylableText('first cell') },
			{ text: new StylableText('second cell') },
			{ text: new StylableText('third cell') },
			{ text: new StylableText('fourth cell') }
		])

		/*
		Expected Grid:
		----------------------------
		| first cell | second cell |
		----------------------------
		| third cell | fourth cell |
		----------------------------
		*/

		expect(gridTextGroup.numRows).toEqual(2)
		expect(gridTextGroup.numCols).toEqual(2)
		expect(gridTextGroup.maxItems).toEqual(4)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 2,
			numRows: 2,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'first cell' } },
				{ data: {}, text: { styleList: null, value: 'second cell' } },
				{ data: {}, text: { styleList: null, value: 'third cell' } },
				{ data: {}, text: { styleList: null, value: 'fourth cell' } }
			]
		})
	})

	test('fromDescriptor builds a GridTextGroup from a descriptor with default method', () => {
		let descriptor = {
			numRows: 2,
			numCols: 2,
			textGroup: [
				{
					text: {
						value: 'first cell'
					}
				},
				{
					text: {
						value: 'second cell'
					}
				},
				{
					text: {
						value: 'third cell'
					}
				},
				{
					text: {
						value: 'fourth cell'
					}
				}
			]
		}

		let grid = GridTextGroup.fromDescriptor(descriptor)

		/*
		Expected Grid:
		----------------------------
		| first cell | second cell |
		----------------------------
		| third cell | fourth cell |
		----------------------------
		*/

		expect(grid.numRows).toEqual(2)
		expect(grid.numCols).toEqual(2)
		expect(grid.maxItems).toEqual(4)
		expect(grid).toMatchSnapshot()
		expect(grid.toDescriptor()).toEqual({
			numCols: 2,
			numRows: 2,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'first cell' } },
				{ data: {}, text: { styleList: null, value: 'second cell' } },
				{ data: {}, text: { styleList: null, value: 'third cell' } },
				{ data: {}, text: { styleList: null, value: 'fourth cell' } }
			]
		})
	})

	test('fromDescriptor builds a GridTextGroup from a descriptor with custom method', () => {
		let descriptor = {
			numRows: 2,
			numCols: 2,
			textGroup: [
				{
					text: {
						value: 'first cell'
					}
				},
				{
					text: {
						value: 'second cell'
					}
				},
				{
					text: {
						value: 'third cell'
					}
				},
				{
					text: {
						value: 'fourth cell'
					}
				}
			]
		}
		let customMethod = jest.fn()

		let grid = GridTextGroup.fromDescriptor(descriptor, 4, {}, customMethod)

		/*
		Expected Grid:
		----------------------------
		| first cell | second cell |
		----------------------------
		| third cell | fourth cell |
		----------------------------
		*/

		expect(customMethod).toHaveBeenCalledTimes(4)
		expect(grid.numRows).toEqual(2)
		expect(grid.numCols).toEqual(2)
		expect(grid.maxItems).toEqual(4)
		expect(grid).toMatchSnapshot()
		expect(grid.toDescriptor()).toEqual({
			numCols: 2,
			numRows: 2,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'first cell' } },
				{ data: {}, text: { styleList: null, value: 'second cell' } },
				{ data: {}, text: { styleList: null, value: 'third cell' } },
				{ data: {}, text: { styleList: null, value: 'fourth cell' } }
			]
		})
	})

	test('create builds without data template', () => {
		let grid = GridTextGroup.create(2, 2)

		/*
		Expected Grid:
		---------
		|   |   |
		---------
		|   |   |
		---------
		*/

		expect(grid.numRows).toEqual(2)
		expect(grid.numCols).toEqual(2)
		expect(grid.maxItems).toEqual(4)
		expect(grid).toMatchSnapshot()
		expect(grid.toDescriptor()).toEqual({
			numCols: 2,
			numRows: 2,
			textGroup: [
				{ data: {}, text: { styleList: null, value: '' } },
				{ data: {}, text: { styleList: null, value: '' } },
				{ data: {}, text: { styleList: null, value: '' } },
				{ data: {}, text: { styleList: null, value: '' } }
			]
		})
	})

	test('create builds with data template', () => {
		let grid = GridTextGroup.create(2, 2, {})

		/*
		Expected Grid:
		---------
		|   |   |
		---------
		|   |   |
		---------
		*/

		expect(grid.numRows).toEqual(2)
		expect(grid.numCols).toEqual(2)
		expect(grid.maxItems).toEqual(4)
		expect(grid).toMatchSnapshot()
		expect(grid.toDescriptor()).toEqual({
			numCols: 2,
			numRows: 2,
			textGroup: [
				{ data: {}, text: { styleList: null, value: '' } },
				{ data: {}, text: { styleList: null, value: '' } },
				{ data: {}, text: { styleList: null, value: '' } },
				{ data: {}, text: { styleList: null, value: '' } }
			]
		})
	})

	test('addRow does not add to an empty grid', () => {
		let gridTextGroup = new GridTextGroup(0, 0, {})

		/*
		Expected Grid:
		Empty
		*/

		gridTextGroup.addRow()
		expect(gridTextGroup.numRows).toEqual(0)
		expect(gridTextGroup.numCols).toEqual(0)
		expect(gridTextGroup.maxItems).toEqual(0)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 0,
			numRows: 0,
			textGroup: []
		})
	})

	test('addRow adds with no values', () => {
		let gridTextGroup = new GridTextGroup(2, 2, {}, [
			{ text: new StylableText('first cell') },
			{ text: new StylableText('second cell') },
			{ text: new StylableText('third cell') },
			{ text: new StylableText('fourth cell') }
		])

		/*
		Expected Grid:
		----------------------------
		| first cell | second cell |
		----------------------------
		| third cell | fourth cell |
		----------------------------
		|            |             |
		----------------------------
		*/

		gridTextGroup.addRow()
		expect(gridTextGroup.numRows).toEqual(3)
		expect(gridTextGroup.numCols).toEqual(2)
		expect(gridTextGroup.maxItems).toEqual(6)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 2,
			numRows: 3,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'first cell' } },
				{ data: {}, text: { styleList: null, value: 'second cell' } },
				{ data: {}, text: { styleList: null, value: 'third cell' } },
				{ data: {}, text: { styleList: null, value: 'fourth cell' } },
				{ data: {}, text: { styleList: null, value: '' } },
				{ data: {}, text: { styleList: null, value: '' } }
			]
		})
	})

	test('addRow adds with given values', () => {
		let gridTextGroup = new GridTextGroup(2, 2, {}, [
			{ text: new StylableText('first cell') },
			{ text: new StylableText('second cell') },
			{ text: new StylableText('third cell') },
			{ text: new StylableText('fourth cell') }
		])

		/*
		Expected Grid:
		-----------------------------------
		|   first cell   |   second cell  |
		-----------------------------------
		| added row cell | added row cell |
		-----------------------------------
		|   third cell   |   fourth cell  |
		-----------------------------------
		*/

		gridTextGroup.addRow(1, new StylableText('added row cell'), {})
		expect(gridTextGroup.numRows).toEqual(3)
		expect(gridTextGroup.numCols).toEqual(2)
		expect(gridTextGroup.maxItems).toEqual(6)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 2,
			numRows: 3,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'first cell' } },
				{ data: {}, text: { styleList: null, value: 'second cell' } },
				{ data: {}, text: { styleList: null, value: 'added row cell' } },
				{ data: {}, text: { styleList: null, value: 'added row cell' } },
				{ data: {}, text: { styleList: null, value: 'third cell' } },
				{ data: {}, text: { styleList: null, value: 'fourth cell' } }
			]
		})
	})

	test('addCol does not add to an empty grid', () => {
		let gridTextGroup = new GridTextGroup(0, 0, {})

		/*
		Expected Grid:
		Empty
		*/

		gridTextGroup.addCol()
		expect(gridTextGroup.numRows).toEqual(0)
		expect(gridTextGroup.numCols).toEqual(0)
		expect(gridTextGroup.maxItems).toEqual(0)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 0,
			numRows: 0,
			textGroup: []
		})
	})

	test('addCol adds with no values', () => {
		let gridTextGroup = new GridTextGroup(2, 2, {}, [
			{ text: new StylableText('first cell') },
			{ text: new StylableText('second cell') },
			{ text: new StylableText('third cell') },
			{ text: new StylableText('fourth cell') }
		])

		/*
		Expected Grid:
		-----------------------------------
		| first cell | second cell |      |
		-----------------------------------
		| third cell | fourth cell |      |
		-----------------------------------
		*/

		gridTextGroup.addCol()
		expect(gridTextGroup.numRows).toEqual(2)
		expect(gridTextGroup.numCols).toEqual(3)
		expect(gridTextGroup.maxItems).toEqual(6)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 3,
			numRows: 2,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'first cell' } },
				{ data: {}, text: { styleList: null, value: 'second cell' } },
				{ data: {}, text: { styleList: null, value: '' } },
				{ data: {}, text: { styleList: null, value: 'third cell' } },
				{ data: {}, text: { styleList: null, value: 'fourth cell' } },
				{ data: {}, text: { styleList: null, value: '' } }
			]
		})
	})

	test('addCol adds with given values', () => {
		let gridTextGroup = new GridTextGroup(2, 2, {}, [
			{ text: new StylableText('first cell') },
			{ text: new StylableText('second cell') },
			{ text: new StylableText('third cell') },
			{ text: new StylableText('fourth cell') }
		])

		/*
		Expected Grid:
		---------------------------------------------
		| first cell | added row cell | second cell |
		---------------------------------------------
		| third cell | added row cell | fourth cell |
		---------------------------------------------
		*/

		gridTextGroup.addCol(1, new StylableText('added row cell'), {})
		expect(gridTextGroup.numRows).toEqual(2)
		expect(gridTextGroup.numCols).toEqual(3)
		expect(gridTextGroup.maxItems).toEqual(6)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 3,
			numRows: 2,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'first cell' } },
				{ data: {}, text: { styleList: null, value: 'added row cell' } },
				{ data: {}, text: { styleList: null, value: 'second cell' } },
				{ data: {}, text: { styleList: null, value: 'third cell' } },
				{ data: {}, text: { styleList: null, value: 'added row cell' } },
				{ data: {}, text: { styleList: null, value: 'fourth cell' } }
			]
		})
	})

	test('removeRow does nothing to an empty grid', () => {
		let gridTextGroup = new GridTextGroup(0, 0, {})

		gridTextGroup.removeRow()
		expect(gridTextGroup.numRows).toEqual(0)
		expect(gridTextGroup.numCols).toEqual(0)
		expect(gridTextGroup.maxItems).toEqual(0)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 0,
			numRows: 0,
			textGroup: []
		})
	})

	test('removeRow removes the last row by default', () => {
		let gridTextGroup = new GridTextGroup(2, 2, {}, [
			{ text: new StylableText('first cell') },
			{ text: new StylableText('second cell') },
			{ text: new StylableText('third cell') },
			{ text: new StylableText('fourth cell') }
		])

		/*
		Expected Grid:
		----------------------------
		| first cell | second cell |
		----------------------------
		*/

		gridTextGroup.removeRow()
		expect(gridTextGroup.numRows).toEqual(1)
		expect(gridTextGroup.numCols).toEqual(2)
		expect(gridTextGroup.maxItems).toEqual(2)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 2,
			numRows: 1,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'first cell' } },
				{ data: {}, text: { styleList: null, value: 'second cell' } }
			]
		})
	})

	test('removeRow removes a specified row', () => {
		let gridTextGroup = new GridTextGroup(2, 2, {}, [
			{ text: new StylableText('first cell') },
			{ text: new StylableText('second cell') },
			{ text: new StylableText('third cell') },
			{ text: new StylableText('fourth cell') }
		])

		/*
		Expected Grid:
		----------------------------
		| third cell | fourth cell |
		----------------------------
		*/

		gridTextGroup.removeRow(0)
		expect(gridTextGroup.numRows).toEqual(1)
		expect(gridTextGroup.numCols).toEqual(2)
		expect(gridTextGroup.maxItems).toEqual(2)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 2,
			numRows: 1,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'third cell' } },
				{ data: {}, text: { styleList: null, value: 'fourth cell' } }
			]
		})
	})

	test('removeCol does nothing to an empty grid', () => {
		let gridTextGroup = new GridTextGroup(0, 0, {})

		gridTextGroup.removeCol()
		expect(gridTextGroup.numRows).toEqual(0)
		expect(gridTextGroup.numCols).toEqual(0)
		expect(gridTextGroup.maxItems).toEqual(0)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 0,
			numRows: 0,
			textGroup: []
		})
	})

	test('removeCol removes the last row by default', () => {
		let gridTextGroup = new GridTextGroup(2, 2, {}, [
			{ text: new StylableText('first cell') },
			{ text: new StylableText('second cell') },
			{ text: new StylableText('third cell') },
			{ text: new StylableText('fourth cell') }
		])

		/*
		Expected Grid:
		--------------
		| first cell |
		--------------
		| third cell |
		--------------
		*/

		gridTextGroup.removeCol()
		expect(gridTextGroup.numRows).toEqual(2)
		expect(gridTextGroup.numCols).toEqual(1)
		expect(gridTextGroup.maxItems).toEqual(2)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 1,
			numRows: 2,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'first cell' } },
				{ data: {}, text: { styleList: null, value: 'third cell' } }
			]
		})
	})

	test('removeCol removes a specified row', () => {
		let gridTextGroup = new GridTextGroup(2, 2, {}, [
			{ text: new StylableText('first cell') },
			{ text: new StylableText('second cell') },
			{ text: new StylableText('third cell') },
			{ text: new StylableText('fourth cell') }
		])

		/*
		Expected Grid:
		---------------
		| second cell |
		---------------
		| fourth cell |
		---------------
		*/

		gridTextGroup.removeCol(0)
		expect(gridTextGroup.numRows).toEqual(2)
		expect(gridTextGroup.numCols).toEqual(1)
		expect(gridTextGroup.maxItems).toEqual(2)
		expect(gridTextGroup).toMatchSnapshot()
		expect(gridTextGroup.toDescriptor()).toEqual({
			numCols: 1,
			numRows: 2,
			textGroup: [
				{ data: {}, text: { styleList: null, value: 'second cell' } },
				{ data: {}, text: { styleList: null, value: 'fourth cell' } }
			]
		})
	})

	test('clone creates a copy', () => {
		const tempGridTextGroup = new GridTextGroup(1, 1, { num: true }, [
			{ text: new StylableText('first cell'), data: { num: 1 } }
		])
		expect(tempGridTextGroup.clone().toDescriptor()).toEqual(tempGridTextGroup.toDescriptor())
	})

	test('clone creates a copy with a custom function', () => {
		const tempGridTextGroup = new GridTextGroup(1, 1, { num: true }, [
			{ text: new StylableText('first cell'), data: { num: 1 } }
		])
		const customFunction = jest.fn().mockReturnValueOnce({ num: 1 })

		expect(tempGridTextGroup.clone(customFunction).toDescriptor()).toEqual(
			tempGridTextGroup.toDescriptor()
		)
	})

	test('toDescriptor ceates a description', () => {
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
