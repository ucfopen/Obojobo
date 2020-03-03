const schema = {
	blocks: {
		'ObojoboDraft.Chunks.MathEquation': {
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
