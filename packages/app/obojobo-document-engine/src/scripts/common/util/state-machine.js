class StateMachine {
	constructor({ initialStep, transitions, onTransition = () => {} }) {
		this.state = {}
		this.step = ''
		this.transitions = transitions
		this.onTransition = onTransition

		this.gotoStep(initialStep, false)
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

	gotoStep(nextStep, enforceValidTransition = true) {
		console.log('gotoStep', nextStep, enforceValidTransition)

		if (enforceValidTransition && !this.isAValidTransition(this.step, nextStep)) {
			throw Error(`No transition defined from "${this.step}" to "${nextStep}"`)
		}

		const oldState = this.step
		const oldTarget = this.getCurrentTransition()

		if (oldTarget.onExit) {
			oldTarget.onExit.call(this)
		}

		const target = this.transitions[nextStep]

		this.onTransition(oldState, this.step)

		if (target) {
			this.step = nextStep

			if (target.onEnter) {
				target.onEnter.call(this)
			}
		}
	}

	dispatch(action, payload) {
		const target = this.getCurrentTransition()

		if (target[action]) {
			target[action].call(this, payload)
		}
	}
}

export default StateMachine
