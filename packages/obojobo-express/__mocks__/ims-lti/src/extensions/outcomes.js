let send_replace_resultCallback

const __resetCallbackForSend_replace_result = () => {
	send_replace_resultCallback = jest.fn().mockImplementationOnce((score, callback) => {
		callback(null, true)
	})
}

const __registerCallbackForSend_replace_result = callback => {
	send_replace_resultCallback = callback
}

class OutcomeService {
	constructor() {
		this.send_replace_result = send_replace_resultCallback
	}
}

__resetCallbackForSend_replace_result()

module.exports = {
	OutcomeService: OutcomeService,
	__registerCallbackForSend_replace_result: __registerCallbackForSend_replace_result,
	__resetCallbackForSend_replace_result: __resetCallbackForSend_replace_result
}
