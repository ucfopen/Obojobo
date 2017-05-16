import ObojoboDraft from 'ObojoboDraft';

let { Dispatcher } = ObojoboDraft.flux;
let { OboModel } = ObojoboDraft.models;

let QuestionUtil = {
	recordResponse(id, response) {
		return Dispatcher.trigger('question:recordResponse', {
			value: {
				id,
				response
			}
		}
		);
	},

	resetResponse(id) {
		return Dispatcher.trigger('question:resetResponse', {
			value: {
				id
			}
		}
		);
	},

	setData(id, key, value) {
		return Dispatcher.trigger('question:setData', {
			value: {
				key: id + ':' + key,
				value
			}
		}
		);
	},

	clearData(id, key) {
		return Dispatcher.trigger('question:clearData', {
			value: {
				key: id + ':' + key
			}
		}
		);
	},

	viewQuestion(id) {
		return Dispatcher.trigger('question:view', {
			value: {
				id
			}
		}
		);
	},

	hideQuestion(id) {
		return Dispatcher.trigger('question:hide', {
			value: {
				id
			}
		}
		);
	},

	getViewState(state, model) {
		let modelId = model.get('id');

		if (state.viewing === modelId) { return 'active'; }
		if (state.viewedQuestions[modelId]) { return 'viewed'; }
		return 'hidden';
	},

	getResponse(state, model) {
		return state.responses[model.get('id')];
	},

	hasResponse(state, model) {
		return typeof state.responses[model.get('id')] !== 'undefined';
	},

	getData(state, model, key) {
		return state.data[model.get('id') + ':' + key];
	}
};


export default QuestionUtil;