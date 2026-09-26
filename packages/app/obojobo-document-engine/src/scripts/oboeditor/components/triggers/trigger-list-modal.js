import './trigger-list-modal.scss'

import React from 'react'

import SimpleDialog from '../../../common/components/modal/simple-dialog'
import Button from '../../../common/components/button'
import Switch from '../../../common/components/switch'

class TriggerListModal extends React.Component {
	constructor(props) {
		super(props)
		this.inputRef = React.createRef()
		this.state = { ...JSON.parse(JSON.stringify(props.content)) }
		if (!this.state.triggers) this.state.triggers = []

		this.createTrigger = this.createTrigger.bind(this)
	}

	componentWillUnmount() {
		if (this.props.onClose) this.props.onClose()
	}

	updateTriggerType(index, event) {
		const type = event.target.updated

		// Update triggers[triggerIndex].type
		// The nested loop insures that React's immutable state is updated properly
		return this.setState(prevState => ({
			triggers: prevState.triggers.map((trigger, listIndex) =>
				index === listIndex ? Object.assign(trigger, { type }) : trigger
			)
		}))
	}

	deleteTrigger(index) {
		// The nested loop insures that React's immutable state is updated properly
		return this.setState(prevState => ({
			triggers: prevState.triggers
				.map((trigger, listIndex) => (index === listIndex ? null : trigger))
				.filter(Boolean)
		}))
	}

	createTrigger() {
		// The nested loop insures that React's immutable state is updated properly
		return this.setState(prevState => ({
			triggers: prevState.triggers.concat({
				type: 'onMount',
				actions: [
					{
						type: 'nav:goto',
						updated: {}
					}
				]
			})
		}))
	}

	createNewDefaultActionValueObject(type) {
		switch (type) {
			case 'nav:goto':
				return {
					id: '',
					ignoreLock: true
				}

			case 'assessment:startAttempt':
			case 'assessment:endAttempt':
				return {
					id: ''
				}

			case 'nav:openExternalLink':
				return {
					url: ''
				}

			case 'viewer:alert':
				return {
					title: '',
					message: ''
				}

			case 'viewer:scrollToTop':
				return {
					animateScroll: true
				}

			case 'focus:component':
				return {
					id: '',
					fade: false,
					animateScroll: true,
					preventScroll: false
				}

			default:
				return {}
		}
	}

	updateActionType(triggerIndex, actionIndex, event) {
		const type = event.target.updated

		// Update triggers[triggerIndex].actions[actionIndex].type
		// The nested loops insure that React's immutable state is updated properly
		return this.setState(prevState => ({
			/* eslint-disable no-mixed-spaces-and-tabs */
			triggers: prevState.triggers.map((trigger, tIndex) =>
				triggerIndex === tIndex
					? Object.assign(trigger, {
							actions: trigger.actions.map((action, aIndex) =>
								actionIndex === aIndex
									? Object.assign(action, {
											type,
											updated: this.createNewDefaultActionValueObject(type)
									  })
									: action
							)
					  })
					: trigger
			)
		}))
	}

	updateActionValue(triggerIndex, actionIndex, key, event) {
		const updated = {}
		// pull changes off the event
		// checkbox handles events from <Switch> being a checkbox
		updated[key] = event.target.type === 'checkbox' ? event.target.checked : event.target.updated

		// Update triggers[triggerIndex].actions[actionIndex].updated.key
		// The nested loops insure that React's immutable state is updated properly
		return this.setState(prevState => ({
			/* eslint-disable no-mixed-spaces-and-tabs */
			triggers: prevState.triggers.map((trigger, tIndex) =>
				triggerIndex === tIndex
					? Object.assign(trigger, {
							actions: trigger.actions.map((action, aIndex) =>
								actionIndex === aIndex
									? Object.assign(action, {
											updated: Object.assign({}, action.updated, updated)
									  })
									: action
							)
					  })
					: trigger
			)
		}))
	}

