jest.mock('../src/scripts/common/store', () => {
	let registeredModels = new Map()

	return ({
		Store: {
			registerModel: (name, model) => {
				registeredModels.set(name, model)
			},
			getDefaultItemForModelType: jest.fn(),
			getItemForType: (type) => {
				let registered = registeredModels.get(type)
				if(registered) return registered
				return null
			},
			getRegisteredModels: () => registeredModels
		}
	})
})

import { Store } from '../src/scripts/common/store'

let OboModel = require.requireActual('../src/scripts/common/models/obo-model').default

let registerObject = (o) => {
	Store.registerModel(o.type, { adapter:{} })

	if(o.children)
	{
		for(let child of o.children)
		{
			registerObject(child)
		}
	}
}

var localId = null;

// Does OboModel.create but registers mocked models in the mocked Store
OboModel.__create = (o) => {
	registerObject(o)
	return OboModel.create(o)
}
OboModel.__setNextGeneratedLocalId = (n) => {
	localId = n;
}
OboModel.__registerModel = (name, model) => {
	Store.registerModel(name, model)
}

var originalCreateNewLocalId = OboModel.prototype.createNewLocalId
OboModel.prototype.createNewLocalId = () => {
	if(localId !== null) {
		let id = localId;
		localId = null;

		return id;
	}

	return originalCreateNewLocalId();
}


export default OboModel