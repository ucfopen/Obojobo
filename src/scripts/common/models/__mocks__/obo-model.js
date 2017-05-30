let OboModel = jest.genMockFromModule('../obo-model');

import Store from '../../store'

// OboModel.__initFromSampleObject = () => {

// }

console.log('HAHAHAH')
console.log('HAHAHAH')
console.log('HAHAHAH')
console.log('HAHAHAH')
console.log('HAHAHAH')
console.log('HAHAHAH')
console.log('HAHAHAH')
console.log('HAHAHAH')
console.log('HAHAHAH')
console.log('HAHAHAH')
console.log('HAHAHAH')

OboModel.__registerModel = (className, opts = null) => {
	Store.registerModel(className, opts)
}

let registerObject = (o) => {
	OboModel.__registerModel(o.type)

	if(o.children)
	{
		for(let child in o.children)
		{
			registerObject(child)
		}
	}
}

OboModel.__create = (o) => {
	registerObject(o)
	return OboModel.create(o)
}

export default OboModel

// OboModel.__create = (typeOrNameOrJson, attrs) => {
// 	if(typeof typeOrNameOrJson === 'object')
// 	{
// 		if(Store.getItemForType(typeOrNameOrJson.type)) OboModel.__registerModel(typeOrNameOrJson.type)

// 		let oboModel = OboModel.__create(typeOrNameOrJson.type, typeOrNameOrJson);

// 		if(oboModel !== null)
// 		{
// 			let children = typeOrNameOrJson.children;
// 			if(children !== null)
// 			{
// 				for(let child of children)
// 				{
// 					let c = OboModel.__create(child)
// 					oboModel.children.add(c)
// 				}
// 			}
// 		}

// 		return oboModel
// 	}

// 	let item = Store.getDefaultItemForModelType(typeOrNameOrJson);
// 	if (!item) {
// 		item = Store.getItemForType(typeOrNameOrJson);
// 	}

// 	if (!item) {
// 		console.log('null', typeOrNameOrJson)
// 		return null;
// 	}

// 	attrs.type = typeOrNameOrJson

// 	return new OboModel(attrs, item.adapter)
// }