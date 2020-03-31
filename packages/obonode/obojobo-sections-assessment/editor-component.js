import './editor-component.scss'

import React from 'react'

class Assessment extends React.Component {
	render() {
		return <div className={'obojobo-draft--sections--assessment'}>{this.props.children}</div>
	}
}

export default Assessment
