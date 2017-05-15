import ObojoboDraft from 'ObojoboDraft';

import APIUtil from 'Viewer/util/api-util';

let { Store } = ObojoboDraft.flux;
let { Dispatcher } = ObojoboDraft.flux;
let { FocusUtil } = ObojoboDraft.util;
let { OboModel } = ObojoboDraft.models;

class ScoreStore extends Store {
	constructor() {
		let model;
		super('scoreStore');

		Dispatcher.on({
			'score:set': payload => {
				this.state.scores[payload.value.id] = payload.value.score;

				if(payload.value.score === 100) {
					FocusUtil.unfocus();
				}

				this.triggerChange();

				model = OboModel.models[payload.value.id];
				return APIUtil.postEvent(model.getRoot(), 'score:set', {
					id: payload.value.id,
					score: payload.value.score
				});
			},

			'score:clear': payload => {
				delete this.state.scores[payload.value.id];
				this.triggerChange();

				model = OboModel.models[payload.value.id];
				return APIUtil.postEvent(model.getRoot(), 'score:clear', {
					id: payload.value.id
				});
			}
		});
	}

	init() {
		return this.state = {
			scores: {}
		};
	}

	getState() { return this.state; }

	setState(newState) { return this.state = newState; }
}

let scoreStore = new ScoreStore();
export default scoreStore;
