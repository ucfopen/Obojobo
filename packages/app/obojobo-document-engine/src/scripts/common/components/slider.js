import React from 'react'

import './slider.scss'

class Slider extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			checked: this.props.initialChecked || false
		}
		this.handleCheckChange = this.handleCheckChange.bind(this)
	}

	handleCheckChange(event) {
		const checked = event.target.checked
		this.props.handleCheckChange(checked)
		this.setState({ checked })
	}

	render() {
		return (
			<div className={'obojobo-draft--components--slider'}>
				<span contentEditable={false}>{this.props.title + ': '}</span>
				<label className={'switch'}>
					<input
						className={'slider'}
						type={'checkbox'}
						checked={this.state.checked}
						onChange={this.handleCheckChange}
					/>
					<div className="slider round" />
				</label>
			</div>
		)
	}
}

export default Slider
