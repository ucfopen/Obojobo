// import './state-machine-component.scss'

import React from 'react'

export default class Dialog extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			log: ''
		}

		// const originalOnTransition = props.machine.onTransition
		// props.machine.onTransition = (prevStep, nextStep) => {
		// 	// debugger
		// 	this.setState({
		// 		log: `${prevStep}->${nextStep}\n${this.state.log}`
		// 	})
		// 	originalOnTransition(prevStep, nextStep)
		// }

		console.log('machine', props.machine)
		console.log('service', props.machine.service)

		// setTimeout(() => {
		props.machine.service.onTransition(this.onTransition.bind(this))
		// console.log('OK!')
		// }, 2000)
	}

	onTransition(newState, old) {
		console.log('ON TRANS', arguments)
		this.setState({ log: old.type + '->' + newState.value + '\n' + this.state.log })
	}

	getStates(machine) {
		return Object.keys(machine.states)
	}

	getActions(service) {
		return Object.keys(service.machine.states[service.state.value].on)
		// return Object.keys(machine.transitions[machine.step].actions || {})
	}

	doAction(action) {
		// this.props.machine.dispatch(action)
		// this.forceUpdate()
		this.props.machine.service.send(action)
	}

	onChange(event) {
		const nextStep = event.target.value.replace('*', '')

		this.props.machine.transitionTo(nextStep, false)

		// this.forceUpdate()
	}

	render() {
		return (
			<div
				className="state-machine"
				style={{
					fontFamily: 'monospace',
					position: 'fixed',
					right: 0,
					top: 0,
					background: 'white',
					border: '1px solid red',
					zIndex: 999999
				}}
			>
				{this.props.machine ? (
					<div>
						<label>
							<span>Step:</span>
							<select
								value={this.props.machine.service.state.value}
								onChange={this.onChange.bind(this)}
							>
								{this.getStates(this.props.machine.machine).map(state => (
									<option key={state}>{state}</option>
								))}
							</select>
						</label>

						<div>
							<b>Actions:</b>
							<ul>
								{this.getActions(this.props.machine.service).map(action => (
									<li key={action}>
										<button onClick={this.doAction.bind(this, action)}>
											{action === 'onEnter' ? '(onEnter)' : action}
										</button>
									</li>
								))}
							</ul>
						</div>
						<textarea
							style={{ fontSize: '10px', width: 360, height: 160 }}
							value={this.state.log}
						/>
					</div>
				) : (
					<div>Missing state machine!</div>
				)}
			</div>
		)
	}
}
