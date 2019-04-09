import React from 'react'
import Common from 'Common'

const { SimpleDialog } = Common.components.modal

import './new-action-modal.scss'

// TODO could probably be registered by Obojobo Nodes
const allowedActions = {
	'nav:goto': {
		verify: value => {
			try {
				const json = JSON.parse(value)
				return json.id
			} catch (e) {
				return false
			}
		},
		placeholder: '{"id":"page-id"}',
		errorMessage: 'nav:goto requires a JSON value in the form of {"id":"page-id"}'
	},
	'nav:prev': {
		verify: false
	},
	'nav:next': {
		verify: false
	},
	'nav:openExternalLink': {
		verify: value => {
			try {
				const json = JSON.parse(value)
				return json.url
			} catch (e) {
				return false
			}
		},
		placeholder: '{"url":"web-address"}',
		errorMessage: 'nav:openExternalLink requires a JSON value in the form of {"url":"web-address"}'
	},
	'nav:lock': {
		verify: false
	},
	'nav:unlock': {
		verify: false
	},
	'nav:open': {
		verify: false
	},
	'nav:close': {
		verify: false
	},
	'nav:toggle': {
		verify: false
	},
	'assessment:startAttempt': {
		verify: value => {
			try {
				const json = JSON.parse(value)
				return json.id
			} catch (e) {
				return false
			}
		},
		placeholder: '{"id":"assessment-id"}',
		errorMessage:
			'assessment:startAttempt requires a JSON value in the form of {"id":"assessment-id"}'
	},
	'assessment:endAttempt': {
		verify: value => {
			try {
				const json = JSON.parse(value)
				return json.id
			} catch (e) {
				return false
			}
		},
		placeholder: '{"id":"assessment-id"}',
		errorMessage:
			'assessment:endAttempt requires a JSON value in the form of {"id":"assessment-id"}'
	},
	'viewer:alert': {
		verify: value => {
			try {
				const json = JSON.parse(value)
				return !!json.title && !!json.message
			} catch (e) {
				return false
			}
		},
		placeholder: '{"title":"Title Text", "message":"Message Text"}',
		errorMessage:
			'viewer:alert requires a JSON value in the form of {"title":"Dialog title", "message":"Dialog message"}'
	}
}

class AddActionModal extends React.Component {
	constructor(props) {
		super(props)

		const actionTypeArray = Object.keys(allowedActions)

		this.state = {
			type: actionTypeArray[0],
			value: '',
			errorMessage: ''
		}
	}

	handleTypeChange(event) {
		const type = event.target.value

		return this.setState({ type, errorMessage: '' })
	}

	handleValueChange(event) {
		const value = event.target.value

		return this.setState({ value })
	}

	focusOnFirstElement() {
		return this.refs.input.focus()
	}

	onConfirm() {
		const currentAction = allowedActions[this.state.type]

		if (!currentAction.verify) {
			return this.props.onConfirm(this.state)
		}

		if (currentAction.verify(this.state.value)) {
			return this.props.onConfirm(this.state)
		}

		this.setState({ errorMessage: currentAction.errorMessage })
	}

	renderValueEntry(action) {
		return (
			<div className="trigger-value">
				<label htmlFor="obojobo-draft--chunks--action-button--value">Value:</label>
				<textarea
					name="Value"
					id="obojobo-draft--chunks--action-button--value"
					value={this.state.value}
					onChange={this.handleValueChange.bind(this)}
					placeholder={action.placeholder}
				/>
			</div>
		)
	}

	render() {
		const actionArray = Object.entries(allowedActions)

		const currentAction = allowedActions[this.state.type]

		return (
			<SimpleDialog
				cancelOk
				title="New Action"
				onConfirm={this.onConfirm.bind(this)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}
			>
				<div className={`new-action`}>
					<div className="trigger-name">
						<label htmlFor="obojobo-draft--chunks--action-button--action">Action:</label>
						<select
							id="obojobo-draft--chunks--action-button--action"
							name="Action"
							value={this.state.type}
							onChange={this.handleTypeChange.bind(this)}
							ref={'input'}
						>
							{actionArray.map(action => {
								return (
									<option value={action[0]} key={action[0]}>
										{action[0]}
									</option>
								)
							})}
						</select>
					</div>
					{currentAction.verify ? this.renderValueEntry(currentAction) : null}
					<span>{this.state.errorMessage}</span>
				</div>
			</SimpleDialog>
		)
	}
}

export default AddActionModal
