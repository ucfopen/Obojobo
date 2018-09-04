import './viewer-component.scss'

import React from 'react'
import ChartJS from 'chart.js'
import Common from 'Common'

import isOrNot from '../../../src/scripts/common/isornot'

const { OboComponent } = Common.components
const { NonEditableChunk } = Common.chunk
const { TextGroupEl } = Common.chunk.textChunk

class Chart extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		const context = this.refs.canvas.getContext('2d')
		const chart = new ChartJS(context, this.props.model.modelState.chartConfiguration)
	}

	render() {
		const ms = this.props.model.modelState

		const classNames = [
			'obojobo-draft--chunks--chart',
			'viewer',
			isOrNot(ms.border, 'bordered'),
			`is-size-${ms.size}`
		].join(' ')

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<NonEditableChunk className={classNames}>
					<div className="container">
						<canvas ref="canvas" />
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

export default Chart
