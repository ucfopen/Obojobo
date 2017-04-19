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

	for(let i in el.value)
	{
		// console.log('call pt', el.elements, i, el.elements[i], t.text)
		parseText(el.value[i], t.text)
	}

	// console.log('parseT result', t);

	return t;
}

let parseText = (node, textItem) => {
	// console.log('parseText', node)
	if(node.type === 'text')
	{
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
		parseText(node.value[i], textItem)
	}

	styleRange.end = textItem.value.length
}

module.exports = parseTg;