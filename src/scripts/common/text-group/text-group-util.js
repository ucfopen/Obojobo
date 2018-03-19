export default {
	createData(data, template) {
		let clone = Object.assign({}, data)

		for (var key in clone) {
			if (template[key] == null) {
				delete clone[key]
			}
		}

		for (key in template) {
			if (clone[key] == null) {
				if (typeof template[key] === 'object') {
					clone[key] = Object.assign({}, template[key])
				} else {
					clone[key] = template[key]
				}
			}
		}

		return clone
	},

	defaultCloneFn(data) {
		return Object.assign({}, data)
	},

	defaultMergeFn(consumer, digested) {
		return consumer
	}
}
