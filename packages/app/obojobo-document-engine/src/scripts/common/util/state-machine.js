class StateMachine {
	constructor({ initialStep, transitions, onTransition = () => {} }) {
		this.state = {}
		this.step = ''
		// this.transitions = transitions
		this.onTransition = onTransition

		// We create new transition objects but define their prototypes to be this class.
		// That means `this` will refer to this constructor (or the constructor of the superclass).
		// When the various actions are called we set the 'this' value to be the transition object.
		// That means we define a prototype for a transition object like this:
		//	<The Transition Object> --> StateMachine
		// Therefore, inside a transition object `this` can be used to reference methods defined
		// on the object as well as any methods on StateMachine (or the superclass)
		this.transitions = {}
		Object.keys(transitions).forEach(name => {
			console.log('we got', name, transitions[name])
			const o = Object.create(this)
			this.transitions[name] = Object.assign(o, transitions[name])
		})

		this.transitionTo(initialStep, false)
	}

	get currentTransition() {
		return this.transitions[this.step] || {}
	}

	getCurrentTransition() {
		return this.transitions[this.step] || {}
	}

	isAValidTransition(fromStep, toStep) {
		const transition = this.transitions[fromStep]

		if (!transition) {
			return false
		}

		return transition.canTransitionTo.indexOf(toStep) > -1
	}

	transitionTo(nextStep, enforceValidTransition = true) {
		console.log('transitionTo', nextStep, enforceValidTransition)

		if (enforceValidTransition && !this.isAValidTransition(this.step, nextStep)) {
			throw Error(`No transition defined from "${this.step}" to "${nextStep}"`)
		}

		const oldStep = this.step
		const oldTarget = this.getCurrentTransition()

		if (oldTarget.onExit) {
			oldTarget.onExit.call(oldTarget)
		}

		const target = this.transitions[nextStep]

		if (target) {
			this.step = nextStep

			this.onTransition(oldStep, nextStep)

			if (target.onEnter) {
				target.onEnter.call(target)
			}
		}
	}

	dispatch(action, payload) {
		const target = this.getCurrentTransition()

		if (target.actions[action]) {
			target.actions[action].call(this, payload)
		}
	}
}

export default StateMachine
