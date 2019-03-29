const schema = {
	blocks: {
		'ObojoboDraft.Chunks.ActionButton': {
			nodes: [
				{
					match: [{ object: 'text' }],
					min: 1,
					max: 1
				}
			]
		}
	}
}

export default schema
