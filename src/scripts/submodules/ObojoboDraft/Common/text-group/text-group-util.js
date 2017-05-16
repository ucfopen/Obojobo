import ObjectAssign from 'object-assign';

export default {
	createData(data, template) {
		let clone = ObjectAssign({}, data);

		for (var key in clone) {
			if ((template[key] == null)) {
				delete clone[key];
			}
		}

		for (key in template) {
			if ((clone[key] == null)) {
				if (typeof template[key] === 'object') {
					clone[key] = ObjectAssign({}, template[key]);
				} else {
					clone[key] = template[key];
				}
			}
		}

		return clone;
	},

	defaultCloneFn(data) {
		return ObjectAssign({}, data);
	},

	defaultMergeFn(consumer, digested) {
		return consumer;
	}
};