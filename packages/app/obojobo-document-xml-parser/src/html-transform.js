const createTextGroup = require('./create-text-group')

const applyAlign = node => {
	if (node && node.attributes && node.attributes.align) {
		const align = node.attributes.align
		delete node.attributes.align
		node.elements[0].elements.forEach(el => {
			if (!el.attributes) el.attributes = {}
			el.attributes.align = align
		})
	}
}

const htmlTransform = node => {
	if (node.type === 'element') {
		if (!node.attributes) node.attributes = {}

		switch (node.name) {
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6':
				if (!node.attributes) node.attributes = {}
				node.attributes.headingLevel = parseInt(node.name.charAt(1), 10)
				node.name = 'ObojoboDraft.Chunks.Heading'
				node.elements = createTextGroup(node.elements)

				applyAlign(node)

				break

			case 'ul':
			case 'ol': {
				const attrs = node.attributes
				node.attributes = {
					listStyles: { type: node.name === 'ol' ? 'ordered' : 'unordered' }
				}
				node.elements = [
					{
						type: 'element',
						name: 'textGroup',
						attributes: attrs,
						elements: node.elements.map(li => {
							return {
								type: 'element',
								name: 't',
								elements: li.elements,
								attributes: li.attributes
							}
						})
					}
				]
				node.name = 'ObojoboDraft.Chunks.List'

				break
			}

			case 'p':
				node.name = 'ObojoboDraft.Chunks.Text'
				node.elements = createTextGroup(node.elements)
				applyAlign(node)

				break

			case 'pre': {
				// node.elements = [ createTextGroup(node.elements) ]
				node.name = 'ObojoboDraft.Chunks.Code'

				const tEls = node.elements[0].text.split('\n').map(text => {
					let indent = 0
					while (text.charAt(0) === '\t') {
						indent++
						text = text.substr(1)
					}

					const attributes = indent > 0 ? { indent } : null

					return {
						type: 'element',
						name: 't',
						attributes,
						elements: [
							{
								type: 'text',
								text: text
							}
						]
					}
				})

				node.elements = node.elements = [
					{
						type: 'element',
						name: 'textGroup',
						elements: tEls
					}
				]

				applyAlign(node)

				break
			}

			case 'hr':
				node.name = 'ObojoboDraft.Chunks.Break'

				break

			case 'figure': {
				// when there is no figcaption
				// node.elements will be an empty array
				// so img is not processed again later
				let newElements = []
				node.name = 'ObojoboDraft.Chunks.Figure'
				for (const i in node.elements) {
					switch (node.elements[i].name) {
						case 'img':
							node.attributes = node.elements[i].attributes
							break

						case 'figcaption':
							newElements = createTextGroup(node.elements[i].elements)
							break
					}
				}
				node.elements = newElements
				if (!node.attributes.size) node.attributes.size = 'custom'
				node.attributes.url = node.attributes.src
				delete node.attributes.src
				break
			}

			case 'img':
				node.name = 'ObojoboDraft.Chunks.Figure'
				if (node.attributes.width || node.attributes.height) {
					node.attributes.size = 'custom'
				}
				if (!node.attributes.size) node.attributes.size = 'custom'
				node.attributes.url = node.attributes.src
				delete node.attributes.src
				break

			case 'table': {
				const numRows = node.elements.length
				const numCols = node.elements[0].elements.length
				const header = node.elements[0].elements[0].name === 'th'

				const cells = []
				node.elements.forEach(row => {
					row.elements.forEach(col => {
						return cells.push(col.elements)
					})
				})

				node.elements = [
					{
						type: 'element',
						name: 'textGroup',
						elements: cells.map(cell => {
							return {
								type: 'element',
								name: 't',
								elements: cell
							}
						})
					}
				]

				node.name = 'ObojoboDraft.Chunks.Table'
				node.attributes = { numRows, numCols, header }
				break
			}
		}

		if (Object.keys(node.attributes).length === 0) delete node.attributes
	}

	if (node.elements) {
		for (const i in node.elements) {
			htmlTransform(node.elements[i])
		}
	}
}

module.exports = htmlTransform
