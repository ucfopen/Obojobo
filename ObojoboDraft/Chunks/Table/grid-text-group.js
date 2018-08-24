import Common from 'Common'

const { TextGroup } = Common.textGroup
const { TextGroupItem } = Common.textGroup
const Util = Common.textGroup.TextGroupUtil
const { StyleableText } = Common.text

class GridTextGroup extends TextGroup {
	constructor(numRows, numCols, dataTemplate, initialItems) {
		super(numRows * numCols, dataTemplate, initialItems)

		this.numRows = numRows
		this.numCols = numCols
		this.fill()
	}

	static fromDescriptor(
		descriptor,
		maxItems,
		dataTemplate,
		restoreDataDescriptorFn = Util.defaultCloneFn
	) {
		const items = []
		for (const item of Array.from(descriptor.textGroup)) {
			items.push(
				new TextGroupItem(
					StyleableText.createFromObject(item.text),
					restoreDataDescriptorFn(item.data)
				)
			)
		}

		return new GridTextGroup(descriptor.numRows, descriptor.numCols, dataTemplate, items)
	}

	static create(numRows, numCols, dataTemplate = {}) {
		const group = new GridTextGroup(numRows, numCols, dataTemplate)
		group.init(group.maxItems)

		return group
	}

	addRow(rowIndex = Infinity, text = null, data = null) {
		if (rowIndex === Infinity) {
			rowIndex = this.numRows
		}

		// 0 | 1 | 2
		// 3 | 4 | 5
		// 6 | 7 | 8

		this.maxItems += this.numCols

		const firstInRowIndex = rowIndex * this.numCols
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

	addCol(colIndex = Infinity, text = null, data = null) {
		if (colIndex === Infinity) {
			colIndex = this.numCols
		}

		this.maxItems += this.numRows

		for (let i = this.numRows - 1; i >= 0; i--) {
			this.addAt(i * this.numCols + colIndex, text, data)
		}

		// If there are no rows, adding a column is meaningless
		if (this.numRows !== 0) this.numCols++

		return this
	}

	removeRow(rowIndex = Infinity) {
		// If there are no rows, or no columns, removing a row is meaningless
		if (this.numRows <= 0 || this.numCols <= 0) return this

		if (rowIndex === Infinity) {
			rowIndex = this.numRows - 1
		}
		this.maxItems -= this.numCols

		const firstInRowIndex = rowIndex * this.numCols
		for (let i = firstInRowIndex, end = firstInRowIndex + this.numCols - 1; i <= end; i++) {
			this.remove(firstInRowIndex)
		}

		this.numRows--

		return this
	}

	removeCol(colIndex = Infinity) {
		// If there are no rows, or no columns, removing a column is meaningless
		if (this.numRows <= 0 || this.numCols <= 0) return this

		if (colIndex === Infinity) {
			colIndex = this.numCols - 1
		}
		this.maxItems -= this.numRows

		for (let i = this.numRows - 1; i >= 0; i--) {
			this.remove(i * this.numCols + colIndex)
		}

		this.numCols--

		return this
	}

	clone(cloneDataFn = Util.defaultCloneFn) {
		const clonedItems = []

		for (const item of this.items) {
			clonedItems.push(item.clone(cloneDataFn))
		}

		return new GridTextGroup(this.numRows, this.numCols, this.dataTemplate, clonedItems)
	}

	toDescriptor(dataToDescriptorFn = Util.defaultCloneFn) {
		const desc = []

		for (const item of this.items) {
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
