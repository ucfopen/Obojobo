let makeRequest = function(method, url, data, callback) {
	if (data == null) { data = null; }
	if (callback == null) { callback = function() {}; }
	let request = new XMLHttpRequest();

	request.addEventListener('load', callback); //(event) ->
		// callback Module.createFromDescriptor({ id:moduleId, chunks:JSON.parse(request.responseText) })

	request.open(method, url, true);

	if (data != null) {
		let a = [];
		for (let k in data) {
			let v = data[k];
			a.push(`${k}=${v}`);
		}
		data = a.join("&");

		return request.send(data);
	} else {
		return request.send();
	}
};

class APIModule {
	constructor() {}

	get(moduleId, callback) {
		return makeRequest('GET', `/api/draft/${moduleId}/chunks`, null, (event => {
			return callback({ id:moduleId, chunks:JSON.parse(event.target.responseText) });
		})
		);
	}
}


class APIChunk {
	constructor() {}

	move(chunkMoved, chunkBefore, callback) {
		console.log(arguments);
		let beforeId = (chunkBefore != null) ? chunkBefore.get('id') : null;
		return makeRequest('POST', `/api/chunk/${chunkMoved.get('id')}/move_before`, { before_chunk_id:beforeId }, callback);
	}
}


class API {
	constructor() {}
}

Object.defineProperties(API.prototype, {
	"module": {
		get() {
			return new APIModule;
		}
	},

	"chunk": {
		get() {
			return new APIChunk;
		}
	}
}
);


export default new API;