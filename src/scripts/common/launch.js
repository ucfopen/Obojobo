import parseURL from 'url-parse'

class Launch {
	init(ltiReqVars) {
		for (let varName in ltiReqVars) {
			this[varName] = ltiReqVars[varName]
			Object.freeze(this[varName])
		}

		Object.freeze(this)
	}

	getOutcomeServiceHostname() {
		let hostname = parseURL(this.lis_outcome_service_url || '', {}).hostname

		if (hostname === '' || !hostname) return 'the external system'
		return hostname
	}
}

export default new Launch()
