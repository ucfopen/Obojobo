jest.mock('ObojoboDraft/Common/store', () => {
	return ({
		Store: {
			registerModel: jest.fn(),
			getDefaultItemForModelType: jest.fn(),
			getItemForType: () => {
				return ({
					adapter: {}
				})
			}
		}
	})
})

import { Store } from 'ObojoboDraft/Common/store'

let OboModel = require.requireActual('ObojoboDraft/Common/models/obo-model').default

let registerObject = (o) => {
	Store.registerModel(o.type)

	if(o.children)
	{
		for(let child in o.children)
		{
			registerObject(child)
		}
	}
}

var localId = null;

OboModel.__create = (o) => {
	registerObject(o)
	return OboModel.create(o)
}
OboModel.__setNextGeneratedLocalId = (n) => {
	localId = n;
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