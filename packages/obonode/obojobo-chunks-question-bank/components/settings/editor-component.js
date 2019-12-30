import './editor-component.scss'

import React from 'react'

class Settings extends React.Component {
	changeChooseType(event) {
		event.stopPropagation()
		const chooseAll = event.target.value === 'all'

		return this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...this.props.node.data.get('content'),
					chooseAll
				}
			}
		})
	}

	changeChooseAmount(event) {
		event.stopPropagation()
		return this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...this.props.node.data.get('content'),
					choose: event.target.value
				}
			}
		})
	}

	changeSelect(event) {
		event.stopPropagation()
		return this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...this.props.node.data.get('content'),
					select: event.target.value
				}
			}
		})
	}

	render() {
		const content = this.props.node.data.get('content')
		const radioGroup = `${this.props.node.key}-choose`
		return (
			<div className={'qb-settings'}>
				<fieldset className="choose">
					<legend>How many questions should be displayed?</legend>
					<label>
						<input
							type="radio"
							name={radioGroup}
							value="all"
							checked={content.chooseAll}
							onChange={this.changeChooseType.bind(this)}
						/>
						All questions
					</label>
					<span> or</span>
					<label>
						<input
							type="radio"
							name={radioGroup}
							value="pick"
							checked={!content.chooseAll}
							onChange={this.changeChooseType.bind(this)}
						/>
						Pick
					</label>
					<input
						type="number"
						value={content.choose}
						disabled={content.chooseAll}
						onChange={this.changeChooseAmount.bind(this)}
						onClick={event => event.stopPropagation()}
					/>
				</fieldset>
				<label className="select">
					How should questions be selected?
					<select
						value={content.select}
						onChange={this.changeSelect.bind(this)}
						onClick={event => event.stopPropagation()}
					>
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
