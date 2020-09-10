import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { TextGroupEl } = Common.chunk.textChunk
const { OboComponent } = Viewer.components

const Table = props => {
	let header, row
	const { model } = props
	const data = model.modelState
	const { numCols } = data.textGroup

	if (data.header) {
		row = data.textGroup.items.slice(0, numCols).map((textGroupItem, index) => (
			<th
				key={index}
				className={`cell row-0 col-${index}`}
				data-table-position={model.get('id') + ',0,' + index}
			>
				<TextGroupEl parentModel={props.model} textItem={textGroupItem} groupIndex={index} />
			</th>
		))

		header = <tr key="header">{row}</tr>
	} else {
		header = null
	}

	const startIndex = data.header ? 1 : 0
	const rows = __range__(startIndex, data.textGroup.numRows, false).map(rowNum => {
		row = data.textGroup.items
			.slice(rowNum * numCols, (rowNum + 1) * numCols)
			.map((textGroupItem, index) => (
				<td
					key={index}
					className={`cell row-${rowNum} col-${index}`}
					data-table-position={model.get('id') + ',' + rowNum + ',' + index}
				>
					<TextGroupEl
						parentModel={props.model}
						textItem={textGroupItem}
						groupIndex={rowNum * numCols + index}
					/>
				</td>
			))

		return <tr key={rowNum}>{row}</tr>
	})

	const fixedWidth = data.fixedWidth

	return (
		<OboComponent model={props.model} moduleData={props.moduleData}>
			<div className="obojobo-draft--chunks--table viewer pad">
				<p>here: {fixedWidth}</p>
				<div className="container">
					<table className={fixedWidth ? 'view' : 'view no-fixed-width'} key="table">
						<thead key="thead">{header}</thead>
						<tbody key="tbody">{rows}</tbody>
					</table>
				</div>
			</div>
		</OboComponent>
	)
}

function __range__(left, right) {
	const range = []
	for (let i = left; i < right; i++) {
		range.push(i)
	}
	return range
}

export default Table
