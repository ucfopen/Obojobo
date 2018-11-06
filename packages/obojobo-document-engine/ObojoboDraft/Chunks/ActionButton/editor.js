import React from 'react'
import { Block } from 'slate'

import emptyNode from './empty-node.json'
import Icon from './icon'

const BUTTON_NODE = 'ObojoboDraft.Chunks.ActionButton'

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
	js: value => {
		return typeof value === typeof ''
	},
	'viewer:alert': value => {
		const json = JSON.parse(value)
		return !!json.title && !!json.message
	}
}

const Trigger = props => {
	return (
		<div className={'trigger'} key={props.type}>
			<div>
				<p>{props.type}</p>
			</div>
			<div>
				<p>{props.value}</p>
			</div>
			<button className={'delete-node'} onClick={props.update}>
				x
			</button>
		</div>
	)
}

class Node extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			newTrigger: { type: allowedActions[0], value: '' },
			isValid: 'valid'
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
			this.setState({ isValid: 'invalid' })
			return
		}

		content.actions.push(this.state.newTrigger)

		this.setState({
			isValid: 'valid',
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
			<div className={`trigger new-trigger is-type-${this.state.isValid}`}>
				<div className={'trigger-name'}>
					<p>Action</p>
					<select
						name={'Action'}
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
				<div className={'trigger-value'}>
					<p>Value:</p>
					<textarea
						name={'Value'}
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
			<div className={'trigger-box'}>
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
			<div style={wrapperStyle} className={'obojobo-draft--components--button'}>
				<div style={maskStyle} />
				<div className={'button'}>
					<input
						name={'Button Name'}
						value={content.label}
						onChange={event => this.handleLabelChange(event)}
						onClick={event => event.stopPropagation()}
						placeholder={'Button Label'}
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
			<div className={'text-chunk obojobo-draft--chunks--action-button pad'}>
				{this.renderButton()}
				{isSelected ? this.renderTriggers() : null}
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock(Block.fromJSON(emptyNode))
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}
	const nodeContent = node.data.get('content')
	json.content.label = nodeContent.label || ''
	json.content.triggers = [
		{
			type: 'onClick',
			actions: nodeContent.actions.map(action => {
				return {
					type: action.type,
					value: action.value !== '' ? JSON.parse(action.value) : {}
				}
			})
		}
	]

	json.children = []
	return json
}

const oboToSlate = node => {
	const json = {}
	json.object = 'block'
	json.key = node.id
	json.type = node.type

	json.data = { content: {} }
	json.data.content.label = node.content.label
	if (!json.data.content.label && node.content.textGroup) {
		node.content.textGroup.forEach(line => {
			json.data.content.label = line.text.value
		})
	}

	json.data.content.actions = []
	if (node.content.triggers) {
		json.data.content.actions = node.content.triggers[0].actions.map(action => {
			return {
				type: action.type,
				value: action.value ? JSON.stringify(action.value) : ''
			}
		})
	}

	return json
}

const plugins = {
	renderNode(props) {
		switch (props.node.type) {
			case BUTTON_NODE:
				return <Node {...props} {...props.attributes} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.ActionButton': {
				isVoid: true
			}
		}
	}
}

const ActionButton = {
	name: BUTTON_NODE,
	components: {
		Node,
		Trigger,
		Icon
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate,
		requiresValue
	},
	json: {
		emptyNode
	},
	plugins
}

export default ActionButton
