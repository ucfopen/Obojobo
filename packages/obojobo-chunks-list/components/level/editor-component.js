import '../../viewer-component.scss'

import React from 'react'

class Level extends React.Component {
	constructor(props) {
		super(props)
	}

	getListStyle() {
		return {
			listStyleType: this.props.node.data.get('content').bulletStyle
		}
	}

	renderList() {
		if (this.props.node.data.get('content').type === 'unordered') {
			return <ul style={this.getListStyle()}>{this.props.children}</ul>
		} else {
			return <ol style={this.getListStyle()}>{this.props.children}</ol>
		}
	}

	render() {
		return <div>{this.renderList()}</div>
	}
}

export default Level
