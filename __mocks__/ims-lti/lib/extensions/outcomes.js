let db = jest.fn()
let send_replace_resultCallback

let __resetCallbackForSend_replace_result = () => {
	send_replace_resultCallback = jest.fn().mockImplementationOnce((score, callback) => {
		callback(null, true)
	})
}

let __registerCallbackForSend_replace_result = (callback) => {
	send_replace_resultCallback = callback
}

class OutcomeService {
	constructor(object){
		this.send_replace_result = send_replace_resultCallback
	}

}

__resetCallbackForSend_replace_result()

module.exports = {
	OutcomeService: OutcomeService,
	__registerCallbackForSend_replace_result: __registerCallbackForSend_replace_result,
	__resetCallbackForSend_replace_result: __resetCallbackForSend_replace_result
}
