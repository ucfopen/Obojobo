import React from 'react'

const MATH_NODE = 'ObojoboDraft.Chunks.MathEquation'

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = this.props.node.data.get('content')
	}

	handleLatexChange(event) {
		this.setState({ latex: event.target.value })
	}

	handleLabelChange(event) {
		this.setState({ label: event.target.value })
	}

	renderEquation() {
		const { isFocused } = this.props

		const wrapperStyle = {
			position: 'relative',
		}

		const maskStyle = {
			display: isFocused ? 'none' : 'block',
			position: 'absolute',
			top: '0',
			left: '0',
			height: '100%',
			width: '100%',
			cursor: 'cell',
			zIndex: 1,
		}

		const inputStyle = {
			width: '50%',
			float: 'left',
			textAlign: 'center'
		}

		return (
			<div
				style={wrapperStyle}
				className={'obojobo-draft--chunks--math-equation'}>
				<div style={maskStyle} />
				<div style={inputStyle}>
					<p>Latex Equation</p>
					<input
						name={'Latex Equation'}
						value={this.state.latex}
						onChange={event => this.handleLatexChange(event)}
						onClick={event => event.stopPropagation()}
						frameBorder="0"/>
				</div>
				<div style={inputStyle}>
					<p>Equation Label</p>
					<input
						name={'Equation Label'}
						value={this.state.label}
						onChange={event => this.handleLabelChange(event)}
						onClick={event => event.stopPropagation()}
						frameBorder="0"/>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div {...this.props.attributes} >
				{this.renderEquation()}
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock({
			type: MATH_NODE,
			data: { content: { latex: 'banana', label: '(1.1)'} },
			isVoid: true
		})
		.collapseToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = node.data.get('content') || {}

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case MATH_NODE:
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.MathEquation': {
				isVoid: true
			}
		}
	}
}

const MathEquation = {
	components: {
		Node,
	},
	helpers: {
		insertNode,
		slateToObo
	},
	plugins
}

export default MathEquation
