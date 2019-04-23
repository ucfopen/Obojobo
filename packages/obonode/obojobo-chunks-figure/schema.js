const schema = {
	blocks: {
		'ObojoboDraft.Chunks.Figure': {
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
