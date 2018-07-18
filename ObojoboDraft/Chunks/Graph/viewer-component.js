import './viewer-component.scss'

import React from 'react'
import Common from 'Common'
import JXG from 'jsxgraph'

import isOrNot from '../../../src/scripts/common/isornot'
import getFunctionFromText from './get-function-from-text'
// import latexParser from './latex-parser'

const { OboComponent } = Common.components
const { NonEditableChunk } = Common.chunk
const { TextGroupEl } = Common.chunk.textChunk
const { UUID } = Common.util

class Graph extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			boardId: 'obojobo-draft--chunks--graph--' + UUID()
		}

		this.board = null
		this.graph = null
	}

	componentDidMount() {
		const ms = this.props.model.modelState
		const bbox = ms.topLeft.concat(ms.bottomRight)
		// const context = this.refs.canvas.getContext('2d')
		// const chart = new ChartJS(context, ms.chartConfiguration)
		// Create a function graph for f(x) = 0.5*x*x-2*x
		this.board = JXG.JSXGraph.initBoard(this.state.boardId, {
			axis: ms.axis,
			grid: true,
			showcopyright: false,
			shownavigation: false,
			boundingbox: bbox,
			pan: {
				enabled: true,
				needShift: false
			},
			zoom: true
		})
		this.graph = this.board.create(
			'functiongraph',
			[
				new Function('x', `return ${ms.function}`)
				// latexParser.parse(ms.function).fn
				// getFunctionFromText('function(x) { return Math.sin(x) }')
			],
			{ strokeWidth: 2, strokeColor: '#7d18e7' }
		)

		window.__board = this.board
		window.__graph = this.graph
	}

	// zoom() {
	// 	if (this.board) {
	// 		this.board.zoomIn()
	// 	}
	// }

	render() {
		const ms = this.props.model.modelState

		const classNames = [
			'obojobo-draft--chunks--graph',
			'viewer',
			isOrNot(ms.border, 'bordered'),
			`is-size-${ms.size}`
		].join(' ')

		console.log('ms', ms)

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<NonEditableChunk className={classNames}>
					{/* <button onClick={this.zoom.bind(this)}>Zoom In</button> */}
					<div className="container">
						<div className="graph" id={this.state.boardId} style={{ height: ms.height }} />
					</div>
					<div className="caption">
						<TextGroupEl
							textItem={this.props.model.modelState.textGroup.first}
							groupIndex={0}
							key={0}
							parentModel={this.props.model}
						/>
					</div>
				</NonEditableChunk>
			</OboComponent>
		)
	}
}

export default Graph