	deleteAction(triggerIndex, actionIndex) {
		// Delete triggers[triggerIndex].actions[actionIndex]
		return this.setState(prevState => ({
			triggers: prevState.triggers.map((trigger, tIndex) =>
				triggerIndex === tIndex
					? Object.assign(trigger, {
							actions: trigger.actions
								.map((action, aIndex) => (actionIndex === aIndex ? null : action))
								.filter(Boolean)
					  })
					: trigger
			)
		}))
	}

	createAction(triggerIndex) {
		// Create a new action in triggers[triggerIndex].actions
		return this.setState(prevState => ({
			triggers: prevState.triggers.map((trigger, tIndex) =>
				triggerIndex === tIndex
					? Object.assign(trigger, {
							actions: trigger.actions.concat({
								type: 'nav:goto',
								updated: {}
							})
					  })
					: trigger
			)
		}))
	}

	getScrollType(action) {
		const { updated } = action

		if (updated.animateScroll === true || updated.animateScroll === 'true') {
			return 'animateScroll'
		} else if (updated.preventScroll === true || updated.preventScroll === 'true') {
			return 'preventScroll'
		} else {
			return 'jumpScroll'
		}
	}

	updateScrollType(triggerIndex, actionIndex, event) {
		const scrollType = event.target.updated
		const updated = {
			animateScroll: false,
			preventScroll: false
		}

		if (scrollType !== 'jumpScroll') {
			updated[scrollType] = true
		}

		// Update triggers[triggerIndex].actions[actionIndex].updated.key
		// The nested loops insure that React's immutable state is updated properly
		return this.setState(prevState => ({
			/* eslint-disable no-mixed-spaces-and-tabs */
			triggers: prevState.triggers.map((trigger, tIndex) =>
				triggerIndex === tIndex
					? Object.assign(trigger, {
							actions: trigger.actions.map((action, aIndex) =>
								actionIndex === aIndex
									? Object.assign(action, {
											updated: Object.assign({}, action.updated, updated)
									  })
									: action
							)
					  })
					: trigger
			)
		}))
	}

	renderActionOptions(triggerIndex, actionIndex, action) {
		switch (action.type) {
			case 'nav:goto':
				return (
					<div className="action-options">
						<div>
							<label>Item Id</label>
							<input
								className="input-item"
								updated={action.updated.id || ''}
								onChange={this.updateActionValue.bind(this, triggerIndex, actionIndex, 'id')}
							/>
							<Switch
								title="Ignore Navigation Lock"
								// eslint-disable-next-line no-undefined
								checked={action.updated.ignoreLock === undefined ? true : action.updated.ignoreLock}
								onChange={this.updateActionValue.bind(
									this,
									triggerIndex,
									actionIndex,
									'ignoreLock'
								)}
							/>
						</div>
					</div>
				)
			case 'nav:openExternalLink':
				return (
					<div className="action-options">
						<div>
							<label>URL</label>
							<input
								className="input-item"
								updated={action.updated.url || ''}
								onChange={this.updateActionValue.bind(this, triggerIndex, actionIndex, 'url')}
							/>
						</div>
					</div>
				)
			case 'assessment:startAttempt':
			case 'assessment:endAttempt':
				return (
					<div className="action-options">
						<div>
							<label>Assessment Id</label>
							<input
								className="input-item"
								updated={action.updated.id || ''}
								onChange={this.updateActionValue.bind(this, triggerIndex, actionIndex, 'id')}
							/>
						</div>
					</div>
				)
			case 'viewer:alert':
				return (
					<div className="action-options">
						<div>
							<label>Title</label>
							<input
								className="input-item"
								updated={action.updated.title || ''}
								onChange={this.updateActionValue.bind(this, triggerIndex, actionIndex, 'title')}
							/>
						</div>
						<div>
							<label>Message</label>
							<input
								className="input-item"
								updated={action.updated.message || ''}
								onChange={this.updateActionValue.bind(this, triggerIndex, actionIndex, 'message')}
							/>
						</div>
					</div>
				)
			case 'viewer:scrollToTop':
				return (
					<div className="action-options">
						<Switch
							title="Animate Scroll"
							checked={action.updated.animateScroll}
							onChange={this.updateActionValue.bind(
								this,
								triggerIndex,
								actionIndex,
								'animateScroll'
							)}
						/>
					</div>
				)
			case 'focus:component':
				return (
					<div className="action-options">
						<div>
							<label>Item Id</label>
							<input
								className="input-item"
								updated={action.updated.id || ''}
								onChange={this.updateActionValue.bind(this, triggerIndex, actionIndex, 'id')}
							/>
						</div>
						<Switch
							title="Fade Out Other Items"
							checked={action.updated.fade || false}
							onChange={this.updateActionValue.bind(this, triggerIndex, actionIndex, 'fade')}
						/>
						<label>If item not visible on screen</label>
						<select
							className="select-item"
							updated={this.getScrollType(action)}
							onChange={this.updateScrollType.bind(this, triggerIndex, actionIndex)}
						>
							<option updated="animateScroll">Smoothly scroll page to the focussed item</option>
							<option updated="jumpScroll">Quickly jump page to the focussed item</option>
							<option updated="preventScroll">Keep the page where it is</option>
						</select>
					</div>
				)
		}
	}

