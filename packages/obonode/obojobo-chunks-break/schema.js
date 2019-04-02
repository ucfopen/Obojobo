import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const { NODE_DATA_INVALID } = SchemaViolations

const schema = {
	blocks: {
		'ObojoboDraft.Chunks.Break': {
			data: {
				content: c => !!c
			},
			isVoid: true,
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
