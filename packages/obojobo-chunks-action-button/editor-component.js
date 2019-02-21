import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import Common from 'Common'

const isOrNot = Common.util.isOrNot

// TODO could probably be registered by Obojobo Nodes
const allowedActions = [
	'nav:goto',
	'nav:prev',
	'nav:next',
	'nav:openExternalLink',
	'nav:lock',
	'nav:unlock',
	'nav:open',
	'nav:close',
	'nav:toggle',
	'assessment:startAttempt',
	'assessment:endAttempt',
	'viewer:alert'
]
const requiresValue = {
	'nav:goto': value => {
		const json = JSON.parse(value)
		return json.id
	},
	'nav:openExternalLink': value => {
		const json = JSON.parse(value)
		return json.url
	},
	'assessment:startAttempt': value => {
		const json = JSON.parse(value)
		return json.id
	},
	'assessment:endAttempt': value => {
		const json = JSON.parse(value)
		return json.id
	},
	'viewer:alert': value => {
		const json = JSON.parse(value)
		return !!json.title && !!json.message
	}
}

const Trigger = props => {
	return (
		<div className="trigger" key={props.type}>
			<div>
				<p>{props.type}</p>
			</div>
			<div>
				<p>{props.value}</p>
			</div>
			<button className="editor--page-editor--delete-node-button" onClick={props.update}>
				x
			</button>
		</div>
	)
}

class ActionButton extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			newTrigger: { type: allowedActions[0], value: '' },
			isValid: true
		}
	}

	handleActionChange(event) {
		const type = event.target.value

		return this.setState(state => {
			const newTrigger = state.newTrigger
			newTrigger.type = type
			return { newTrigger }
		})
	}

	handleValueChange(event) {
		const value = event.target.value

		this.setState(state => {
			const newTrigger = state.newTrigger
			newTrigger.value = value
			return { newTrigger }
		})
	}

	handleLabelChange(event) {
		const editor = this.props.editor
		const change = editor.value.change()
		const content = this.props.node.data.get('content')

		change.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					label: event.target.value,
					actions: content.actions
				}
			}
		})
		editor.onChange(change)
	}

	addAction() {
		const editor = this.props.editor
		const change = editor.value.change()
		const verify = requiresValue[this.state.newTrigger.type]
		const content = this.props.node.data.get('content')

		if (verify && !verify(this.state.newTrigger.value)) {
			this.setState({ isValid: false })
			return
		}

		content.actions.push(this.state.newTrigger)

		this.setState({
			isValid: true,
			newTrigger: {
				type: allowedActions[0],
				value: ''
			}
		})

		change.setNodeByKey(this.props.node.key, {
			data: { content }
		})

		editor.onChange(change)
	}

	removeAction(index) {
		const editor = this.props.editor
		const change = editor.value.change()
		const content = this.props.node.data.get('content')

		content.actions.splice(index, 1)

		change.setNodeByKey(this.props.node.key, {
			data: { content }
		})
		editor.onChange(change)
	}

	renderNew() {
		return (
			<div className={`trigger new-trigger` + isOrNot(this.state.isValid, 'valid')}>
				<div className="trigger-name">
					<p>Action</p>
					<select
						name="Action"
						value={this.state.newTrigger.type}
						onChange={event => this.handleActionChange(event)}
						onClick={event => event.stopPropagation()}
					>
						{allowedActions.map(action => {
							return (
								<option value={action} key={action}>
									{action}
								</option>
							)
						})}
					</select>
				</div>
				<div className="trigger-value">
					<p>Value:</p>
					<textarea
						name="Value"
						value={this.state.newTrigger.value}
						onChange={event => this.handleValueChange(event)}
						onClick={event => event.stopPropagation()}
					/>
				</div>
				<button onClick={() => this.addAction()}>Save</button>
			</div>
		)
	}

	renderTriggers() {
		const content = this.props.node.data.get('content')
		return (
			<div className="trigger-box">
				{content.actions.map((action, index) => {
					return (
						<Trigger
							type={action.type}
							value={action.value}
							key={action.type}
							parent={content.actions}
							update={() => this.removeAction(index)}
						/>
					)
				})}
				{this.renderNew()}
			</div>
		)
	}

	renderButton() {
		const { isFocused } = this.props
		const content = this.props.node.data.get('content')

		const wrapperStyle = {
			position: 'relative'
		}

		const maskStyle = {
			display: isFocused ? 'none' : 'block',
			position: 'absolute',
			top: '0',
			left: '0',
			height: '100%',
			width: '100%',
			cursor: 'cell',
			zIndex: 1
		}

		const iframeStyle = {
			display: 'block'
		}

		return (
			<div style={wrapperStyle} className="obojobo-draft--components--button">
				<div style={maskStyle} />
				<div className={'button'}>
					<input
						name="Button Name"
						value={content.label}
						onChange={event => this.handleLabelChange(event)}
						onClick={event => event.stopPropagation()}
						placeholder="Button Label"
						frameBorder="0"
						style={iframeStyle}
					/>
				</div>
			</div>
		)
	}

	render() {
		const { isSelected } = this.props

		return (
			<div className="text-chunk obojobo-draft--chunks--action-button pad">
				{this.renderButton()}
				{isSelected ? this.renderTriggers() : null}
			</div>
		)
	}
}

export default ActionButton
