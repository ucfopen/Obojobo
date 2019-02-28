let generateId = require('./generate-id');

let getId = (id, shouldGenerateId) => {
	if(id) return id;
	if(shouldGenerateId) return generateId();
	return null;
}

let parseAttrs = (attrs) => {
	for(let k in attrs)
	{
		let attr = attrs[k]
		let floatAttr = parseFloat(attr)
		if(floatAttr.toString() === attr)
		{
			attrs[k] = floatAttr;
		}
		else if(attr === 'true')
		{
			attrs[k] = true;
		}
		else if(attr === 'false')
		{
			attrs[k] = false;
		}
	}

	return attrs;
}

let draftJsonTransform = (node, shouldGenerateId) => {
	if(!node) return;

	for(let prop in node)
	{
		if(typeof node[prop] === 'object')
		{
			draftJsonTransform(node[prop], shouldGenerateId)
		}
	}

	for(let prop in node)
	{
		if(node[prop] && typeof node[prop] === 'object' && node[prop].type && node[prop].type === 'element')
		{
			let o = node[prop]
			if(!o.attributes)
			{
				o.attributes = {}
			}

			if(!o.elements)
			{
				o.elements = []
			}

			let id = getId(o.attributes.id, shouldGenerateId);
			delete o.attributes.id;

			node[prop] = {
				id: id,
				type: o.name,
				content: parseAttrs(o.attributes),
				children: o.elements
			}
		}
	}
}

module.exports = draftJsonTransform;