export default {
	createData(data, template) {
		const clone = Object.assign({}, data)

		for (const key in clone) {
			if (template[key] === null || typeof template[key] === 'undefined') {
				delete clone[key]
			}
		}

		for (const key in template) {
			if (clone[key] === null || typeof clone[key] === 'undefined') {
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

	defaultMergeFn(consumer) {
		return consumer
	}
}
