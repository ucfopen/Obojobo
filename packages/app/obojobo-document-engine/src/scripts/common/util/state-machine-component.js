// import './state-machine-component.scss'

import React from 'react'

export default class Dialog extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			log: ''
		}

		const originalOnTransition = props.machine.onTransition
		props.machine.onTransition = (prevStep, nextStep) => {
			// debugger
			this.setState({
				log: `${prevStep}->${nextStep}\n${this.state.log}`
			})
			originalOnTransition(prevStep, nextStep)
		}
	}

	getSteps(machine) {
		return Object.keys(machine.transitions)
	}

	getActions(machine) {
		return Object.keys(machine.transitions[machine.step].actions || {}).filter(
			action => action !== 'canTransitionTo'
		)
	}

	doAction(action) {
		this.props.machine.dispatch(action)

		// this.forceUpdate()
	}

	onChange(event) {
		const nextStep = event.target.value.replace('*', '')

		this.props.machine.gotoStep(nextStep, false)

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
							<select value={this.props.machine.step} onChange={this.onChange.bind(this)}>
								{this.getSteps(this.props.machine).map(step => (
									<option key={step}>
										{(this.props.machine.isAValidTransition(this.props.machine.step, step)
											? '*'
											: '') + step}
									</option>
								))}
							</select>
						</label>
						<div>
							<b>Actions:</b>
							<ul>
								{this.getActions(this.props.machine).map(action => (
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
