import './editor-component.scss'

import React from 'react'
import debounce from 'obojobo-document-engine/src/scripts/common/util/debounce'

const stopPropagation = event => event.stopPropagation()

class Settings extends React.Component {
	constructor(props) {
		super(props)

		const content = this.props.node.data.get('content')

		this.state = {
			choose: content.choose,
			chooseAll: content.chooseAll,
			select: content.select
		}

		this.changeChooseType = this.changeChooseType.bind(this)
		this.validateAndUpdateChooseAmount = this.validateAndUpdateChooseAmount.bind(this)
		this.changeChooseAmount = this.changeChooseAmount.bind(this)
		this.changeSelect = this.changeSelect.bind(this)
		this.updateNodeFromState = debounce(200, this.updateNodeFromState)
	}

	updateNodeFromState() {
		const content = this.props.node.data.get('content')
		this.props.editor.setNodeByKey(this.props.node.key, {
			data: { content: { ...content, ...this.state } }
		})
	}

	changeChooseType(event) {
		event.stopPropagation()

		const chooseAll = event.target.value === 'all'
		const choose = chooseAll ? '1' : this.props.node.data.get('content').choose

		this.setState({
			choose,
			chooseAll
		})
	}

	changeChooseAmount(event) {
		event.stopPropagation()
		this.setState({ choose: event.target.value })
	}

	validateAndUpdateChooseAmount(event) {
		event.stopPropagation()

		// Ensure that any typed in choose value is a valid number >= 1
		const choose = this.props.node.data.get('content').choose
		let updatedChooseNumber = Math.max(1, parseInt(choose, 10))
		if (!Number.isFinite(updatedChooseNumber)) updatedChooseNumber = 1

		this.setState({
			choose: '' + updatedChooseNumber
		})
	}

	componentDidUpdate() {
		// copy the state changes into the slate model
		this.updateNodeFromState()
	}

	changeSelect(event) {
		event.stopPropagation()
		this.setState({
			select: event.target.value
		})
	}

	render() {
		const radioGroupName = `${this.props.node.key}-choose`

		return (
			<div className={'qb-settings'}>
				<fieldset className="choose">
					<legend>How many questions should be displayed?</legend>
					<label>
						<input
							type="radio"
							name={radioGroupName}
							value="all"
							checked={this.state.chooseAll}
							onChange={this.changeChooseType}
						/>
						All questions
					</label>
					<span> or</span>
					<label>
						<input
							type="radio"
							name={radioGroupName}
							value="pick"
							checked={!this.state.chooseAll}
							onChange={this.changeChooseType}
						/>
						Pick
					</label>
					<input
						type="number"
						value={this.state.choose}
						onClick={stopPropagation}
						onBlur={this.validateAndUpdateChooseAmount}
						onChange={this.changeChooseAmount}
						disabled={this.state.chooseAll}
						min="1"
					/>
				</fieldset>
				<label className="select">
					How should questions be selected?
					<select value={this.state.select} onChange={this.changeSelect} onClick={stopPropagation}>
						<option value="sequential">In order</option>
						<option value="random">Randomly</option>
						<option value="random-unseen">Randomly, with no repeats</option>
					</select>
				</label>
			</div>
		)
	}
}

export default Settings
