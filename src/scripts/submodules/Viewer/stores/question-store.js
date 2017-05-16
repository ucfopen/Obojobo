import ObojoboDraft from 'ObojoboDraft';

import APIUtil from 'Viewer/util/api-util';

let { Store } = ObojoboDraft.flux;
let { Dispatcher } = ObojoboDraft.flux;
let { OboModel } = ObojoboDraft.models;


class QuestionStore extends Store {
	constructor() {
		let id;
		super('questionStore');

		Dispatcher.on({
			'question:recordResponse': payload => {
				({ id } = payload.value);
				let model = OboModel.models[id];

				this.state.responses[id] = payload.value.response;
				this.triggerChange();

				let questionModel = model.getParentOfType('ObojoboDraft.Chunks.Question');
				return APIUtil.postEvent(questionModel.getRoot(), 'question:recordResponse', {
					questionId: questionModel.get('id'),
					responderId: id,
					response: payload.value.response
				});
			},

			'question:resetResponse': payload => {
				delete this.state.responses[payload.value.id];
				return this.triggerChange();
			},

			'question:setData': payload => {
				this.state.data[payload.value.key] = payload.value.value;
				return this.triggerChange();
			},

			'question:clearData': payload => {
				delete this.state.data[payload.value.key];
				return this.triggerChange();
			},

			'question:hide': payload => {
				APIUtil.postEvent(OboModel.models[payload.value.id].getRoot(), 'question:hide', {
					questionId: payload.value.id
				});

				delete this.state.viewedQuestions[payload.value.id];

				if (this.state.viewing === payload.value.id) {
					this.state.viewing = null;
				}

				return this.triggerChange();
			},

			'question:view': payload => {
				APIUtil.postEvent(OboModel.models[payload.value.id].getRoot(), 'question:view', {
					questionId: payload.value.id
				});

				this.state.viewedQuestions[payload.value.id] = true;
				this.state.viewing = payload.value.id;

				return this.triggerChange();
			}
		});
	}

	init() {
		return this.state = {
			viewing: null,
			viewedQuestions: {},
			responses: {},
			data: {}
		};
	}

	getState() { return this.state; }

	setState(newState) { return this.state = newState; }
}

let questionStore = new QuestionStore();
export default questionStore;
