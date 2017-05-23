class ScoreActions {
	constructor(_actions) {
		if (_actions == null) { _actions = []; }
		this._actions = _actions;
	}

	getActionForScore(score) {
		for (let action of Array.from(this._actions)) {
			if ((score >= action.from) && (score <= action.to)) { return action; }
		}

		return null;
	}

	toObject() {
		return Object.assign([], this._actions);
	}

	clone() {
		return new ScoreActions(this.toObject());
	}
}


export default ScoreActions;