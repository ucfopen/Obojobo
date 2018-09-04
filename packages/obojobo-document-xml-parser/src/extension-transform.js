let toHTML = (el) => {
	// console.log('eth', el);
	
	if(el instanceof Array)
	{
		return el.map( (childEl) => { return toHTML(childEl) } ).join('')
	}

	if(el.type === 'text')
	{
		return el.text
	}

	return '<' + el.name + '>' + el.elements.map( (childEl) => { return toHTML(childEl) } ).join('') + '</' + el.name + '>';
}

let extensionTransform = (node) => {
	// console.log('node', node)
	if(node.name === 'extension')
	{
		switch(node.attributes.type)
		{
			case 'edX:multipleChoiceQuestion':
				let problem = node.elements[0]
				let multiplechoiceresponse, demandhint, label, description, choicegroup, solution

				problem.elements.forEach( (childEl) => {
					switch(childEl.name)
					{
						case 'multiplechoiceresponse':
							// console.log('set', childEl);
							multiplechoiceresponse = childEl;
							break;
						
						case 'demandhint':
							demandhint = childEl;
							break;
					}
				})

				// console.log('mcr', multiplechoiceresponse);

				multiplechoiceresponse.elements.forEach( (childEl) => {
					switch(childEl.name)
					{
						case 'label':
							label = childEl;
							break;
						
						case 'description':
							description = childEl;
							break;
						
						case 'choicegroup':
							choicegroup = childEl;
							break;
						
						case 'solution':
							solution = childEl;
							break;
					}
				})
				
				let question = {
					type: 'element',
					name: 'ObojoboDraft.Chunks.Question',
					elements: [
						{
							type: 'element',
							name: 'ObojoboDraft.Chunks.HTML',
							elements: [],
							attributes: {
								html: toHTML(label.elements).trim()
							}
						}
					]
				}

				if(description)
				{
					question.elements.push({
						type: 'element',
						name: 'ObojoboDraft.Chunks.HTML',
						attributes: {
							html: toHTML(description.elements).trim()
						}
					})
				}

				if(solution)
				{
					question.elements.push({
						type: 'element',
						name: 'solution',
						elements: [
							{
								type: 'element',
								name: 'ObojoboDraft.Pages.Page',
								elements: [
									{
										type: 'element',
										name: 'ObojoboDraft.Chunks.HTML',
										attributes: {
											html: toHTML(solution.elements).trim()
										}
									}
								]
							}
						]
					})
				}

				question.elements.push({
					type: 'element',
					name: 'ObojoboDraft.Chunks.MCAssessment',
					elements: choicegroup.elements.map( (choiceEl) => {
						let choicehint
						choiceEl.elements.forEach( (childEl, index) => {
							if(childEl.name === 'choicehint')
							{
								choicehint = childEl;
								choiceEl.elements.splice(index, 1);
							}
						})

						let choice = {
							type: 'element',
							name: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
							attributes: {
								score: choiceEl.attributes.correct === 'true' ? 100 : 0
							},
							elements: [
								{
									type: 'element',
									name: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
									elements: [
										{
											type: 'element',
											name: 'ObojoboDraft.Chunks.HTML',
											attributes: { html:toHTML(choiceEl.elements).trim() }
										}
									]
								}
							]
						}

						if(choicehint)
						{
							let prefix = ''
							if(choicehint.attributes && choicehint.attributes.label)
							{
								prefix = choicehint.attributes.label + ': '
							}

							choice.elements.push({
								type: 'element',
								name: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
								elements: [
									{
										type: 'element',
										name: 'ObojoboDraft.Chunks.HTML',
										attributes: { html:prefix + toHTML(choicehint.elements).trim() }
									}
								]
							})
						}

						return choice;
					})
				})

				node.type = 'element';
				node.name = question.name;
				node.elements = question.elements;
				node.attributes = question.attributes;

				break;
		}
	}
	else if(node.elements)
	{
		for(let i in node.elements)
		{
			extensionTransform(node.elements[i])
		}
	}
}

module.exports = extensionTransform;