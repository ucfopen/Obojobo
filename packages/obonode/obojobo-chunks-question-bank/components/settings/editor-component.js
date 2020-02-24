import './editor-component.scss'

import React from 'react'

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
	}

	setNodeContent() {
		const content = this.props.node.data.get('content')
		if (
			content.choose === this.state.choose &&
			content.chooseAll === this.state.chooseAll &&
			content.select === this.state.select
		) {
			return
		}

		// update the node ONLY if it's changed
		this.props.editor.setNodeByKey(this.props.node.key, {
			data: { content: { ...content, ...this.state } }
		})
	}

	setStateAndUpdateNode(state) {
		this.setState(state, this.setNodeContent)
	}

	changeChooseType(event) {
		event.stopPropagation()

		const chooseAll = event.target.value === 'all'
		const choose = chooseAll ? '1' : this.props.node.data.get('content').choose

		if (chooseAll === this.state.chooseAll && choose === this.state.choose) return
		this.setStateAndUpdateNode({
			choose,
			chooseAll
		})
	}

	changeChooseAmount(event) {
		event.stopPropagation()
		if (event.target.value === this.state.choose) return
		this.setStateAndUpdateNode({ choose: event.target.value })
	}

	validateAndUpdateChooseAmount(event) {
		event.stopPropagation()

		// Ensure that any typed in choose value is a valid number >= 1
		const choose = this.props.node.data.get('content').choose
		let updatedChooseNumber = Math.max(1, parseInt(choose, 10))
		if (!Number.isFinite(updatedChooseNumber)) updatedChooseNumber = 1
		updatedChooseNumber = '' + updatedChooseNumber

		if (updatedChooseNumber === this.state.choose) return
		this.setStateAndUpdateNode({ choose: updatedChooseNumber })
	}

	changeSelect(event) {
		event.stopPropagation()
		if (event.target.value === this.state.select) return
		this.setStateAndUpdateNode({ select: event.target.value })
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
