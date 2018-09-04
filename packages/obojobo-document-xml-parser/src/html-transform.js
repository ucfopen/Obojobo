let createTextGroup = require('./create-text-group');

let applyAlign = (node) => {
	if(node && node.attributes && node.attributes.align)
	{
		let align = node.attributes.align;
		delete node.attributes.align;
		// node.elements[0].elements[0].attributes = { align:align }
		node.elements[0].elements.forEach(el => {
			if(!el.attributes) el.attributes = {}
			el.attributes.align = align
		})
	}
}

let htmlTransform = (node) => {
	if(node.type === 'element')
	{
		if(!node.attributes) node.attributes = {}

		switch(node.name)
		{
			case 'h1':
			case 'h2':
				if(!node.attributes) node.attributes = {};
				node.attributes.headingLevel = parseInt(node.name.charAt(1), 10);
				node.name = 'ObojoboDraft.Chunks.Heading'
				node.elements = createTextGroup(node.elements)
				// if(node.attributes.align)
				// {
				// 	let align = node.attributes.align;
				// 	delete node.attributes.align;
				// 	node.elements[0].elements[0].attributes = { align:align }
				// }
				applyAlign(node)


				break;

			case 'ul':
			case 'ol':
				let text = node.elements

				let attrs = node.attributes
				node.attributes = { listStyles: { type: (node.name === 'ol' ? 'ordered' : 'unordered') }}
				node.elements = [{
					type: "element",
					name: "textGroup",
					attributes: attrs,
					elements: node.elements.map( (li) => {
						let liData = {};
						return ({
							type: "element",
							name: "t",
							elements: li.elements,
							attributes: li.attributes
						})
					})
				}]
				node.name = 'ObojoboDraft.Chunks.List'

				break;

				// let elements = node.elements.map( (node) => {
				// 	return createTextGroup(node.elements[0])
				// })

			case 'p':
				// node.elements = [ createTextGroup(node.elements) ]
				node.name = 'ObojoboDraft.Chunks.Text'
				node.elements = createTextGroup(node.elements)
				applyAlign(node)

				break;

			case 'pre':
				// node.elements = [ createTextGroup(node.elements) ]
				node.name = 'ObojoboDraft.Chunks.Code'

				let tEls = node.elements[0].text.split('\n').map( (text) => {
					let indent = 0;
					while(text.charAt(0) === '\t')
					{
						indent++;
						text = text.substr(1);
					}

					let attributes = indent > 0 ? { indent } : null;

					return ({
						type: "element",
						name: "t",
						attributes,
						elements: [{
							type: "text",
							text: text
						}]
					});
				})

				node.elements = node.elements = [{
					type: "element",
					name: "textGroup",
					elements: tEls
				}];

				applyAlign(node)

				break;

			case 'hr':
				node.name = 'ObojoboDraft.Chunks.Break'

				break;

			case 'figure':
				node.name = 'ObojoboDraft.Chunks.Figure'
				for(let i in node.elements)
				{
					switch(node.elements[i].name)
					{
						case 'img':
							node.attributes = node.elements[i].attributes;
							break;

						case 'figcaption':
							node.elements = createTextGroup(node.elements[i].elements);
							break;
					}
				}
				if(!node.attributes.size) node.attributes.size = 'custom'
				node.attributes.url = node.attributes.src
				delete node.attributes.src
				break;

			case 'img':
				node.name = 'ObojoboDraft.Chunks.Figure'
				if(node.attributes.width || node.attributes.height)
				{
					node.attributes.size = 'custom'
				}
				if(!node.attributes.size) node.attributes.size = 'custom'
				node.attributes.url = node.attributes.src
				delete node.attributes.src
				break;

			case 'table':
				let numRows = node.elements.length
				let numCols = node.elements[0].elements.length
				let header = node.elements[0].elements[0].name === 'th'

				let cells = []
				node.elements.forEach( (row) => {
					row.elements.forEach( (col) => {
						return cells.push(col.elements)
					})
				})

				node.elements = [{
					type: "element",
					name: "textGroup",
					elements: cells.map( (cell) => {
						return ({
							type: "element",
							name: "t",
							elements: cell
						})
					})
				}]

				// node.elements = [ {
				// 	type: 'element',
				// 	name: 'textGroup',
				// 	elements: createTextGroup(texts)
				// } ];
				node.name = 'ObojoboDraft.Chunks.Table'
				node.attributes = { numRows, numCols, header }
				break;
		}

		if(Object.keys(node.attributes).length === 0) delete node.attributes
	}

	if(node.elements)
	{
		for(let i in node.elements)
		{
			htmlTransform(node.elements[i])
		}
	}
}

module.exports = htmlTransform;