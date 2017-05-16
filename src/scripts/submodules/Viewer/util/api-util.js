let createParsedJsonPromise = function(promise) {
	let jsonPromise = new Promise(function(resolve, reject) {
		return promise
			.then(res => res.json())
			.then(json => {
				//@TODO - Only do on dev???
				if (json.status === 'error') { console.error(json.value); }
				return resolve(json);
		}).catch(error => reject(error));
	});

	return jsonPromise;
};


var APIUtil = {
	get(endpoint) {
		return fetch(endpoint, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			} //@TODO - Do I need this?
		});
	},

	post(endpoint, body) {
		if (body == null) { body = {}; }
		return fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(body),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});
	},

	postEvent(lo, eventAction, eventPayload) {
		console.log('POST EVENT', eventPayload);
		return createParsedJsonPromise(APIUtil.post('/api/events', {
			event: {
				action: eventAction,
				draft_id: lo.get('_id'),
				// draft_rev: lo.get('_rev')
				actor_time: new Date().toISOString(),
				payload: eventPayload
			}
		}));
	},

	saveState(lo, state) {
		return APIUtil.postEvent(lo, 'saveState', state);
	},

	fetchDraft(id) {
		return createParsedJsonPromise(fetch(`/api/drafts/${id}`));
	},

	getAttempts(lo) {
		return createParsedJsonPromise(APIUtil.get(`/api/drafts/${lo.get('_id')}/attempts`));
	},

	startAttempt(lo, assessment, questions) {
		return createParsedJsonPromise(APIUtil.post('/api/assessments/attempt/start', {
			draftId: lo.get('_id'),
			assessmentId: assessment.get('id'),
			actor: 4,
			questions: '@TODO'
		})
		);
	},

	endAttempt(attempt) {
		return createParsedJsonPromise(APIUtil.post(`/api/assessments/attempt/${attempt.attemptId}/end`));
	}
};

	// recordQuestionResponse: (attempt, question, response) ->
	// 	console.clear()
	// 	console.log arguments
	// 	createParsedJsonPromise APIUtil.post "/api/assessments/attempt/#{attempt.id}/question/#{question.get('id')}", {
	// 		response: response
	// 	}


export default APIUtil;