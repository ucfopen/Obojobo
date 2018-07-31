import React from 'react'

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
	'js',
	'viewer:alert',
]
const requiresValue = {
	'nav:goto': value => {
		const json = JSON.parse(value)
		return json.id !== null && json.id !== undefined
	},
	'nav:openExternalLink': value => {
		const json = JSON.parse(value)
		return json.url !== null && json.url !== undefined
	},
	'assessment:startAttempt': value => {
		const json = JSON.parse(value)
		return json.id !== null && json.id !== undefined
	},
	'assessment:endAttempt': value => {
		const json = JSON.parse(value)
		return json.id !== null && json.id !== undefined
	},
	'js': value => {
		return typeof value === String
	},
	'viewer:alert': value => {
		const json = JSON.parse(value)
		return json.title !== null
			&& json.title !== undefined
			&& json.message !== null
			&& json.message !== undefined
	}
}

class Trigger extends React.Component {
	deleteTrigger() {
		const itemIndex = this.props.parent.findIndex(
			action => action.type === this.props.type
		)

		this.props.parent.splice(itemIndex, 1)
		this.props.update()
	}

	render() {
		return (
			<div className={'trigger'} key={this.props.type}>
				<div>
					<p>{this.props.type}</p>
				</div>
				<div>
					<p>{this.props.value}</p>
				</div>
				<button onClick={() => this.deleteTrigger()}>x</button>
			</div>
		)
	}
}

class Node extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.node.data.get('content')
		this.state.newTrigger = { type: allowedActions[0], value: '' }
		this.state.isValid = 'valid'
	}

	handleActionChange(event) {
		this.setState({ newTrigger: {
			type: event.target.value,
			value: this.state.newTrigger.value,
		}})
	}

	handleValueChange(event) {
		this.setState({ newTrigger: {
			type: this.state.newTrigger.type,
			value: event.target.value,
		}})
	}

	handleLabelChange(event){
		const editor = this.props.editor
		const change = editor.value.change()

		this.setState({ label: event.target.value })

		change.setNodeByKey(this.props.node.key, { data: { content: {
			label: event.target.value,
			newTrigger: this.state.newTrigger,
			actions: this.state.actions
		}}})
		editor.onChange(change)
	}

	addAction() {
		const verify = requiresValue[this.state.newTrigger.type]
		if (verify && !verify(this.state.newTrigger.value)){
			this.state.isValid = 'invalid'
			this.forceUpdate()
			return
		}

		this.state.isValid = 'valid'
		this.state.actions.push(this.state.newTrigger)

		this.state.newTrigger = { type: allowedActions[0], value: '' }

		this.forceUpdate()
	}

	renderNew() {
		return(
			<div className={`trigger new-trigger is-type-${this.state.isValid}`}>
				<div className={'trigger-name'}>
					<p>Action</p>
					<select
						name={'Action'}
						value={this.state.newTrigger.type}
						onChange={event => this.handleActionChange(event)}
						onClick={event => event.stopPropagation()}>
						{allowedActions.map(action => {
							return (
								<option value={action} key={action}>{action}</option>
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
						onClick={event => event.stopPropagation()}/>
				</div>
				<button onClick={() => this.addAction()}>Save</button>
			</div>
		)
	}

	renderTriggers() {
		return (
			<div className={'trigger-box'}>
				{this.props.node.data.get('content').actions.map(action => {
					return (
						<Trigger
							type={action.type}
							value={action.value}
							key={action.type}
							parent={this.state.actions}
							update={() => this.forceUpdate()}
						/>
					)
				})}
				{this.renderNew()}
			</div>
		)
	}

	renderButton() {
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

		const iframeStyle = {
			display: 'block',
		}

		return (
			<div
				style={wrapperStyle}
				className={'obojobo-draft--components--button'}>
				<div style={maskStyle} />
				<div className={'button'}>
					<input
						name={'Button Name'}
						value={this.state.label}
						onChange={event => this.handleLabelChange(event)}
						onClick={event => event.stopPropagation()}
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
			<div className={'component'}>
				<div
					className={'text-chunk obojobo-draft--chunks--action-button pad'}
				{...this.props.attributes} >
					{this.renderButton()}
					{isSelected ? this.renderTriggers() : null}
				</div>
			</div>
		)
	}
}

const insertNode = change => {
	change
		.insertBlock({ type: BUTTON_NODE, data: {
			content: { actions: [], label: '' }
		}, isVoid: true  })
		.collapseToStartOfNextText()
		.focus()
}

const slateToObo = node => {
	const json = {}
	json.id = node.key
	json.type = node.type
	json.content = {}
	const nodeContent = node.data.get('content')
	json.content.label = nodeContent.label
	json.content.triggers = [{
		type: 'onClick',
		actions: nodeContent.actions.map(action => {
			return {
				type: action.type,
				value: action.value !== '' ? JSON.parse(action.value) : {}
			}
		})
	}]

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
	if(!json.data.content.label){
		node.content.textGroup.forEach(line => {
			json.data.content.label =  line.text.value
		})
	}

	json.data.content.actions = []
	if(node.content.triggers) {
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
				return <Node {...props} />
		}
	},
	schema: {
		blocks: {
			'ObojoboDraft.Chunks.ActionButton': {
				isVoid: true,
			}
		}
	}
}

const ActionButton = {
	components: {
		Node,
		Trigger
	},
	helpers: {
		insertNode,
		slateToObo,
		oboToSlate
	},
	plugins
}

export default ActionButton
