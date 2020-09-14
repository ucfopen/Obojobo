import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import Dispatcher from 'obojobo-document-engine/src/scripts/common/flux/dispatcher'

const { TextGroupEl } = Common.chunk.textChunk
const { OboComponent } = Viewer.components

class Table extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isShowingScrollbar: false
		}

		this.containerRef = React.createRef()
		this.updateIfScrollbarNeeded = this.updateIfScrollbarNeeded.bind(this)
	}

	componentDidMount() {
		Dispatcher.on('viewer:contentAreaResized', this.updateIfScrollbarNeeded)

		this.updateIfScrollbarNeeded()
	}

	componentWillUnmount() {
		Dispatcher.off('viewer:contentAreaResized', this.updateIfScrollbarNeeded)
	}

	updateIfScrollbarNeeded() {
		const el = this.containerRef.current

		if (!el) {
			return
		}

		this.setState({
			isShowingScrollbar: el.scrollWidth > el.clientWidth
		})
	}

	render() {
		let header, row
		const { model } = this.props
		const modelState = model.modelState
		const { numCols } = modelState.textGroup

		if (modelState.header) {
			row = modelState.textGroup.items.slice(0, numCols).map((textGroupItem, index) => (
				<th
					key={index}
					className={`cell row-0 col-${index}`}
					data-table-position={model.get('id') + ',0,' + index}
				>
					<TextGroupEl parentModel={this.props.model} textItem={textGroupItem} groupIndex={index} />
				</th>
			))

			header = <tr key="header">{row}</tr>
		} else {
			header = null
		}

		const startIndex = modelState.header ? 1 : 0
		const rows = __range__(startIndex, modelState.textGroup.numRows, false).map(rowNum => {
			row = modelState.textGroup.items
				.slice(rowNum * numCols, (rowNum + 1) * numCols)
				.map((textGroupItem, index) => (
					<td
						key={index}
						className={`cell row-${rowNum} col-${index}`}
						data-table-position={model.get('id') + ',' + rowNum + ',' + index}
					>
						<TextGroupEl
							parentModel={this.props.model}
							textItem={textGroupItem}
							groupIndex={rowNum * numCols + index}
						/>
					</td>
				))

			return <tr key={rowNum}>{row}</tr>
		})

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<div
					className={`obojobo-draft--chunks--table viewer pad ${isOrNot(
						this.state.isShowingScrollbar,
						'showing-scrollbar'
					)}`}
				>
					<div ref={this.containerRef} className="container">
						<table className={`view is-display-type-${modelState.display}`} key="table">
							<thead key="thead">{header}</thead>
							<tbody key="tbody">{rows}</tbody>
						</table>
					</div>
				</div>
			</OboComponent>
		)
	}
}

function __range__(left, right) {
	const range = []
	for (let i = left; i < right; i++) {
		range.push(i)
	}
	return range
}

export default Table
