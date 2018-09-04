import Common from 'Common'

let { TextGroup } = Common.textGroup
let { TextGroupItem } = Common.textGroup
let Util = Common.textGroup.TextGroupUtil
let { StyleableText } = Common.text

class GridTextGroup extends TextGroup {
	constructor(numRows, numCols, dataTemplate, initialItems) {
		super(numRows * numCols, dataTemplate, initialItems)

		this.numRows = numRows
		this.numCols = numCols
		this.fill()
	}

	static fromDescriptor(descriptor, maxItems, dataTemplate, restoreDataDescriptorFn) {
		if (restoreDataDescriptorFn == null) {
			restoreDataDescriptorFn = Util.defaultCloneFn
		}
		let items = []
		for (let item of Array.from(descriptor.textGroup)) {
			items.push(
				new TextGroupItem(
					StyleableText.createFromObject(item.text),
					restoreDataDescriptorFn(item.data)
				)
			)
		}

		return new GridTextGroup(descriptor.numRows, descriptor.numCols, dataTemplate, items)
	}

	static create(numRows, numCols, dataTemplate) {
		if (dataTemplate == null) {
			dataTemplate = {}
		}
		let group = new GridTextGroup(numRows, numCols, dataTemplate)
		group.init(group.maxItems)

		return group
	}

	addRow(rowIndex, text, data) {
		if (rowIndex == null) {
			rowIndex = this.numRows
		}
		if (text == null) {
			text = null
		}
		if (data == null) {
			data = null
		}
		// 0 | 1 | 2
		// 3 | 4 | 5
		// 6 | 7 | 8

		this.maxItems += this.numCols

		let firstInRowIndex = rowIndex * this.numCols
		for (
			let i = firstInRowIndex,
				end = firstInRowIndex + this.numCols - 1,
				asc = firstInRowIndex <= end;
			asc ? i <= end : i >= end;
			asc ? i++ : i--
		) {
			this.addAt(i, text, data)
		}

		// If there are no columns, adding a row is meaningless
		if (this.numCols !== 0) this.numRows++

		return this
	}

	addCol(colIndex, text, data) {
		if (colIndex == null) {
			colIndex = this.numCols
		}
		if (text == null) {
			text = null
		}
		if (data == null) {
			data = null
		}
		this.maxItems += this.numRows

		for (let i = this.numRows - 1; i >= 0; i--) {
			this.addAt(i * this.numCols + colIndex, text, data)
		}

		// If there are no rows, adding a column is meaningless
		if (this.numRows !== 0) this.numCols++

		return this
	}

	removeRow(rowIndex) {
		// If there are no rows, or no columns, removing a row is meaningless
		if (this.numRows <= 0 || this.numCols <= 0) return this

		if (rowIndex == null) {
			rowIndex = this.numRows - 1
		}
		this.maxItems -= this.numCols

		let firstInRowIndex = rowIndex * this.numCols
		for (let i = firstInRowIndex, end = firstInRowIndex + this.numCols - 1; i <= end; i++) {
			this.remove(firstInRowIndex)
		}

		this.numRows--

		return this
	}

	removeCol(colIndex) {
		// If there are no rows, or no columns, removing a column is meaningless
		if (this.numRows <= 0 || this.numCols <= 0) return this

		if (colIndex == null) {
			colIndex = this.numCols - 1
		}
		this.maxItems -= this.numRows

		for (let i = this.numRows - 1; i >= 0; i--) {
			this.remove(i * this.numCols + colIndex)
		}

		this.numCols--

		return this
	}

	clone(cloneDataFn) {
		if (cloneDataFn == null) {
			cloneDataFn = Util.defaultCloneFn
		}
		let clonedItems = []

		for (let item of this.items) {
			clonedItems.push(item.clone(cloneDataFn))
		}

		return new GridTextGroup(this.numRows, this.numCols, this.dataTemplate, clonedItems)
	}

	toDescriptor(dataToDescriptorFn) {
		if (dataToDescriptorFn == null) {
			dataToDescriptorFn = Util.defaultCloneFn
		}
		let desc = []

		for (let item of this.items) {
			desc.push({ text: item.text.getExportedObject(), data: dataToDescriptorFn(item.data) })
		}

		return {
			textGroup: desc,
			numRows: this.numRows,
			numCols: this.numCols
		}
	}
}

export default GridTextGroup
