let questionModelId = null;
let responderModelId = null;

let fakeResponderModel = {
	get: () => {
		return responderModelId
	},
	getRoot: () => {},
	getParentOfType: () => {
		return fakeQuestionModel
	}
}

let fakeQuestionModel = {
	get: () => {
		return questionModelId
	},
	getRoot: () => {}
}

let fakeModelsDict = {}

let mock = {
	__setQuestionModelId: (id) => {
		questionModelId = id
		fakeModelsDict[id] = fakeQuestionModel
	},
	__setResponderModelId: (id) => {
		responderModelId = id
		fakeModelsDict[id] = fakeResponderModel
	},
	models: fakeModelsDict,
	__getResponderInstance: () => {
		return fakeResponderModel
	},
	__getQuestionInstance: () => {
		return fakeQuestionModel
	}
}

console.log('mock be all like', mock.__getResponderInstance)

export default mock