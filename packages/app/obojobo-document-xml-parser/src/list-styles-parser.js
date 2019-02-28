let parseListStyles = (el) => {
	let listStyles = {};

	el.elements.forEach( (child) => {
		switch(child.name)
		{
			case 'type':
				listStyles.type = child.value[0].text;
				break;
			
			case 'indents':
				listStyles.indents = parseIndents(child.value);
				break;
		}
	} )

	return listStyles;
}

let parseIndents = (indentsArr) => {
	let indents = {};
	for(let i in indentsArr)
	{
		let indentEl = indentsArr[i];
		let level = indentEl.attributes.level;
		delete indentEl.attributes.level;
		indents[level] = indentEl.attributes;
	}
	
	return indents;
}

module.exports = parseListStyles;