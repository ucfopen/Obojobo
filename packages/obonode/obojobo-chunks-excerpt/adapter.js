import Common from 'obojobo-document-engine/src/scripts/common'

const { TextGroup } = Common.textGroup

const adapter = {
	construct(model, attrs) {
		if (attrs && attrs.content && attrs.content.excerpt) {
			model.modelState.excerpt = TextGroup.fromDescriptor(attrs.content.excerpt, Infinity, {
				indent: 0,
				hangingIndent: false,
				align: 'left'
			})
		} else {
			model.modelState.excerpt = TextGroup.create(Infinity, {
				indent: 0,
				hangingIndent: false,
				align: 'left'
			})
		}

		if (attrs && attrs.content && attrs.content.citation) {
			model.modelState.citation = TextGroup.fromDescriptor(attrs.content.citation, Infinity, {
				indent: 0,
				hangingIndent: false,
				align: 'left'
			})
		} else {
			model.modelState.citation = TextGroup.create(Infinity, {
				indent: 0,
				hangingIndent: false,
				align: 'left'
			})
		}

		model.setStateProp('bodyStyle', 'filled-box', p => p.toLowerCase(), [
			'filled-box',
			'bordered-box',
			'white-paper',
			'modern-paper',
			'yellow-paper',
			'aged-paper',
			'modern-book-page',
			'old-book-page',
			'none'
		])

		model.setStateProp('font', 'serif', p => p.toLowerCase(), [
			'serif',
			'sans',
			'monospace',
			'times-new-roman',
			'georgia',
			'helvetica',
			'courier',
			'palatino'
		])

		model.setStateProp('topEdge', 'normal', p => p.toLowerCase(), ['normal', 'fade', 'jagged'])

		model.setStateProp('bottomEdge', 'normal', p => p.toLowerCase(), ['normal', 'fade', 'jagged'])

		model.setStateProp('width', 'medium', p => p.toLowerCase(), [
			'large',
			'medium',
			'small',
			'extra-small'
		])
	},

	clone(model, clone) {
		clone.modelState.excerpt = model.modelState.excerpt.clone()
		clone.modelState.citation = model.modelState.citation.clone()
	},

	toJSON(model, json) {
		json.content.excerpt = model.modelState.excerpt.toDescriptor()
		json.content.citation = model.modelState.citation.toDescriptor()
	}
}

export default adapter
