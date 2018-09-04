let parseTg = (el) => {
	// console.log('pTg', el)

	let tg = []

	for(let i in el.elements)
	{
		tg.push(parseT(el.elements[i]))
	}

	// console.log('=', tg)

	return tg;
}

let parseT = (el) => {
	// let data = (el.attributes && el.attributes.data) ? el.attributes.data : {};
	// el.attributes = data;


	let t = {
		text: {
			value: '',
			styleList: []
		},
		data: el.attributes || null
	}

	// let foundText = false;
	// let lastTextNode = null;
	for(let i in el.value)
	{
		// console.log('call pt', el.elements, i, el.elements[i], t.text)
		parseText(el.value[i], t.text) //, foundText, lastTextNode)
	}

	// if(lastTextNode) lastTextNode.text = lastTextNode.text.replace(/\s+$/, '');

	// console.log('parseT result', t);

	return t;
}

let parseText = (node, textItem, foundText, lastTextNode) => {
	// console.log('parseText', node)
	if(node.type === 'text')
	{
		if(!foundText && typeof node.text === 'string')
		{
			foundText = true;
			// node.text = node.text.replace(/^\s+/, '');
		}

		lastTextNode = node;
		textItem.value += node.text
		return
	}

	let styleRange
	let type = node.name
	let data = {}
	switch(node.name)
	{
		case 'latex':
			type = '_latex'
			break;
		
		case 'a':
			data = {
				href: node.attributes.href
			}
			break;
		
		case 'sup':
			data = 1;
			break;
		
		case 'sub':
			type = 'sup';
			data = -1;
			break;
	}

	styleRange = {
		type: type,
		data: data,
		start: textItem.value.length,
		end: 0
	}

	textItem.styleList.push(styleRange)

	for(let i in node.value)
	{
		parseText(node.value[i], textItem)//, foundText, lastTextNode)
	}

	styleRange.end = textItem.value.length
}

module.exports = parseTg;