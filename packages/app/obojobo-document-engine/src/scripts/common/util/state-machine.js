class StateMachine {
	constructor({ initialStep, transitions, onTransition = () => {} }) {
		// this.state = {}
		this.curStateName = ''
		// this.states = transitions
		this.onTransition = onTransition

		// We create new transition objects but define their prototypes to be this class.
		// That means `this` will refer to this constructor (or the constructor of the superclass).
		// When the various actions are called we set the 'this' value to be the transition object.
		// That means we define a prototype for a transition object like this:
		//	<The Transition Object> --> StateMachine
		// Therefore, inside a transition object `this` can be used to reference methods defined
		// on the object as well as any methods on StateMachine (or the superclass)
		this.states = {}
		Object.keys(transitions).forEach(name => {
			const o = Object.create(this)
			this.states[name] = Object.assign(o, transitions[name])
		})
		// this.states = transitions

		// this.self = this

		this.transitionTo(initialStep, false)
	}

	// get currentTransition() {
	// 	return this.states[this.curStateName] || {}
	// }

	getCurrentState() {
		return this.states[this.curStateName] || {}
	}

	isAValidTransition(from, to) {
		const transition = this.states[from]

		if (!transition) {
			return false
		}

		return transition.canTransitionTo.indexOf(to) > -1
	}

	transitionTo(nextStateName, enforceValidTransition = true) {
		console.log(
			'transitionTo',
			nextStateName,
			enforceValidTransition,
			this.curStateName,
			this === window.__asm
		)

		if (enforceValidTransition && !this.isAValidTransition(this.curStateName, nextStateName)) {
			throw Error(`No transition defined from "${this.curStateName}" to "${nextStateName}"`)
		}

		const oldStateName = this.curStateName
		const oldState = this.getCurrentState()

		if (oldState.onExit) {
			oldState.onExit.call(this, oldState)
			// oldState.onExit(oldState)
		}

		const nextState = this.states[nextStateName]

		if (nextState) {
			this.curStateName = nextStateName

			console.log('onTransition', oldStateName, '->', nextStateName, this.curStateName)
			this.onTransition(oldStateName, nextStateName)

			if (nextState.onEnter) {
				// nextState.onEnter.call(nextState)
				nextState.onEnter.call(this, nextState)
				// nextState.onEnter(nextState)
			}
		}
	}

	dispatch(action, payload) {
		const target = this.getCurrentState()

		if (target.actions[action]) {
			target.actions[action].call(this, payload)
			// target.actions[action](payload)
		}
	}
}

export default StateMachine