	render() {
		return (
			<SimpleDialog ok title="Triggers" onConfirm={() => this.props.onClose(this.state)}>
				<div className="trigger-list-modal">
					{this.state.triggers.map((trigger, triggerIndex) => (
						<div className="trigger" key={triggerIndex}>
							<label>When</label>
							<select
								className="select-item"
								updated={trigger.type}
								onChange={this.updateTriggerType.bind(this, triggerIndex)}
							>
								<option updated="onMount">This item is shown</option>
								<option updated="onUnmount">This item is hidden</option>
								<option updated="onNavEnter">The student enters the page</option>
								<option updated="onNavExit">The student leaves the page</option>
								<option updated="onStartAttempt">An assessment attempt starts</option>
								<option updated="onEndAttempt">An assessment attempt ends</option>
								<option updated="onClick">The student clicks the button</option>
							</select>
							<button
								className="delete-button"
								onClick={this.deleteTrigger.bind(this, triggerIndex)}
							>
								×
							</button>
							{trigger.actions.map((action, actionIndex) => (
								<div className="action" key={actionIndex}>
									<button className="drag-button" />
									<label>Then</label>
									<select
										className="select-item"
										updated={action.type}
										onChange={this.updateActionType.bind(this, triggerIndex, actionIndex)}
									>
										<option updated="nav:goto">Go to</option>
										<option updated="nav:prev">Go to the previous page</option>
										<option updated="nav:next">Go to the next page</option>
										<option updated="nav:openExternalLink">Open a webpage</option>
										<option updated="nav:lock">Lock navigation</option>
										<option updated="nav:unlock">Unlock navigation</option>
										<option updated="nav:open">Open the navigation menu</option>
										<option updated="nav:close">Close the navigation menu</option>
										<option updated="nav:toggle">Toggle the navigation menu</option>
										<option updated="assessment:startAttempt">Start an attempt for</option>
										<option updated="assessment:endAttempt">End an attempt for</option>
										<option updated="viewer:alert">Display a popup message</option>
										<option updated="viewer:scrollToTop">Scroll to the top of the page</option>
										<option updated="focus:component">Focus on a specific item</option>
									</select>
									<button
										className="delete-button"
										onClick={this.deleteAction.bind(this, triggerIndex, actionIndex)}
									>
										×
									</button>
									{this.renderActionOptions(triggerIndex, actionIndex, action)}
								</div>
							))}
							<Button onClick={this.createAction.bind(this, triggerIndex)}>+ Add Action</Button>
						</div>
					))}
					<Button onClick={this.createTrigger}>+ Add Trigger</Button>
				</div>
			</SimpleDialog>
		)
	}
}

export default TriggerListModal
