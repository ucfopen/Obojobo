import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { NODE_DATA_INVALID } = SchemaViolations

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.Figure': {
			data: {
				content: c => !!c
			},
			nodes: [
				{
					match: [{ object: 'text' }],
					min: 1,
					max: 1
				}
			],
			normalize: (editor, error) => {
				const { node } = error
				switch (error.code) {
					case NODE_DATA_INVALID: {
						return editor.setNodeByKey(node.key, {
							data: {
								content: {
									level: 2
								}
							}
						})
					}
				}
			}
		}
	}
}

export default schema
